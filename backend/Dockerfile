# Use uma imagem oficial do Node.js
FROM node:18-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia o package.json e o package-lock.json para o contêiner
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código da aplicação para o contêiner
COPY . .

# Expõe a porta que a aplicação irá usar
EXPOSE 3000

# Define o comando para iniciar a aplicação
CMD ["npm", "start"]