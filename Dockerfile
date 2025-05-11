FROM node:16-alpine

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install


COPY . .

RUN chmod +x docker-entrypoint.sh

EXPOSE 3333

ENTRYPOINT ["./docker-entrypoint.sh"]
