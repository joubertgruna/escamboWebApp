#!/bin/sh
# Script para iniciar o frontend Next.js com configurações corretas

# IMPORTANTE: NEXT_PUBLIC_* variáveis são "baked in" durante o build!
# Elas não podem ser alteradas em tempo de execução.
# Por isso, precisamos fazer o build novamente com as variáveis corretas.

# Detectar execução dentro do container (mesmo sem DOCKER_ENV explícito)
if [ -f /.dockerenv ] || [ "$DOCKER_ENV" = "true" ]; then
  export DOCKER_ENV="true"
fi

# Determinar a URL da API
if [ "$DOCKER_ENV" = "true" ]; then
  # Em Docker, respeitar NEXT_PUBLIC_API_URL se já definido no compose.
  # Isso permite acesso por outros devices na LAN (ex: http://192.168.x.x:3000)
  export NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL:-http://localhost:3000}"
  echo "🐳 Docker (Container) - API URL: ${NEXT_PUBLIC_API_URL}"
else
  # Desenvolvimento local
  export NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL:-http://localhost:3000}"
  echo "💻 Local - API URL: ${NEXT_PUBLIC_API_URL}"
fi

# Como as variáveis NEXT_PUBLIC_* são compiladas no build time,
# a única forma de mudar em runtime seria fazer rebuild.
# Para dev mode com next dev, isso não é necessário porque
# next dev faz o rebuild automático

# No Docker (bind mount no macOS), Turbopack pode falhar com erro de read.
# Usamos webpack apenas no container para estabilidade.
if [ "$DOCKER_ENV" = "true" ]; then
  exec npm run dev -- --port 5174 --webpack
fi

exec npm run dev -- --port 5174
