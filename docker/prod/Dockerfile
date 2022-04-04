FROM node:16-alpine as build
WORKDIR /app
COPY . .
RUN set -x \
  && apk add --no-cache git \
  && echo "VERSION="$(git rev-list --all --count) > .env \
  && cat .env \
  && npm install \
  && npm run build

FROM node:16-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY package.json .
EXPOSE 3000
RUN npm install --production
CMD ["npm", "run", "start:prod"]