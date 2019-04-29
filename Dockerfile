FROM govukpay/nodejs:alpine-3.8.1

WORKDIR /app

ADD package.json /app/package.json
ADD package-lock.json /app/package.json

RUN npm install

ADD . /app

CMD ["node", "index.js"]
