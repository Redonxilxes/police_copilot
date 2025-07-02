import fetch from "node-fetch";

const apiKey = "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";

async function probarOpenAI() {
  const mensaje = "¿Cuál es la capital de Francia?";

  const respuesta = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Eres un asistente útil." },
        { role: "user", content: mensaje }
      ]
    })
  });

  const data = await respuesta.json();
  console.log("\n✅ Respuesta completa desde OpenAI:\n");
console.log(JSON.stringify(data, null, 2));

console.log("\n🧾 Texto generado por GPT:\n");
console.log(data.choices?.[0]?.message?.content || "⚠️ No se recibió contenido del modelo.");

}

probarOpenAI().catch(error => {
  console.error("❌ Error al probar OpenAI:", error);
});
