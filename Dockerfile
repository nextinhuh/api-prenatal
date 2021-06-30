FROM node:alpine

WORKDIR /user/app

COPY package*.json ./
RUN npm install -g npm@7.19.0
RUN yarn

COPY . .

EXPOSE 3333

CMD ["yarn", "dev:server"]
