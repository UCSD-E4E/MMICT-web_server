FROM node:18-alpine AS development

WORKDIR /usr/src/app

COPY package*.json .

RUN npm ci

COPY . .

RUN npm run build

FROM node:18-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

EXPOSE 8000
WORKDIR /usr/src/app

COPY package*.json .

RUN npm ci --only=production

COPY .env.production.local ./.env
COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/index.js"]