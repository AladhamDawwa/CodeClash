FROM node:16-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

COPY .env ./

EXPOSE 5000

CMD ["npm", "start"]
