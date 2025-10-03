FROM node:16.10.0-alpine

WORKDIR /usr/src/app

COPY . /usr/src/app

# RUN npm install -g @angular/cli

RUN npm install

EXPOSE 4201

CMD ["npm", "run", "dev"]