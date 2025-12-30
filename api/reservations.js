import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const resendApiKey = process.env.RESEND_API_KEY;
const adminEmail =
  process.env.ADMIN_EMAIL || "martinalejandrocenturion@gmail.com";

const supabase =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null;

const parseBody = (req) => {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch (error) {
      return {};
    }
  }
  return req.body;
};

const sendNotificationEmail = async (reservation) => {
  if (!resendApiKey || !adminEmail) return;
  const resend = new Resend(resendApiKey);
  const subject = "Nueva reserva de turno";
  const text = [
    "Se registró una nueva reserva.",
    "",
    `Cliente: ${reservation.name}`,
    `WhatsApp: ${reservation.whatsapp}`,
    `Servicio: ${reservation.service}`,
    `Fecha: ${reservation.date}`,
    `Horario: ${reservation.time}`,
    `Estado: ${reservation.status}`,
  ].join("\n");

  await resend.emails.send({
    from: "Turnos <onboarding@resend.dev>",
    to: adminEmail,
    subject,
    text,
  });
};

export default async function handler(req, res) {
  if (!supabase) {
    res.status(500).json({ error: "Missing Supabase configuration." });
    return;
  }

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .order("date", { ascending: true })
      .order("time", { ascending: true });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json(data || []);
    return;
  }

  if (req.method === "POST") {
    const body = parseBody(req);
    const name = (body.name || "").trim();
    const whatsapp = (body.whatsapp || "").trim();
    const service = (body.service || "").trim();
    const date = body.date;
    const time = body.time;
    const status = body.status || "pending";

    if (!name || !whatsapp || !service || !date || !time) {
      res.status(400).json({ error: "Missing required fields." });
      return;
    }

    const { data, error } = await supabase
      .from("reservations")
      .insert({ name, whatsapp, service, date, time, status })
      .select("*")
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    try {
      await sendNotificationEmail(data);
    } catch (emailError) {
      console.error("Resend error:", emailError);
    }

    res.status(200).json(data);
    return;
  }

  if (req.method === "PATCH") {
    const body = parseBody(req);
    const { id, status, date, time } = body;

    if (!id) {
      res.status(400).json({ error: "Missing reservation id." });
      return;
    }

    const updates = {};
    if (status) updates.status = status;
    if (date) updates.date = date;
    if (time) updates.time = time;

    if (Object.keys(updates).length === 0) {
      res.status(400).json({ error: "No updates provided." });
      return;
    }

    const { data, error } = await supabase
      .from("reservations")
      .update(updates)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json(data);
    return;
  }

  res.status(405).json({ error: "Method not allowed." });
}
