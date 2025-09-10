ChatBot Inteligente - Clima e Conversa Geral

Este é um projeto de um chatbot que combina informações sobre o clima com uma conversa inteligente utilizando a API OpenWeather para prever o tempo e a API OpenAI (GPT-3.5) para conversas gerais. O servidor Express recebe mensagens do usuário, verifica se a mensagem é uma consulta sobre o clima ou se deve ser tratada como uma conversa geral, e responde de acordo.

Funcionalidades

Consulta de Clima: O bot pode identificar se a mensagem do usuário é sobre o clima e retornar a previsão do tempo para uma cidade específica.

Conversas Gerais: Para mensagens não relacionadas ao clima, o bot usa a API OpenAI (GPT-3.5) para responder com uma conversa natural e inteligente.

Extração de Cidade: O bot tenta extrair o nome da cidade da mensagem do usuário para buscar a previsão do tempo de forma eficiente.


Tecnologias Usadas

Node.js: Ambiente de execução JavaScript.

Express: Framework web para Node.js.

Axios: Biblioteca para fazer requisições HTTP (usada para chamar a API do OpenWeather).

dotenv: Carregamento de variáveis de ambiente a partir de um arquivo .env.

CORS: Para permitir comunicação com o frontend local.

OpenWeather API: Para obter informações sobre o clima.

OpenAI API (GPT-3.5): Para gerar respostas inteligentes para mensagens não relacionadas ao clima.


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
OPENAI_KEY=Sua_Chave_API_OpenAI


Nota:

Obtenha a chave de API da OpenWeather em: https://openweathermap.org/api

Obtenha a chave de API da OpenAI em: https://platform.openai.com/signup

4. Inicie o servidor

Execute o comando para iniciar o servidor:

Entrar na pasta do server.js e digitar node server.js para inciar o servidor

O servidor estará disponível em http://localhost:3000



.
