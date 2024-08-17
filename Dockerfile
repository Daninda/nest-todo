FROM node:20-alpine
WORKDIR /nest-todo
COPY ./package.json ./
COPY ./pnpm-lock.yaml ./
RUN npm i
COPY ./ ./
RUN npm run start:prod