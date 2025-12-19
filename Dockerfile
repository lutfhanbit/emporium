# FROM node:lts-alpine as build
# WORKDIR /app
# COPY package.json .
# RUN yarn install
# COPY . .
# RUN apk add gettext
# RUN yarn build

FROM nginx:stable-alpine
COPY /app/html /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]