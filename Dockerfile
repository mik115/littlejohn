FROM node:19-alpine3.16

ADD . /app
WORKDIR /app
RUN npm install --production

ENTRYPOINT [ "npm", "start" ]