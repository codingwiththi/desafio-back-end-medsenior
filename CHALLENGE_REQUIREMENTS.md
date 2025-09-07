# Desafio Técnico - Backend

## Contexto do problema

Uma empresa deseja criar uma plataforma onde usuários de diferentes empresas possam fazer perguntas a uma IA e obter respostas.

A aplicação precisa suportar multi-tenant, ou seja:
* Cada empresa tem seus próprios usuários. Usuários só podem visualizar perguntas e respostas enviadas dentro da própria empresa.
* Administradores podem visualizar estatísticas de uso da empresa.

## O que deve ser desenvolvido

### Funcionalidades principais (requisitos mínimos)

1.  **Autenticação e autorização**
    * Usuário pode se registrar e se autenticar.
    * Login com JWT + Refresh Token.
    * Roles: Admin e User.
    * Usuários pertencem a uma empresa (Company).

2.  **Perguntas e respostas com IA**
    * Usuário autenticado envia uma pergunta para a IA.
    * O sistema registra no banco:
        * pergunta
        * resposta da IA
        * empresa
        * usuário
        * data/hora
    * O usuário pode listar apenas suas próprias perguntas/respostas.

3.  **Multi-tenant**
    * Garantir que usuários só vejam os dados da empresa à qual pertencem.

4.  **Admin (dashboard básico)**
    * Endpoint para administradores da empresa consultarem estatísticas, ex.:
        * Quantidade de perguntas feitas por dia.
        * Top usuários que mais perguntaram.

5.  **Infraestrutura mínima**
    * Banco de dados relacional (PostgreSQL/MySQL).
    * Docker Compose (app + banco).
    * Documentação da API.
    * Validação de entrada.
    * Testes unitários básicos (services).
    * README com instruções para rodar.
    * CI/CD configurado para build + testes automáticos.

## Plus (não obrigatório, mas diferencia)

### Arquitetura
* Monorepo organizado com múltiplos serviços (microserviços) (auth-service, qa-service, etc.).
* API Gateway centralizando autenticação e roteamento (Kong, KrakenD, etc.).

### Escalabilidade
* Cache com Redis.
* Fila para processamento assíncrono (BullMQ, RabbitMQ, Kafka).

### Observabilidade
* Logs estruturados.
* Métricas (Prometheus/Grafana).

### Qualidade
* Testes de integração.
* Cobertura de testes alta.
* Algum formatador configurado. Ex: Biome.

### Infra/DevOps
* Deploy em nuvem (AWS/GCP/Azure/Render/etc.).

### DX (Developer Experience)
* Scripts simples (npm dev, npm test).
* Setup rápido (clonar e rodar 1 comando para ter o app funcionando).
* Documentação clara para novos devs.

## Critérios de avaliação
* **Obrigatório:** requisitos mínimos funcionando.
* **Extra:** plus implementados.

**O que será analisado:**
* Qualidade e clareza do código.
* Organização da arquitetura.
* Segurança e isolamento multi-tenant.
* Testabilidade e manutenibilidade.
* Documentação e DX.

## Prazo
Recomendado: 5 dias.

## Entrega
Link para o repositório (GitHub/GitLab/Bitbucket).

Deve conter:
* Código fonte.
* Arquivos Docker/Docker Compose.
* README com instruções claras.
* json do Insomnia ou Postman.
