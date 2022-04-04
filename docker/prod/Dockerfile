FROM node:12-alpine as build

WORKDIR /app
COPY  .  .
COPY package.json .

RUN npm install \
    && npm run build

FROM node:12-alpine
WORKDIR /app

COPY --from=build /app/dist ./dist

RUN npm install --production
CMD ["npm", "run", "start:prod"]
