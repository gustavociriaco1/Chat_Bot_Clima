require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração de CORS
app.use(cors({
  origin: 'http://127.0.0.1:5500',
  methods: 'GET,POST',
}));
app.use(express.json());
app.use(express.static("public"));

// Função para conversar usando o modelo meta-llama/llama-4-scout-17b-16e-instruct da Groq
async function responderGeral(message) {
  try {
    const response = await axios.post(
      "https://api.groq.com/v1/engines/meta-llama/llama-4-scout-17b-16e-instruct/completions",
      {
        prompt: message,
        max_tokens: 150,
        temperature: 0.7,
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const resposta = response.data.choices[0].text.trim();
    return resposta;
  } catch (err) {
    console.error(err);
    return "Ocorreu um erro ao processar sua mensagem.";
  }
}

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
        const respostaClima = await buscarClima(cidade);
        return res.json({
          clima: 1,
          cidade: cidade,
          resposta: respostaClima
        });
      } else {
        return res.json({
          clima: 1,
          cidade: "",
          resposta: "Por favor, informe a cidade que deseja saber o clima."
        });
      }
    } else {
      const respostaGeral = await responderGeral(message);  // Usando o modelo Groq para responder
      return res.json({
        clima: 0,
        cidade: "",
        resposta: respostaGeral
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      clima: 0,
      cidade: "",
      resposta: "Ocorreu um erro ao processar sua mensagem."
    });
  }
});

// --- Start ---
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
