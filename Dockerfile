FROM node:lts-alpine@sha256:8996bb5821d62a8fd9bb27c1cb07462f3fdce6e47d640c6a881ead0b064ce216 as builder

ENV NODE_ENV build

USER node
WORKDIR /home/node

COPY --chown=node:node . .
RUN yarn && yarn build

FROM node:lts-alpine@sha256:8996bb5821d62a8fd9bb27c1cb07462f3fdce6e47d640c6a881ead0b064ce216 as runner

EXPOSE 3000

ENV NODE_ENV production

USER node
WORKDIR /home/node

COPY --from=builder --chown=node:node \
  /home/node/package.json             \
  /home/node/yarn.lock                \
  /home/node/.yarnrc.yml              \
  /home/node/.pnp.cjs                 \
  /home/node/.pnp.loader.mjs          \
  ./

COPY --from=builder --chown=node:node /home/node/.yarn ./.yarn
COPY --from=builder --chown=node:node /home/node/dist ./dist

CMD ["yarn", "start:prod"]