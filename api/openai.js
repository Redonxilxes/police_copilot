export default async function handler(req, res) {
  const apiKey = process.env.OPENAI_API_KEY;
  console.log("API Key exists:", !!apiKey);
  if (!apiKey) {
    console.error("❌ API key no definida en las variables de entorno");
    return res.status(500).json({ error: "API key no definida" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { message } = req.body;
    console.log("Request body:", req.body); // Log del cuerpo de la solicitud
    if (!message) {
      return res.status(400).json({ error: "El campo 'message' es requerido" });
    }

    const respuesta = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Eres un asistente útil y profesional." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await respuesta.json();
    console.log("OpenAI Response:", JSON.stringify(data, null, 2)); // Log completo de la respuesta

    if (data.error) {
      console.error("❌ Error desde OpenAI:", data.error);
      return res.status(500).json({ error: "Error al procesar la respuesta", detalle: data.error.message });
    }

    const contenido = data.choices?.[0]?.message?.content;
    if (!contenido) {
      console.error("OpenAI Response:", JSON.stringify(data, null, 2));
      return res.status(500).json({ error: "Respuesta de OpenAI vacía o incorrecta" });
    }

    res.status(200).json({ reply: contenido }); // Cambiado a 'reply' para consistencia
  } catch (error) {
    console.error("❌ Error en el servidor:", error);
    res.status(500).json({ error: "Error interno del servidor", detalle: error.message });
  }
}