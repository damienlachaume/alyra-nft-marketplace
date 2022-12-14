FROM node:16.15.1 AS deps

WORKDIR /smart-contracts
COPY ./package.json ./
RUN yarn install --frozen-lockfile --production

COPY . .

ENV NODE_ENV production

WORKDIR /smart-contracts

EXPOSE 80

CMD ["yarn", "frontend:dev"]
