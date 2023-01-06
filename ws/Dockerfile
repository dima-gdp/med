FROM node:14-alpine

ARG env=prod
ENV ENV=${env}

WORKDIR /app

COPY package* ./
COPY ./.npmrc ./.npmrc

RUN apk update && apk add --no-cache --virtual wget git
RUN mkdir ~/.postgresql && wget "https://storage.yandexcloud.net/cloud-certs/CA.pem" -O ~/.postgresql/root.crt
RUN chmod 0600 ~/.postgresql/root.crt

RUN npm ci --no-audit && npm install pm2 -g
RUN mkdir -p /usr/local/share/ca-certificates/Yandex && wget "https://storage.yandexcloud.net/cloud-certs/CA.pem" -O /usr/local/share/ca-certificates/Yandex/YandexInternalRootCA.crt

COPY . /app

RUN  npm run build

EXPOSE 8080
EXPOSE 9090
EXPOSE 4043

CMD ["pm2-runtime", "process.yml"]
##TEST
