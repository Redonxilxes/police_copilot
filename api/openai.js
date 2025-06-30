export default async function handler(req, res) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Falta el mensaje en la solicitud' });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
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

    const data = await response.json();

    if (!data || !data.choices || !data.choices[0]) {
      console.error("Respuesta de OpenAI no válida:", data);
      return res.status(500).json({ error: "Respuesta inválida de OpenAI" });
    }

    res.status(200).json({ respuesta: data.choices[0].message.content });

  } catch (error) {
    console.error("Error OpenAI:", error);
    try {
      const errorBody = await response.text();
      console.error("Respuesta completa:", errorBody);
      return res.status(500).json({ error: "Error en el servidor", detalle: errorBody });
    } catch (e) {
      return res.status(500).json({ error: "Error desconocido en el servidor", detalle: e.message });
    }
    console.error("Error al llamar a OpenAI:", error);
    res.status(500).json({ error: "Error en el servidor al comunicarse con OpenAI" });
  }
}