FROM node:20-alpine

WORKDIR /app

# Instalar wget para healthcheck
RUN apk add --no-cache wget

COPY package*.json ./

RUN npm ci

COPY . .

RUN mkdir -p uploads

EXPOSE 3000

CMD ["node", "server-simple.js"]
