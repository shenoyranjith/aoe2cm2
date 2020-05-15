FROM node:12

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN ls /usr/src/app

RUN npm run build
RUN npm run build-server

EXPOSE 3000
CMD [ "node", "build/server.js" ]