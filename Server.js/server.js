require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração de CORS
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    methods: "GET,POST",
  })
);

app.use(express.json());
app.use(express.static("public"));

// Função para classificar a intenção do usuário usando Groq
async function analisarMensagem(message) {
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
          {
            role: "system",
            content: `Você é um classificador de intenções. Sempre responda em JSON válido com este formato:
{
  "clima": 0 ou 1,
  "cidade": "nome da cidade ou vazio",
  "resposta": "resposta amigável ao usuário"
}
IMPORTANTE:
- Não use acentos graves (\\) ou blocos de código.
- "clima" deve ser 1 apenas se a pergunta for sobre clima/previsão do tempo.
- "cidade" deve estar preenchido apenas se for sobre clima.`,
          },
          { role: "user", content: message },
        ],
        temperature: 0,
        max_completion_tokens: 200,
        top_p: 1,
        stream: false,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const conteudo = response.data.choices[0].message.content.trim();
    return JSON.parse(conteudo); // já retorna objeto { clima, cidade, resposta }
  } catch (err) {
    console.error("Erro ao analisar mensagem:", err.response?.data || err.message);
    return {
      clima: 0,
      cidade: "",
      resposta: "Desculpe, não consegui processar sua mensagem.",
    };
  }
}

// Função para buscar clima
async function buscarClima(cidade) {
  try {
    const r = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
      params: {
        q: cidade,
        appid: process.env.WEATHER_KEY,
        units: "metric",
        lang: "pt_br",
      },
    });

    const clima = r.data.weather?.[0]?.description ?? "indisponível";
    const temp = r.data.main?.temp ?? "—";

    return `O clima está ${clima}, com temperatura de ${temp}°C.`;
  } catch (err) {
    return `Não consegui encontrar a previsão para "${cidade}". Pode confirmar o nome da cidade?`;
  }
}

// --- Rota principal ---
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Mensagem não fornecida" });
  }

  try {
    const analise = await analisarMensagem(message);

    if (analise.clima === 1 && analise.cidade) {
      const respostaClima = await buscarClima(analise.cidade);
      return res.json({
        clima: 1,
        cidade: analise.cidade,
        resposta: respostaClima,
      });
    }

    // Caso geral
    return res.json({
      clima: 0,
      cidade: "",
      resposta: analise.resposta,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      clima: 0,
      cidade: "",
      resposta: "Ocorreu um erro ao processar sua mensagem.",
    });
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
