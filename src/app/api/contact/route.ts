import nodemailer from "nodemailer";

export const runtime = "nodejs";

const TO_EMAIL = "lokanathpanda128@gmail.com";

type Payload = {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
};

function clean(value: unknown, max: number) {
  return String(value ?? "").trim().slice(0, max);
}

export async function POST(req: Request) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS?.replace(/\s+/g, "");
  const port = Number(process.env.SMTP_PORT || 587);

  if (!host || !user || !pass) {
    return Response.json(
      { error: "Mail is not configured yet. Add SMTP credentials in the env file." },
      { status: 500 }
    );
  }

  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const phone = clean(body.phone, 30);
  const subject = clean(body.subject, 80);
  const message = clean(body.message, 4000);

  if (!name || !email || !phone || !subject || !message) {
    return Response.json({ error: "Please fill in every field." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (!/^[0-9+\-\s()]{8,20}$/.test(phone)) {
    return Response.json({ error: "Enter a valid phone number." }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || user,
      to: process.env.CONTACT_TO_EMAIL || TO_EMAIL,
      replyTo: email,
      subject: `Portfolio contact: ${subject}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        `Subject: ${subject}`,
        "",
        message,
      ].join("\n"),
    });
  } catch {
    return Response.json(
      { error: "Could not send the message. Check the SMTP credentials and try again." },
      { status: 502 }
    );
  }

  return Response.json({ ok: true });
}
