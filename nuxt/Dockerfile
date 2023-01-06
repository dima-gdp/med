FROM node:14-alpine

ARG env=prod
ENV ENV=${env}

ARG version=dev
ENV APP_VERSION=${version}

WORKDIR /app

COPY package* ./
COPY ./.npmrc ./.npmrc

RUN npm ci --no-audit

COPY . /app

RUN npm run build

EXPOSE 8000

EXPOSE 9091

CMD ["npm" ,"run", "start"]
