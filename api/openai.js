export default async function handler(req, res) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error("❌ API key no definida en las variables de entorno");
    return res.status(500).json({ error: "API key no definida" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { message } = req.body;

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

    // Verificamos si hubo un error en la respuesta
    if (data.error) {
      console.error("❌ Error desde OpenAI:", data.error);
      return res.status(500).json({ error: "Error al procesar la respuesta", detalle: data.error });
    }

    // Extraemos la respuesta del mensaje
    const contenido = data.choices?.[0]?.message?.content;

    if (!contenido) {
      return res.status(500).json({ error: "Respuesta de OpenAI vacía o incorrecta" });
    }

    // Devolvemos la respuesta al cliente
    res.status(200).json({ respuesta: contenido });

  } catch (error) {
    console.error("❌ Error en el servidor:", error);
    res.status(500).json({ error: "Error interno del servidor", detalle: error.message });
  }
}
