FROM node:4.6.0

ADD . /src
RUN npm install
EXPOSE 8080
CMD npm start