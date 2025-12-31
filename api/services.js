import { createClient } from "@supabase/supabase-js";

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;

const buildTimeSlots = () => {
  const slots = [];
  for (let hour = 10; hour <= 20; hour += 1) {
    slots.push(`${String(hour).padStart(2, "0")}:00`);
  }
  return slots;
};

const defaultAvailableTimes = buildTimeSlots();
const defaultAvailableDays = [1, 2, 3, 4, 5, 6];

const normalizeDays = (value) => {
  if (!Array.isArray(value)) return defaultAvailableDays;
  const normalized = value
    .map((day) => Number(day))
    .filter((day) => Number.isInteger(day) && day >= 0 && day <= 6);
  return normalized.length ? normalized : defaultAvailableDays;
};

const getSupabase = () => {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase env vars missing");
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
};

const mapDbToService = (row) => ({
  id: row.id,
  name: row.name,
  duration: row.duration,
  price: Number(row.price),
  availableTimes:
    Array.isArray(row.available_times) && row.available_times.length > 0
      ? row.available_times
      : defaultAvailableTimes,
  availableDays: normalizeDays(row.available_days),
});

export default async function handler(req, res) {
  try {
    const supabase = getSupabase();
    const method = req.method || "GET";

    if (method === "GET") {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("name", { ascending: true });
      if (error) {
        res.status(500).json({ error: "No se pudieron cargar los servicios." });
        return;
      }
      res.status(200).json(data.map(mapDbToService));
      return;
    }

    const rawBody = req.body || {};
    const body = typeof rawBody === "string" ? JSON.parse(rawBody) : rawBody;

    if (method === "POST") {
      const { name, duration, price, availableTimes, availableDays } = body;
      const normalizedPrice = Number(price);
      if (!name || !duration || Number.isNaN(normalizedPrice)) {
        res.status(400).json({ error: "Faltan datos obligatorios." });
        return;
      }
      const payload = {
        name: name.trim(),
        duration: duration.trim(),
        price: normalizedPrice,
        available_times:
          Array.isArray(availableTimes) && availableTimes.length > 0
            ? availableTimes
            : defaultAvailableTimes,
        available_days: normalizeDays(availableDays),
      };
      const { data, error } = await supabase
        .from("services")
        .insert(payload)
        .select("*")
        .single();
      if (error) {
        res.status(500).json({ error: "No se pudo crear el servicio." });
        return;
      }
      res.status(201).json(mapDbToService(data));
      return;
    }

    if (method === "PATCH") {
      const { id, name, duration, price, availableTimes, availableDays } = body;
      if (!id) {
        res.status(400).json({ error: "Falta el id del servicio." });
        return;
      }

      const updates = {};
      if (name) updates.name = name.trim();
      if (duration) updates.duration = duration.trim();
      if (price !== undefined) {
        const normalizedPrice = Number(price);
        if (Number.isNaN(normalizedPrice)) {
          res.status(400).json({ error: "Precio inválido." });
          return;
        }
        updates.price = normalizedPrice;
      }
      if (Array.isArray(availableTimes)) {
        updates.available_times = availableTimes.length
          ? availableTimes
          : defaultAvailableTimes;
      }
      if (Array.isArray(availableDays)) {
        updates.available_days = normalizeDays(availableDays);
      }

      if (Object.keys(updates).length === 0) {
        res.status(400).json({ error: "No hay campos para actualizar." });
        return;
      }

      const { data, error } = await supabase
        .from("services")
        .update(updates)
        .eq("id", id)
        .select("*")
        .single();

      if (error) {
        res.status(500).json({ error: "No se pudo actualizar el servicio." });
        return;
      }

      if (updates.name) {
        await supabase
          .from("reservations")
          .update({ service: updates.name })
          .eq("service_id", id);
      }

      res.status(200).json(mapDbToService(data));
      return;
    }

    if (method === "DELETE") {
      const id =
        (req.query && req.query.id) ||
        (body && body.id) ||
        null;
      if (!id) {
        res.status(400).json({ error: "Falta el id del servicio." });
        return;
      }
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) {
        res.status(500).json({ error: "No se pudo eliminar el servicio." });
        return;
      }
      res.status(200).json({ success: true });
      return;
    }

    res.status(405).json({ error: "Método no permitido." });
  } catch (error) {
    res.status(500).json({ error: "Error interno en la API." });
  }
}
