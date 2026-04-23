#!/bin/bash
# Script para inicializar o banco de dados (migrations)
# Executa uma única vez e cria um lock file

LOCK_FILE="/app/.migrations-done"

if [ ! -f "$LOCK_FILE" ]; then
  echo "🔄 Primeira inicialização - rodando migrations..."
  npm run migrate
  touch "$LOCK_FILE"
  echo "✅ Migrations concluídas!"
else
  echo "✓ Migrations já foram executadas"
fi

echo "🚀 Iniciando servidor..."
npm run dev
