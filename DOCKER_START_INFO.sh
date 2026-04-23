#!/bin/bash

# ============================================
# ESCAMBO - Docker Startup Instructions
# ============================================

cat << "EOF"

╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║  🐳 ESCAMBO APP - DOCKER SETUP COMPLETO                         ║
║                                                                  ║
║  Sua aplicação agora roda 100% no Docker!                       ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝

✅ O QUE FOI CONFIGURADO:

  1. docker-compose.yml
     └─ Optimizado com healthchecks, depends_on, networking
  
  2. Backend (Node.js + Express)
     └─ Porta: 3000
     └─ Dockerfile: Alpine Node 20
  
  3. Frontend (Next.js)
     └─ Porta: 5174
     └─ Dockerfile: Alpine Node 20 + hot reload
  
  4. MySQL 8.0
     └─ Porta: 3306
     └─ Persistent volume: mysql_data
  
  5. Scripts & Tools
     └─ docker-start.sh (interativo)
     └─ Makefile (comandos úteis)
     └─ .dockerignore (otimização)

═══════════════════════════════════════════════════════════════════

🚀 COMO INICIAR:

  Opção 1: Comando Direto (Mais Rápido)
  ─────────────────────────────────
  docker-compose up -d
  
  Aguardar 30 segundos...
  Acessar: http://localhost:5174


  Opção 2: Makefile (Recomendado)
  ────────────────────────────
  make start       # Iniciar
  make logs        # Ver logs
  make ps          # Status
  make help        # Ver todos comandos


  Opção 3: Script Interativo
  ─────────────────────────
  ./docker-start.sh
  # Escolher opção 1 (start)

═══════════════════════════════════════════════════════════════════

📱 ACESSOS:

  Frontend:  http://localhost:5174
  Backend:   http://localhost:3000
  MySQL:     localhost:3306

  Usuário MySQL: escambo
  Senha MySQL:   escambo123
  Database:      escambo_dev

═══════════════════════════════════════════════════════════════════

📊 STATUS:

  Verificar se está tudo rodando:
  docker-compose ps

  Esperado:
  ✓ mysql      running  healthy
  ✓ backend    running  healthy
  ✓ frontend   running  healthy

═══════════════════════════════════════════════════════════════════

🛠️ COMANDOS ÚTEIS:

  Parar:
  docker-compose down

  Reiniciar:
  docker-compose restart

  Ver logs (tempo real):
  docker-compose logs -f

  Shell do backend:
  docker-compose exec backend sh

  Shell do frontend:
  docker-compose exec frontend sh

═══════════════════════════════════════════════════════════════════

📚 DOCUMENTAÇÃO:

  Para mais detalhes, veja:
  - DOCKER_QUICKSTART.md   (5 minutos para começar)
  - DOCKER_GUIDE.md        (guia completo)
  - DOCKER_SETUP_FINAL.md  (resumo técnico)

═══════════════════════════════════════════════════════════════════

✅ PRONTO PARA USAR!

  Todos os containers estão prontos para inicializar.
  Nenhuma configuração adicional necessária.
  
  🎉 Divirta-se desenvolvendo!

═══════════════════════════════════════════════════════════════════

EOF
