<<<<<<< HEAD
up# 🔄 Escambo – Plataforma de Trocas

> Troque itens diretamente com outras pessoas, sem comprar nem vender.

[![CI](https://github.com/joubertgruna/EscamboWebApp/actions/workflows/ci.yml/badge.svg)](https://github.com/joubertgruna/EscamboWebApp/actions/workflows/ci.yml)

## � Sobre

O **Escambo** é uma aplicação WebApp/PWA que permite que usuários troquem itens entre si sem envolver dinheiro. O foco da plataforma é nos **itens**, não nas pessoas.
A proposta é simples:
## 🛠️ Stack Tecnológica

| Camada          | Tecnologia                    |
| --------------- | ----------------------------- |
| **Frontend**    | Vue.js 3 + Bootstrap 5 + Vite |
| **Backend**     | Node.js + Express             |
| **Banco**       | MySQL (Knex.js)               |
| **Real-time**   | Socket.io                     |
| **Infra**       | AWS (Terraform)               |
| **CI/CD**       | GitHub Actions                |
| **Testes**      | Jest + Supertest + Cypress    |

## 🚀 Quick Start

### Pré-requisitos


### Instalação

```bash
# Clonar repositório
git clone https://github.com/joubertgruna/EscamboWebApp.git
cd EscamboWebApp

# Backend
cd backend
cp .env.example .env
npm install
npm run migrate
npm run dev

# Frontend (em outro terminal)
cd frontend
cp .env.example .env
npm install
npm run dev
```

### Com Docker

```bash
docker-compose up -d
```

## 📂 Estrutura do Projeto

```
EscamboWebApp/
├── frontend/          # Vue.js 3 PWA
├── backend/           # Node.js + Express API
├── infra/             # Terraform (AWS)
├── tests/             # Testes (unit, integration, e2e)
├── docs/              # Documentação
└── .github/           # CI/CD workflows
```

## 📚 Documentação


## 🔑 Funcionalidades


## 🤝 Contribuição

Pull requests são bem-vindos. Siga o padrão de commits e mantenha testes atualizados.

## 📄 Licença

MIT © Joubert Gabriel
=======
test commit
>>>>>>> ed6a1af4e8196acc075eb2701d1d80b69ae83928
