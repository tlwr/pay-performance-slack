# alpine:3.8
FROM alpine@sha256:ea47a59a33f41270c02c8c7764e581787cf5b734ab10d27e876e62369a864459

RUN ["apk", "--no-cache", "upgrade"]
RUN ["apk", "add", "--no-cache", "nodejs", "npm"]

WORKDIR /app

ADD package.json /app/package.json
ADD package-lock.json /app/package.json

RUN ["npm", "install"]

ADD . /app

CMD ["node", "index.js"]
