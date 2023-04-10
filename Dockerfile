FROM node:lts-alpine@sha256:47d97b93629d9461d64197773966cc49081cf4463b1b07de5a38b6bd5acfbe9d as builder

ENV NODE_ENV build

USER node
WORKDIR /home/node

COPY --chown=node:node . .
RUN yarn && yarn build

FROM node:lts-alpine@sha256:47d97b93629d9461d64197773966cc49081cf4463b1b07de5a38b6bd5acfbe9d as runner

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