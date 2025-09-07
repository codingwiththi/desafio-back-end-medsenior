# Plataforma AI Q&A Multi-Tenant

Aplicação para perguntas e respostas com IA, com isolamento multi-tenant por empresa e recursos administrativos.

## Funcionalidades

### Autenticação e autorização

- Registro e login com JWT + Refresh Token
- Roles: Admin e User
- Usuários pertencem a uma empresa

### Q&A com IA

- Integração com OpenAI (modelo configurável via `AI_MODEL`, padrão: `gpt-4o-mini`)
- Histórico de perguntas e respostas por usuário
- Isolamento de dados por empresa

### Multi-tenant

- Isolamento por `companyId` em todas as consultas

### Dashboard Admin

- Estatísticas por dia e top usuários

### Segurança e desempenho

- Rate limiting
- Validação de entrada (Joi)
- Logs estruturados (Winston)
- Cache opcional (Redis)

## Início rápido

Pré-requisitos:

- Node.js >= 18.0.0
- Docker e Docker Compose (recomendado)
- Git

1. Clone o repositório

```bash
git clone https://github.com/codingwiththi/desafio-back-end-medsenior.git
cd desafio-back-end-medsenior
```

2. Instale as dependências

```bash
npm install
```

3. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite `.env` conforme necessário (DATABASE_URL, JWT_SECRET, etc.).

4. Inicie com Docker (recomendado)

```bash
npm run docker:up
# ou apenas banco e Redis
docker-compose up -d postgres redis
```

5. Configure o banco

```bash
npm run db:generate
npm run db:migrate
npm run db:seed   # opcional
```

6. Inicie a aplicação

```bash
npm run dev        # desenvolvimento
npm run build && npm start  # produção
```

API disponível em http://localhost:3000

## Testes

```bash
npm test
npm run test:watch
npm run test:coverage
npm run lint
npm run lint:fix
```

## Documentação da API

- Postman: `postman-collection.json` + `postman-environment.json`
- Insomnia: `insomnia-collection.json`

Endpoints principais:

Autenticação

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
```

Q&A

```
POST /api/questions
GET  /api/questions/my-questions
GET  /api/questions/company
GET  /api/questions/:id
```

Admin

```
GET /api/admin/stats/questions
GET /api/admin/stats/users
GET /api/admin/dashboard
```

## Estrutura do projeto

```
src/
├── controllers/
├── middleware/
├── routes/
├── services/
├── types/
├── utils/
└── test/

prisma/
├── schema.prisma
├── migrations/
└── seed.js
```

## Scripts

```bash
npm run dev
npm run build
npm start
npm test
npm run lint
npm run format

# Banco de dados
npm run db:migrate
npm run db:generate
npm run db:studio
npm run db:seed

# Docker
npm run docker:up
npm run docker:down
npm run docker:build
```

## Variáveis de ambiente

| Variável             | Descrição                  | Padrão                   |
| -------------------- | -------------------------- | ------------------------ |
| `NODE_ENV`           | Ambiente de execução       | `development`            |
| `PORT`               | Porta da aplicação         | `3000`                   |
| `DATABASE_URL`       | URL do PostgreSQL          | -                        |
| `JWT_SECRET`         | Secret do JWT              | -                        |
| `JWT_REFRESH_SECRET` | Secret do Refresh Token    | -                        |
| `OPENAI_API_KEY`     | Chave da OpenAI (opcional) | -                        |
| `AI_MODEL`           | Modelo da IA               | `gpt-4o-mini`            |
| `REDIS_URL`          | URL do Redis (opcional)    | `redis://localhost:6379` |

## Licença

MIT — ver [LICENSE](LICENSE).

## Autor

Thiago Moreira
