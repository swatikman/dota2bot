
FROM node:8.16-alpine

WORKDIR /usr/src/app

COPY package.json /usr/src/app
COPY tsconfig.json /usr/src/app

RUN npm install

COPY ./src /usr/src/app/src

EXPOSE 1234

CMD [ "npm", "start"]
