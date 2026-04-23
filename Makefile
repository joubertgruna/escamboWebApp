.PHONY: help start stop restart logs build clean ps shell-backend shell-frontend health

# Colors
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m # No Color

help:
	@echo "$(BLUE)╔════════════════════════════════════════╗$(NC)"
	@echo "$(BLUE)║   ESCAMBO - Docker Make Commands       ║$(NC)"
	@echo "$(BLUE)╚════════════════════════════════════════╝$(NC)"
	@echo ""
	@echo "$(GREEN)Comandos Disponíveis:$(NC)"
	@echo "  $(YELLOW)make start$(NC)              - Inicia aplicação completa"
	@echo "  $(YELLOW)make stop$(NC)               - Para aplicação"
	@echo "  $(YELLOW)make restart$(NC)            - Reinicia aplicação"
	@echo "  $(YELLOW)make build$(NC)              - Reconstrói imagens"
	@echo "  $(YELLOW)make clean$(NC)              - Remove containers e volumes"
	@echo "  $(YELLOW)make logs$(NC)               - Mostra logs (todos)"
	@echo "  $(YELLOW)make logs-backend$(NC)       - Logs do backend"
	@echo "  $(YELLOW)make logs-frontend$(NC)      - Logs do frontend"
	@echo "  $(YELLOW)make logs-mysql$(NC)         - Logs do MySQL"
	@echo "  $(YELLOW)make ps$(NC)                 - Status dos containers"
	@echo "  $(YELLOW)make shell-backend$(NC)      - Acessa shell do backend"
	@echo "  $(YELLOW)make shell-frontend$(NC)     - Acessa shell do frontend"
	@echo "  $(YELLOW)make health$(NC)             - Verifica saúde dos containers"
	@echo "  $(YELLOW)make db-backup$(NC)          - Backup do banco de dados"
	@echo "  $(YELLOW)make db-restore$(NC)         - Restaura backup do banco"
	@echo "  $(YELLOW)make test-backend$(NC)       - Executa testes do backend"
	@echo "  $(YELLOW)make test-e2e$(NC)           - Executa testes E2E"
	@echo ""
	@echo "$(GREEN)URLs de Acesso:$(NC)"
	@echo "  Frontend:  http://localhost:5174"
	@echo "  Backend:   http://localhost:3000"
	@echo "  MySQL:     localhost:3306"
	@echo ""

start:
	@echo "$(BLUE)🚀 Iniciando containers...$(NC)"
	docker-compose up -d
	@sleep 3
	@echo "$(GREEN)✓ Aplicação iniciada!$(NC)"
	@make health

stop:
	@echo "$(BLUE)⏹️  Parando containers...$(NC)"
	docker-compose down
	@echo "$(GREEN)✓ Containers parados$(NC)"

restart:
	@echo "$(BLUE)🔄 Reiniciando containers...$(NC)"
	docker-compose restart
	@sleep 2
	@make health

logs:
	@docker-compose logs -f

logs-backend:
	@docker-compose logs -f backend

logs-frontend:
	@docker-compose logs -f frontend

logs-mysql:
	@docker-compose logs -f mysql

ps:
	@echo "$(BLUE)📊 Status dos containers:$(NC)"
	@docker-compose ps

build:
	@echo "$(BLUE)🔨 Reconstruindo imagens...$(NC)"
	docker-compose build --no-cache
	@echo "$(GREEN)✓ Imagens reconstruídas$(NC)"

clean:
	@echo "$(YELLOW)⚠️  Removendo containers e volumes...$(NC)"
	docker-compose down -v
	@echo "$(GREEN)✓ Limpeza concluída$(NC)"

shell-backend:
	@echo "$(BLUE)🐚 Acessando shell do Backend...$(NC)"
	docker-compose exec backend sh

shell-frontend:
	@echo "$(BLUE)🐚 Acessando shell do Frontend...$(NC)"
	docker-compose exec frontend sh

health:
	@echo "$(BLUE)🏥 Verificando saúde dos containers...$(NC)"
	@docker-compose ps --format "table {{.Service}}\t{{.Status}}"
	@echo ""
	@docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"

db-backup:
	@echo "$(BLUE)💾 Criando backup do banco de dados...$(NC)"
	@mkdir -p backups
	docker-compose exec -T mysql mysqldump -u escambo -pescambo123 escambo_dev > backups/escambo_backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "$(GREEN)✓ Backup criado em backups/$(NC)"

db-restore:
	@echo "$(BLUE)📂 Restaurando banco de dados...$(NC)"
	@read -p "Nome do arquivo de backup (em backups/): " BACKUP; \
	docker-compose exec -T mysql mysql -u escambo -pescambo123 escambo_dev < backups/$$BACKUP
	@echo "$(GREEN)✓ Banco restaurado$(NC)"

test-backend:
	@echo "$(BLUE)🧪 Executando testes do backend...$(NC)"
	docker-compose exec backend npm test

test-e2e:
	@echo "$(BLUE)🧪 Executando testes E2E...$(NC)"
	docker-compose exec frontend npm run test:e2e

rebuild-fresh:
	@echo "$(YELLOW)🔄 Reconstruindo tudo (fresh)...$(NC)"
	docker-compose down -v
	docker system prune -f
	docker-compose up -d --build
	@sleep 5
	@make health

.DEFAULT_GOAL := help
