// api/openai.js
export default async function handler(req, res) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { message } = req.body;

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
   res.status(200).json({ reply: data.choices[0].message.content });

  } catch (error) {
    console.error("Error OpenAI:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
}
