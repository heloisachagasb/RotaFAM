# Estágio 1: Build da aplicação
FROM node:18-alpine AS build

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Limpar cache e instalar dependências com legacy peer deps
RUN npm cache clean --force && npm install --legacy-peer-deps

# Copiar código fonte
COPY . .

# Build da aplicação para produção
RUN npm run build --prod

# Estágio 2: Servir com Nginx
FROM nginx:alpine

# Copiar arquivos buildados do caminho correto
# Verificar se existe /browser ou pegar direto do dist
COPY --from=build /app/dist/rotaFam/browser /usr/share/nginx/html

# Copiar configuração customizada do Nginx (opcional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta 80
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]