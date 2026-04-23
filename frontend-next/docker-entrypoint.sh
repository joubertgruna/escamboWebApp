#!/bin/sh

# Script de inicialização do frontend Next.js
# Detecta se está rodando dentro de Docker e configura as URLs corretamente

# Se DOCKER_ENV não for definido, tenta detectar automaticamente
if [ -z "$DOCKER_ENV" ]; then
  # Se /proc/1/cgroup menciona docker, está em container
  if grep -q docker /proc/1/cgroup 2>/dev/null; then
    export DOCKER_ENV=true
  else
    export DOCKER_ENV=false
  fi
fi

# Determinar a URL da API baseado no ambiente
if [ "$DOCKER_ENV" = "true" ]; then
  # Dentro do Docker: usar hostname interno
  export NEXT_PUBLIC_API_URL="http://backend:3000"
  echo "🐳 Modo Docker ativo - API: http://backend:3000"
else
  # Fora do Docker (desenvolvimento local): usar localhost
  export NEXT_PUBLIC_API_URL="http://localhost:3000"
  echo "💻 Modo Local - API: http://localhost:3000"
fi

# Executar o comando original
exec "$@"
