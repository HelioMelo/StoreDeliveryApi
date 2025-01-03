# Use uma imagem base do Node.js
FROM node:18

# Crie um diretório para a aplicação
WORKDIR /usr/src/app

# Copie os arquivos de configuração do projeto
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o restante dos arquivos da aplicação
COPY . .

# Exponha a porta que a aplicação usará
EXPOSE 3000

# Defina o comando para iniciar a aplicação
CMD [ "npm", "run", "dev" ]
