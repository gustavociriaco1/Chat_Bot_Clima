require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração de CORS
app.use(cors({
  origin: 'http://127.0.0.1:5500',
  methods: 'GET,POST',
}));
app.use(express.json());
app.use(express.static("public"));

// Inicializa OpenAI (SDK v4+)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

// --- Funções de clima ---
function isWeatherQuestion(message) {
  const keywords = ["tempo", "clima", "previsão", "chuva", "sol", "temperatura"];
  return keywords.some(word => message.toLowerCase().includes(word));
}

function extrairCidade(message) {
  const match = message.match(/\b(?:em|na|no|para)\s+(.+?)(?:[?.!]|$)/i);
  if (match && match[1]) return formatarCidade(match[1].replace(/[?.!,]/g, "").trim());

  const tokens = message.trim().split(/\s+/);
  if (tokens.length === 1 && tokens[0].length > 1 && tokens[0].length < 40) {
    return formatarCidade(tokens[0]);
  }
  return null;
}

function formatarCidade(cidade) {
  return cidade
    .split(" ")
    .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(" ");
}

async function buscarClima(cidade) {
  try {
    const r = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          q: cidade,
          appid: process.env.WEATHER_KEY,
          units: "metric",
          lang: "pt_br"
        }
      }
    );
    const clima = r.data.weather?.[0]?.description ?? "indisponível";
    const temp = r.data.main?.temp ?? "—";
    return `O clima está ${clima}, com temperatura de ${temp}°C.`;
  } catch (err) {
    return `Não consegui encontrar a previsão para "${cidade}". Pode confirmar o nome da cidade?`;
  }
}

// --- Função para conversar sobre qualquer assunto usando OpenAI ---
async function responderGeral(message) {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "Você é um chatbot amigável e inteligente. Converse naturalmente com a pessoa e comente sobre o que ela disse."
      },
      {
        role: "user",
        content: message
      }
    ],
    temperature: 0.7,
    max_tokens: 150
  });

  return completion.choices[0].message.content.trim();
}

// --- Rota principal ---
app.post("/chat", async (req, res) => {
  const { message } = req.body;
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Mensagem não fornecida" });
  }

  try {
    if (isWeatherQuestion(message)) {
      const cidade = extrairCidade(message);
      if (cidade) {
        const resposta = await buscarClima(cidade);
        return res.json({ resposta });
      } else {
        return res.json({ resposta: "Por favor, informe a cidade que deseja saber o clima." });
      }
    } else {
      const resposta = await responderGeral(message);
      return res.json({ resposta });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ resposta: "Ocorreu um erro ao processar sua mensagem."+err });
  }
});

// --- Start ---
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
