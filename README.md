# Projeto Back-End

Este projeto é um serviço back-end com suporte para Docker, usando Node.js, TypeScript e diversas outras ferramentas e bibliotecas para fornecer uma API robusta.

## Estrutura de Pastas

Aqui está uma visão geral da estrutura do projeto back-end:

```bash
├── src │
├── config # Arquivos de configuração da aplicação │
├── controllers # Controladores responsáveis pelas rotas da API │
├── middleware # Middlewares que gerenciam a lógica entre requests/responses │
├── model # Definição dos modelos da aplicação (entidades, schemas) │
├── queries # Consultas e operações relacionadas ao banco de dados │
├── routes # Definição das rotas da aplicação │
├── services # Lógica de negócios e integração com APIs externas │
├── types # Definições de tipos TypeScript │
├── util # Funções utilitárias e helpers │
└── server.ts # Arquivo de inicialização do servidor
├── Dockerfile # Arquivo de definição da imagem Docker
├── docker-compose.yml # Configuração de containers Docker
├── tsconfig.json # Configurações do TypeScript
├── .eslintrc.json # Configuração do ESLint para padronização de código
├── .env # Variáveis de ambiente da aplicação
├── package.json # Dependências e scripts da aplicação
├── README.md # Documentação do projeto
└── Outros arquivos...
```

### Explicação das Pastas Principais

- **config**: Armazena as configurações da aplicação, como variáveis de ambiente e definições específicas para diferentes ambientes (desenvolvimento, produção).
- **controllers**: Os controladores contêm a lógica para cada rota da API, manipulando as requisições e respostas.
- **middleware**: Contém middlewares que são executados entre as requisições e as respostas da API.
- **model**: Aqui estão os modelos usados na aplicação, geralmente relacionados às entidades do banco de dados.
- **queries**: Definem as consultas ao banco de dados e a interação com os modelos.
- **routes**: Definem os endpoints da API e como eles são conectados aos controladores.
- **services**: Aqui reside a lógica de negócio principal da aplicação, além de interações com serviços externos.
- **types**: Definições de tipos personalizados usados na aplicação.
- **util**: Funções auxiliares que ajudam em diversas funcionalidades dentro da aplicação.
- **server.ts**: Arquivo responsável por inicializar o servidor da API.

## Como Rodar o Projeto com Docker

Siga os passos abaixo para rodar a aplicação no Docker:

### Pré-requisitos

- Certifique-se de ter o Docker e o Docker Compose instalados na sua máquina. Se não tiver, siga as instruções de instalação [aqui](https://docs.docker.com/get-docker/).

### Passos para Rodar

1. **Instalar as dependências:**

   Caso queira rodar o projeto localmente sem Docker, instale as dependências:

   ```bash
   npm install
   ```

2. **Subir os containers com Docker:**
   Para subir a aplicação dentro de um container Docker, use o seguinte comando:

   ```bash
   docker compose up -d --build
   ```

3. **Derrubar os containers do Docker:**
   Para subir a aplicação dentro de um container Docker, use o seguinte comando:

   ```bash
   docker compose down
   ```

4. **Recriar os containers forçando a reconstrução e ignorando o cache:**
   Use o comando abaixo para reconstruir o container sem cache:

```bash
docker-compose up -d --build --force-recreate
```

## Scripts Disponíveis

- Aqui estão alguns dos scripts úteis que podem ser executados via npm:

**- npm run build: Compila o projeto TypeScript.**
**- npm run lint: Verifica o código com o ESLint.**
**- npx nodemon: Inicia a aplicação em modo de desenvolvimento usando Nodemon.**

### Como Configurar e Testar Webhooks da Stripe

Para rodar e testar os webhooks da Stripe em ambiente local sem a necessidade de um endpoint público, siga os seguintes passos:

## Instalar Stripe CLI

- macOS: Via Homebrew:

  ```bash
  brew install stripe/stripe-cli/stripe
  ```

- Linux: Siga as instruções específicas no site da Stripe. (https://docs.stripe.com/stripe-cli)
- Windows: Baixe o binário ou siga as instruções aqui. (https://docs.stripe.com/stripe-cli)

## Autenticar Stripe CLI

Depois de instalado, autentique o CLI com a sua conta Stripe:

```bash
stripe login
```

Isso abrirá seu navegador para autorizar o Stripe CLI.

## Escutar Eventos de Webhook Localmente

Para escutar os eventos de webhook enviados pela Stripe, execute o seguinte comando:

```bash
stripe listen --forward-to localhost:8001/webhook
```

Isso irá redirecionar todos os eventos de webhook para o endpoint configurado.

## Simular Eventos de Webhook

Para simular eventos como checkout.session.completed:

```bash
stripe trigger checkout.session.completed
```
