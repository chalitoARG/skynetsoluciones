// netlify/functions/sendMail.js
exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  try {
    const data = JSON.parse(event.body || "{}");
    const apiKey = process.env.SMTP2GO_API_KEY;
    if (!apiKey) return { statusCode: 500, body: "Falta SMTP2GO_API_KEY en variables de entorno" };

    const sender = process.env.SENDER_EMAIL || "info@skynetsoluciones.com";
    const to = process.env.TO_EMAIL || "info@skynetsoluciones.com";

    const payload = {
      sender,
      to: [to],
      subject: `Consulta web: ${data.nombre || "sin nombre"}`,
      text_body: `Nombre: ${data.nombre || ""}\nEmail: ${data.email || ""}\nMensaje:\n${data.mensaje || ""}`
    };

    const res = await fetch("https://api.smtp2go.com/v3/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Smtp2go-Api-Key": apiKey
      },
      body: JSON.stringify(payload)
    });

    const result = await res.json();
    if (!res.ok) {
      return { statusCode: 500, body: JSON.stringify({ error: "SMTP2GO error", detail: result }) };
    }
    return { statusCode: 200, body: JSON.stringify({ ok: true, result }) };
  } catch (err) {
    return { statusCode: 500, body: err.message || String(err) };
  }
};
