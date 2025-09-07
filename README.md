# desafio-back-end-medsenior
Desafio Técnico – Backend

# Desafio Técnico - Backend

## Contexto do problema

[cite_start]Uma empresa deseja criar uma plataforma onde usuários de diferentes empresas possam fazer perguntas a uma IA e obter respostas. [cite: 3]

[cite_start]A aplicação precisa suportar multi-tenant, ou seja: [cite: 4]
* [cite_start]Cada empresa tem seus próprios usuários. [cite: 5] [cite_start]Usuários só podem visualizar perguntas e respostas enviadas dentro da própria empresa. [cite: 5]
* [cite_start]Administradores podem visualizar estatísticas de uso da empresa. [cite: 6]

## O que deve ser desenvolvido

### [cite_start]Funcionalidades principais (requisitos mínimos) [cite: 8]

1.  [cite_start]**Autenticação e autorização** [cite: 9]
    * [cite_start]Usuário pode se registrar e se autenticar. [cite: 10]
    * [cite_start]Login com JWT + Refresh Token. [cite: 11]
    * [cite_start]Roles: Admin e User. [cite: 13]
    * [cite_start]Usuários pertencem a uma empresa (Company). [cite: 15]

2.  [cite_start]**Perguntas e respostas com IA** [cite: 16]
    * [cite_start]Usuário autenticado envia uma pergunta para a IA. [cite: 17]
    * [cite_start]O sistema registra no banco: [cite: 18]
        * [cite_start]pergunta [cite: 19]
        * [cite_start]resposta da IA [cite: 20]
        * [cite_start]empresa [cite: 21]
        * [cite_start]usuário [cite: 22]
        * [cite_start]data/hora [cite: 23]
    * [cite_start]O usuário pode listar apenas suas próprias perguntas/respostas. [cite: 24]

3.  [cite_start]**Multi-tenant** [cite: 25]
    * [cite_start]Garantir que usuários só vejam os dados da empresa à qual pertencem. [cite: 27]

4.  [cite_start]**Admin (dashboard básico)** [cite: 28]
    * [cite_start]Endpoint para administradores da empresa consultarem estatísticas, ex.: [cite: 29]
        * [cite_start]Quantidade de perguntas feitas por dia. [cite: 30]
        * [cite_start]Top usuários que mais perguntaram. [cite: 31]

5.  [cite_start]**Infraestrutura mínima** [cite: 32]
    * [cite_start]Banco de dados relacional (PostgreSQL/MySQL). [cite: 33]
    * [cite_start]Docker Compose (app + banco). [cite: 34]
    * [cite_start]Documentação da API. [cite: 35]
    * [cite_start]Validação de entrada. [cite: 36]
    * [cite_start]Testes unitários básicos (services). [cite: 37]
    * [cite_start]README com instruções para rodar. [cite: 38]
    * [cite_start]CI/CD configurado para build + testes automáticos. [cite: 40]

## [cite_start]Plus (não obrigatório, mas diferencia) [cite: 41]

### [cite_start]Arquitetura [cite: 42]
* [cite_start]Monorepo organizado com múltiplos serviços (microserviços) (auth-service, qa-service, etc.). [cite: 43]
* [cite_start]API Gateway centralizando autenticação e roteamento (Kong, KrakenD, etc.). [cite: 44]

### [cite_start]Escalabilidade [cite: 45]
* [cite_start]Cache com Redis. [cite: 46]
* [cite_start]Fila para processamento assíncrono (BullMQ, RabbitMQ, Kafka). [cite: 47]

### [cite_start]Observabilidade [cite: 48]
* [cite_start]Logs estruturados. [cite: 49]
* [cite_start]Métricas (Prometheus/Grafana). [cite: 50]

### [cite_start]Qualidade [cite: 51]
* [cite_start]Testes de integração. [cite: 52]
* [cite_start]Cobertura de testes alta. [cite: 53]
* Algum formatador configurado. [cite_start]Ex: Biome. [cite: 54]

### [cite_start]Infra/DevOps [cite: 55]
* [cite_start]Deploy em nuvem (AWS/GCP/Azure/Render/etc.). [cite: 56]

### [cite_start]DX (Developer Experience) [cite: 57]
* [cite_start]Scripts simples (npm dev, npm test). [cite: 58]
* [cite_start]Setup rápido (clonar e rodar 1 comando para ter o app funcionando). [cite: 59, 60]
* [cite_start]Documentação clara para novos devs. [cite: 61]

## [cite_start]Critérios de avaliação [cite: 62]
* [cite_start]**Obrigatório:** requisitos mínimos funcionando. [cite: 63]
* [cite_start]**Extra:** plus implementados. [cite: 64]

[cite_start]**O que será analisado:** [cite: 65]
* [cite_start]Qualidade e clareza do código. [cite: 67]
* [cite_start]Organização da arquitetura. [cite: 68]
* [cite_start]Segurança e isolamento multi-tenant. [cite: 70]
* [cite_start]Testabilidade e manutenibilidade. [cite: 71]
* [cite_start]Documentação e DX. [cite: 72]

## [cite_start]Prazo [cite: 73]
[cite_start]Recomendado: 5 dias. [cite: 74]

## [cite_start]Entrega [cite: 75]
[cite_start]Link para o repositório (GitHub/GitLab/Bitbucket). [cite: 76]

Deve conter:
* [cite_start]Código fonte. [cite: 77]
* [cite_start]Arquivos Docker/Docker Compose. [cite: 78]
* [cite_start]README com instruções claras. [cite: 79]
* [cite_start]json do Insomnia ou Postman. [cite: 80]
