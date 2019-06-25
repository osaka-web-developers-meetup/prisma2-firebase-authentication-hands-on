FROM node:10.16-alpine

RUN apk add --no-cache sqlite

WORKDIR /app

USER node

EXPOSE 4000

ENTRYPOINT /bin/sh
