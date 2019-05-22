# govukpay/nodejs:alpine-3.8.1
FROM govukpay/nodejs@sha256:a3ae1b0b3ab5e7cdefe0787b97b1047cdc5e0c5166fb677e3cefac538bc99f86

WORKDIR /app

ADD package.json /app/package.json
ADD package-lock.json /app/package.json

RUN npm install

ADD . /app

CMD ["node", "index.js"]
