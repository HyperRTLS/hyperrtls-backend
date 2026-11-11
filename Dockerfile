FROM node:lts-alpine@sha256:6bd9ab43c0ec0190ca7b2d193906cb8b7edf6e7f4afa43ddeccd6452710bffb5 as builder

ENV NODE_ENV build

USER node
WORKDIR /home/node

COPY --chown=node:node . .
RUN yarn && yarn build

FROM node:lts-alpine@sha256:6bd9ab43c0ec0190ca7b2d193906cb8b7edf6e7f4afa43ddeccd6452710bffb5 as runner

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