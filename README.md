ChatBot Inteligente - Clima e Conversa Geral

Este projeto é um chatbot que combina informações sobre o clima com uma conversa inteligente utilizando a API OpenWeather para prever o tempo e a API Groq (com o modelo meta-llama/llama-4-scout-17b-16e-instruct) para conversas gerais. O servidor Express recebe mensagens do usuário, verifica se a mensagem é uma consulta sobre o clima ou se deve ser tratada como uma conversa geral, e responde de acordo.

Funcionalidades

Consulta de Clima: O bot pode identificar se a mensagem do usuário é sobre o clima e retornar a previsão do tempo para uma cidade específica.

Conversas Gerais: Para mensagens não relacionadas ao clima, o bot usa a API Groq (modelo meta-llama/llama-4-scout-17b-16e-instruct) para responder com uma conversa natural e inteligente.

Extração de Cidade: O bot tenta extrair o nome da cidade da mensagem do usuário para buscar a previsão do tempo de forma eficiente.

Tecnologias Usadas

Node.js: Ambiente de execução JavaScript.

Express: Framework web para Node.js.

Axios: Biblioteca para fazer requisições HTTP (usada para chamar as APIs do OpenWeather e Groq).

dotenv: Carregamento de variáveis de ambiente a partir de um arquivo .env.

CORS: Para permitir comunicação com o frontend local.

OpenWeather API: Para obter informações sobre o clima.

Groq API: Para gerar respostas inteligentes para mensagens não relacionadas ao clima, utilizando o modelo meta-llama/llama-4-scout-17b-16e-instruct.

Instalação
1. Clone o repositório
git clone https://github.com/seu-usuario/chatbot-inteligente.git

2. Instale as dependências

Navegue até o diretório do projeto e instale as dependências:

cd chatbot-inteligente
npm install

3. Configuração das variáveis de ambiente

Crie um arquivo .env na raiz do projeto e adicione suas chaves de API:

WEATHER_KEY=Sua_Chave_API_OpenWeather
GROQ_API_KEY=Sua_Chave_API_Groq

4. Inicie o servidor

Execute o comando para iniciar o servidor:

node server.js


O servidor estará disponível em http://localhost:3000
.

Observações

Chave da API do OpenWeather: Você pode obter sua chave de API do OpenWeather 
.

Chave da API do Groq: Você pode obter sua chave de API do Groq 
