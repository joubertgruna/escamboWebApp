#!/bin/bash
cd "$(dirname "$0")"

# Load nvm and use LTS
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use --lts 2>/dev/null || true

echo "Node.js version: $(node -v)"
npm run dev -- --port 5174
