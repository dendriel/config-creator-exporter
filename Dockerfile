FROM node:14-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm install --production

# Just to satisfy the SQS consumer lib. This image is aimed to run in development (local) environment only.
ENV AWS_ACCESS_KEY_ID=dummy-key
ENV AWS_SECRET_ACCESS_KEY=dummy-secret

CMD ["node", "server.js"]
