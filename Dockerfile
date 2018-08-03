FROM node:8
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --registry=https://registry.npm.taobao.org && mv node_modules ../
COPY . .
EXPOSE 3000
CMD node server.js