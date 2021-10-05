FROM node:14
WORKDIR /server/index.js
COPY package.json /server/index.js
RUN npm install
COPY . /server/index.js
CMD ["npm", "start"]