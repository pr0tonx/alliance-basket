FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json /usr/src/app

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "run", "dev"]
