# build
FROM node:15.14.0-alpine3.10 as build

WORKDIR /srv

ENV NODE_ENV=production

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY tsconfig.json tsconfig.json
COPY rollup.config.js rollup.config.js
COPY public public
COPY src src

RUN yarn build:js

# runtime
FROM gcr.io/distroless/nodejs

WORKDIR /srv

COPY --from=build /srv /srv

EXPOSE 8080

CMD ["node_modules/.bin/serve", "-s", "public", "-l", "8080"]