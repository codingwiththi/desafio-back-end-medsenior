# 🚀 MedSenior - Multi-Tenant AI Q&A Platform

Uma plataforma multi-tenant onde usuários de diferentes empresas podem fazer perguntas a uma IA e obter respostas. Desenvolvida como parte do Desafio Técnico Backend da MedSenior.

## 📋 Características Principais

- ✅ **Autenticação e Autorização** com JWT + Refresh Token
- ✅ **Multi-tenant** - Isolamento total de dados por empresa
- ✅ **Integração com IA** para respostas automáticas
- ✅ **Dashboard Admin** com estatísticas e métricas
- ✅ **API RESTful** com documentação completa
- ✅ **Validação robusta** de entrada de dados
- ✅ **Testes unitários** e cobertura de código
- ✅ **CI/CD** configurado com GitHub Actions
- ✅ **Docker** para desenvolvimento e produção
- ✅ **Cache Redis** para melhor performance
- ✅ **Rate limiting** para proteção da API
- ✅ **Logs estruturados** com Winston

## 🛠️ Stack Tecnológica

- **Runtime:** Node.js 18+
- **Linguagem:** TypeScript
- **Framework:** Express.js
- **Banco de Dados:** PostgreSQL
- **ORM:** Prisma
- **Cache:** Redis
- **Autenticação:** JWT (JsonWebToken)
- **Validação:** Joi
- **Testes:** Jest + Supertest
- **Documentação:** Insomnia Collection
- **CI/CD:** GitHub Actions
- **Containerização:** Docker + Docker Compose

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- Git

### 1. Clone o repositório

```bash
git clone https://github.com/codingwiththi/desafio-back-end-medsenior.git
cd desafio-back-end-medsenior
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/medsenior_db"

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production

# Redis
REDIS_URL=redis://localhost:6379

# AI Service (opcional para desenvolvimento)
OPENAI_API_KEY=your-openai-api-key-here
```

### 3. Execute com Docker (Recomendado)

```bash
# Subir toda a aplicação
npm run docker:up

# A API estará disponível em http://localhost:3000
```

### 4. OU Execute localmente

```bash
# Instalar dependências
npm install

# Subir apenas banco e Redis
docker-compose up postgres redis -d

# Executar migrações
npm run db:migrate

# Popular banco com dados de teste
npm run db:seed

# Iniciar em modo desenvolvimento
npm run dev
```

A API estará disponível em `http://localhost:3000`

## 📚 Documentação da API

### Endpoints Principais

#### Autenticação
- `POST /api/auth/register` - Registrar usuário e empresa
- `POST /api/auth/login` - Login do usuário
- `POST /api/auth/refresh` - Renovar access token
- `POST /api/auth/logout` - Logout do usuário

#### Perguntas
- `POST /api/questions` - Fazer pergunta à IA
- `GET /api/questions/my-questions` - Listar minhas perguntas
- `GET /api/questions/company` - Listar perguntas da empresa (admin)
- `GET /api/questions/:id` - Obter pergunta específica

#### Admin Dashboard
- `GET /api/admin/dashboard` - Resumo do dashboard
- `GET /api/admin/stats/questions` - Estatísticas de perguntas
- `GET /api/admin/stats/users` - Top usuários

### Importar Collection

1. Abra o Insomnia ou Postman
2. Importe o arquivo `insomnia-collection.json`
3. Configure as variáveis de ambiente com a URL base
4. Use as requisições de exemplo

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm run test:coverage

# Linting
npm run lint

# Formatação de código
npm run format
```

## 🏗️ Arquitetura

```
src/
├── controllers/     # Controladores da API
├── services/        # Lógica de negócio
├── middleware/      # Middlewares (auth, validation, etc.)
├── routes/         # Definição de rotas
├── utils/          # Utilitários (database, logger, etc.)
├── types/          # Definições de tipos TypeScript
└── test/           # Configuração de testes
```

### Fluxo Multi-tenant

1. **Registro:** Primeiro usuário de uma empresa se torna ADMIN
2. **Isolamento:** Todos os dados são filtrados por `companyId`
3. **Autorização:** Middleware verifica permissões baseadas na empresa
4. **Dados:** Usuários só veem dados da própria empresa

## 🔒 Segurança

- **Rate Limiting:** Proteção contra spam e ataques DDoS
- **Helmet:** Headers de segurança HTTP
- **CORS:** Configuração de origem cruzada
- **JWT:** Tokens com expiração e renovação
- **Validation:** Validação rigorosa de entrada
- **Multi-tenant:** Isolamento total de dados por empresa

## 📊 Monitoramento

- **Logs estruturados** com Winston
- **Health check** endpoint
- **Métricas de performance** nos logs
- **Error handling** centralizado

## 🚀 Deploy

### Docker Production

```bash
# Build da imagem
docker build -t medsenior-api .

# Executar em produção
docker-compose -f docker-compose.prod.yml up -d
```

### Variáveis de Produção

```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/prod_db
REDIS_URL=redis://redis-host:6379
JWT_SECRET=super-secret-production-key
OPENAI_API_KEY=your-production-openai-key
```

## 🎯 Funcionalidades Implementadas

### ✅ Requisitos Mínimos
- [x] Autenticação e autorização (JWT + Refresh Token)
- [x] Roles: Admin e User
- [x] Multi-tenant com isolamento de dados
- [x] Perguntas e respostas com IA
- [x] Dashboard básico para admins
- [x] Banco PostgreSQL com Prisma
- [x] Docker Compose
- [x] Validação de entrada
- [x] Testes unitários
- [x] CI/CD com GitHub Actions

### ✅ Recursos Extras (Plus)
- [x] Cache com Redis
- [x] Logs estruturados
- [x] Rate limiting
- [x] API bem documentada
- [x] Formatação de código (Prettier)
- [x] Linting (ESLint)
- [x] Setup rápido com Docker
- [x] Collection Insomnia/Postman
- [x] Arquitetura limpa e organizada

## 👥 Credenciais de Teste

Após executar o seed (`npm run db:seed`):

```
TechCorp Inc.:
- Admin: admin@techcorp.com / 123456
- User: user1@techcorp.com / 123456

StartupXYZ:
- Admin: admin@startupxyz.com / 123456  
- User: user2@startupxyz.com / 123456
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

---

**Desenvolvido com ❤️ para o desafio técnico MedSenior**
