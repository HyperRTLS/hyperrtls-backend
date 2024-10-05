FROM node:lts-alpine@sha256:c13b26e7e602ef2f1074aef304ce6e9b7dd284c419b35d89fcf3cc8e44a8def9 as builder

ENV NODE_ENV build

USER node
WORKDIR /home/node

COPY --chown=node:node . .
RUN yarn && yarn build

FROM node:lts-alpine@sha256:c13b26e7e602ef2f1074aef304ce6e9b7dd284c419b35d89fcf3cc8e44a8def9 as runner

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