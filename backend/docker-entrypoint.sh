#!/bin/bash
set -e

echo "🔄 Rodando migrations..."
npm run migrate

echo "🚀 Iniciando servidor..."
npm run dev
