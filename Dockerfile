# build
FROM node:20.2-alpine3.16 as build-ui

WORKDIR /srv

ENV NODE_ENV=development

COPY package.json .
COPY yarn.lock .

RUN yarn --pure-lockfile

COPY tsconfig.json tsconfig.json
COPY rollup.config.js rollup.config.js
COPY public public
COPY src src

RUN yarn build:js

FROM node:20.2-alpine3.16 as build-server

WORKDIR /srv

ENV NODE_ENV=production

COPY package.json .
COPY yarn.lock .

RUN yarn --pure-lockfile

# runtime
FROM gcr.io/distroless/nodejs

ENV NODE_ENV=production

WORKDIR /srv

COPY --from=build-ui /srv/public /srv/public
COPY --from=build-server /srv/node_modules /srv/node_modules

EXPOSE 8080

CMD ["node_modules/.bin/serve", "-s", "public", "-l", "8080"]
