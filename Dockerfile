# alpine:3.8
FROM alpine@sha256:769fddc7cc2f0a1c35abb2f91432e8beecf83916c421420e6a6da9f8975464b6

RUN ["apk", "--no-cache", "upgrade"]
RUN ["apk", "add", "--no-cache", "nodejs", "npm"]

WORKDIR /app

ADD package.json /app/package.json
ADD package-lock.json /app/package.json

RUN ["npm", "install"]

ADD . /app

CMD ["node", "index.js"]
