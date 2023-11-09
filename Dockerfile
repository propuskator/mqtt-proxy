FROM node:12.5-alpine

WORKDIR /app
RUN apk add git python3

COPY etc etc
COPY lib lib
COPY bin bin
COPY app.js ./
COPY runner.js ./
COPY babel.config.js ./
COPY .env.defaults ./
COPY package*.json ./

RUN npm ci

CMD ./bin/wait.sh && npm start
