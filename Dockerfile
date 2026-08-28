FROM node:lts-alpine@sha256:e67514e5d0f6c46656005e1b693b2ec9d52e80b641307de684d4a015ba7a4eaf as builder

ENV NODE_ENV build

USER node
WORKDIR /home/node

COPY --chown=node:node . .
RUN yarn && yarn build

FROM node:lts-alpine@sha256:e67514e5d0f6c46656005e1b693b2ec9d52e80b641307de684d4a015ba7a4eaf as runner

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