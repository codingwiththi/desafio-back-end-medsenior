# 🚀 Plataforma AI Q&A Multi-Tenant

Uma plataforma robusta onde usuários de diferentes empresas podem fazer perguntas a uma IA e obter respostas, com completo isolamento multi-tenant e funcionalidades administrativas.

## 📋 Funcionalidades

### 🔐 **Autenticação & Autorização**
- Registro e login de usuários com JWT + Refresh Token
- Roles: Admin e User
- Multi-tenant: cada empresa tem seus próprios usuários

### 🤖 **Q&A com IA**
- Integração com OpenAI (GPT-4o-mini)
- Histórico de perguntas e respostas por usuário
- Isolamento de dados por empresa

### 👥 **Multi-Tenant**
- Usuários só visualizam dados da própria empresa
- Isolamento completo de dados por `companyId`

### 📊 **Dashboard Admin**
- Estatísticas de uso da empresa
- Top usuários mais ativos
- Métricas de perguntas por período

### 🛡️ **Segurança & Performance**
- Rate limiting configurável
- Validação de entrada com Joi
- Logs estruturados com Winston
- Cache opcional com Redis

## 🛠️ Tecnologias

- **Backend:** Node.js + TypeScript + Express
- **Database:** PostgreSQL + Prisma ORM
- **Cache:** Redis
- **AI:** OpenAI API
- **Auth:** JWT + Refresh Tokens
- **Tests:** Jest
- **DevOps:** Docker + Docker Compose

## ⚡ Início Rápido

### **Pré-requisitos**
- Node.js >= 18.0.0
- Docker e Docker Compose (recomendado)
- Git

### **1. Clone o repositório**
```bash
git clone https://github.com/codingwiththi/desafio-back-end-medsenior.git
cd desafio-back-end-medsenior
```

### **2. Instale as dependências**
```bash
npm install
```

### **3. Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```bash
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/medsenior_db"

# JWT (ALTERE ESTES SECRETS!)
JWT_SECRET=seu-jwt-secret-super-secreto
JWT_REFRESH_SECRET=seu-refresh-secret-super-secreto

# OpenAI (opcional - usa mock se não configurado)
OPENAI_API_KEY=sk-sua-chave-openai-aqui

# Redis (opcional)
REDIS_URL=redis://localhost:6379
```

### **4. Inicie o ambiente com Docker (Recomendado)**
```bash
# Inicia PostgreSQL + Redis + App
npm run docker:up

# OU apenas o banco e Redis (se quiser rodar a app localmente)
docker-compose up -d postgres redis
```

### **5. Configure o banco de dados**
```bash
# Gera o cliente Prisma
npm run db:generate

# Executa as migrações
npm run db:migrate

# (Opcional) Popula dados de teste
npm run db:seed
```

### **6. Inicie a aplicação**

**Desenvolvimento:**
```bash
npm run dev
```

**Produção:**
```bash
npm run build
npm start
```

A API estará disponível em: **http://localhost:3000**

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Testes em modo watch
npm run test:watch

# Cobertura de testes
npm run test:coverage

# Lint
npm run lint

# Corrigir problemas de lint automaticamente
npm run lint:fix
```

## 📚 Documentação da API

### **Importar no Postman/Insomnia**
- **Postman:** Importe `postman-collection.json` + `postman-environment.json`
- **Insomnia:** Importe `insomnia-collection.json`

### **Endpoints Principais**

#### **Autenticação**
```bash
POST /api/auth/register  # Registrar usuário e empresa
POST /api/auth/login     # Login
POST /api/auth/refresh   # Renovar token
POST /api/auth/logout    # Logout
```

#### **Q&A**
```bash
POST /api/questions          # Fazer pergunta à IA
GET  /api/questions/my-questions  # Listar minhas perguntas
GET  /api/questions/company  # Listar perguntas da empresa (admin)
GET  /api/questions/:id      # Detalhes de uma pergunta
```

#### **Admin**
```bash
GET /api/admin/stats         # Estatísticas da empresa
GET /api/admin/top-users     # Top usuários mais ativos
```

## 🚀 Deploy

### **Usando Docker**
```bash
# Build da imagem
npm run docker:build

# Deploy completo
npm run docker:up
```

### **Deploy Manual**
```bash
# Build
npm run build

# Configurar variáveis de ambiente de produção
export NODE_ENV=production
export DATABASE_URL=sua-url-do-banco-producao
export JWT_SECRET=seu-jwt-secret-producao

# Migrar banco
npm run db:migrate

# Iniciar
npm start
```

## 🗃️ Estrutura do Projeto

```
src/
├── controllers/     # Controladores das rotas
├── middleware/      # Middlewares (auth, validation, rate limiting)
├── routes/          # Definição das rotas
├── services/        # Lógica de negócio
├── types/           # Tipos TypeScript
├── utils/           # Utilitários (database, logger, redis)
└── test/            # Configuração de testes

prisma/
├── schema.prisma    # Schema do banco
├── migrations/      # Migrações
└── seed.js          # Dados de exemplo
```

## 🧑‍💻 Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento (hot reload)
npm run build        # Build TypeScript
npm start            # Iniciar aplicação (produção)
npm test             # Executar testes
npm run lint         # Verificar código
npm run format       # Formatar código

# Banco de dados
npm run db:migrate   # Executar migrações
npm run db:generate  # Gerar cliente Prisma
npm run db:studio    # Interface web do banco
npm run db:seed      # Popular dados de exemplo

# Docker
npm run docker:up    # Subir ambiente completo
npm run docker:down  # Parar ambiente
npm run docker:build # Build da imagem
```


## 📝 Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `NODE_ENV` | Ambiente de execução | `development` |
| `PORT` | Porta da aplicação | `3000` |
| `DATABASE_URL` | URL do PostgreSQL | - |
| `JWT_SECRET` | Secret para JWT | - |
| `JWT_REFRESH_SECRET` | Secret para Refresh Token | - |
| `OPENAI_API_KEY` | Chave da OpenAI (opcional) | - |
| `REDIS_URL` | URL do Redis (opcional) | `redis://localhost:6379` |

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Thiago Moreira**

---

🚀 **Desenvolvido como parte do Desafio Técnico Backend MedSenior**
