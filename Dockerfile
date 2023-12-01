FROM node:16-alpine
WORKDIR /usr/src/app
COPY package*.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build
EXPOSE 3000

CMD ["ls", "-la", "/usr/src/app/dist"]
CMD ["node", "/usr/src/app/dist/src/index.js"]
