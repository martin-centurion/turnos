import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const {
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  RESEND_API_KEY,
  RESEND_FROM,
  ADMIN_EMAIL,
} = process.env;

const allowedStatuses = new Set([
  "pending",
  "approved",
  "rejected",
  "completed",
]);

const toIsoDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getSupabase = () => {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase env vars missing");
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
};

const mapDbToReservation = (row) => ({
  id: row.id,
  name: row.name,
  whatsapp: row.whatsapp,
  service: row.service,
  serviceId: row.service_id || "",
  date: row.date,
  time: row.time,
  status: row.status,
  reservationId: row.reservation_id,
});

const sendAdminEmail = async (reservation) => {
  if (!RESEND_API_KEY || !ADMIN_EMAIL) return;
  const resend = new Resend(RESEND_API_KEY);
  const from = RESEND_FROM || "onboarding@resend.dev";
  const subject = `Nueva reserva: ${reservation.name} (${reservation.date} ${reservation.time})`;
  const html = `
    <h2>Nueva reserva</h2>
    <p><strong>Cliente:</strong> ${reservation.name}</p>
    <p><strong>WhatsApp:</strong> ${reservation.whatsapp}</p>
    <p><strong>Servicio:</strong> ${reservation.service}</p>
    <p><strong>Fecha:</strong> ${reservation.date}</p>
    <p><strong>Horario:</strong> ${reservation.time}</p>
    <p><strong>ID de reserva:</strong> ${reservation.reservationId}</p>
  `;
  await resend.emails.send({
    from,
    to: [ADMIN_EMAIL],
    subject,
    html,
  });
};

export default async function handler(req, res) {
  try {
    const supabase = getSupabase();
    const method = req.method || "GET";

    if (method === "GET") {
      const { date, month } = req.query || {};
      let query = supabase
        .from("reservations")
        .select("*")
        .order("date", { ascending: true })
        .order("time", { ascending: true });

      if (date) {
        query = query.eq("date", date);
      } else if (month) {
        const [yearStr, monthStr] = month.split("-");
        const year = Number(yearStr);
        const monthIndex = Number(monthStr) - 1;
        if (!Number.isNaN(year) && !Number.isNaN(monthIndex)) {
          const start = new Date(year, monthIndex, 1);
          const nextMonth = new Date(year, monthIndex + 1, 1);
          query = query
            .gte("date", toIsoDate(start))
            .lt("date", toIsoDate(nextMonth));
        }
      }

      const { data, error } = await query;
      if (error) {
        res.status(500).json({ error: "No se pudieron cargar las reservas." });
        return;
      }
      res.status(200).json(data.map(mapDbToReservation));
      return;
    }

    const rawBody = req.body || {};
    const body = typeof rawBody === "string" ? JSON.parse(rawBody) : rawBody;

    if (method === "POST") {
      const {
        name,
        whatsapp,
        service,
        serviceId,
        date,
        time,
        status,
        reservationId,
      } = body;

      if (!name || !whatsapp || !service || !date || !time) {
        res.status(400).json({ error: "Faltan datos obligatorios." });
        return;
      }

      const resolvedReservationId =
        reservationId ||
        `RES-${Date.now().toString(36).toUpperCase()}-${Math.random()
          .toString(36)
          .slice(2, 6)
          .toUpperCase()}`;

      const payload = {
        name: name.trim(),
        whatsapp: whatsapp.trim(),
        service: service.trim(),
        service_id: serviceId || null,
        date,
        time,
        status: status && allowedStatuses.has(status) ? status : "pending",
        reservation_id: resolvedReservationId,
      };

      const { data, error } = await supabase
        .from("reservations")
        .insert(payload)
        .select("*")
        .single();

      if (error) {
        res.status(500).json({ error: "No se pudo guardar la reserva." });
        return;
      }

      const mapped = mapDbToReservation(data);
      await sendAdminEmail(mapped);
      res.status(201).json(mapped);
      return;
    }

    if (method === "PATCH") {
      const { id, status, date, time, name, whatsapp, service, serviceId } =
        body;

      if (!id) {
        res.status(400).json({ error: "Falta el id de la reserva." });
        return;
      }

      if (status && !allowedStatuses.has(status)) {
        res.status(400).json({ error: "Estado inválido." });
        return;
      }

      const updates = {};
      if (status) updates.status = status;
      if (date) updates.date = date;
      if (time) updates.time = time;
      if (name) updates.name = name.trim();
      if (whatsapp) updates.whatsapp = whatsapp.trim();
      if (service) updates.service = service.trim();
      if (serviceId !== undefined) updates.service_id = serviceId || null;

      if (Object.keys(updates).length === 0) {
        res.status(400).json({ error: "No hay campos para actualizar." });
        return;
      }

      const { data, error } = await supabase
        .from("reservations")
        .update(updates)
        .eq("id", id)
        .select("*")
        .single();

      if (error) {
        res.status(500).json({ error: "No se pudo actualizar la reserva." });
        return;
      }

      res.status(200).json(mapDbToReservation(data));
      return;
    }

    res.status(405).json({ error: "Método no permitido." });
  } catch (error) {
    res.status(500).json({ error: "Error interno en la API." });
  }
}
