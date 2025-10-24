FROM node:24-alpine

# expose for interaction with localhost
EXPOSE 4200

# best parctise working dir
WORKDIR /usr/src/app

# copy needed files early for cache
COPY package*.json .

# install needed deps
RUN npm i -g @angular/cli
RUN npm i

# rest of source code
COPY . .

RUN ng build

# serve the application and make it available locally
CMD ["ng","serve","--host","0.0.0.0"]
