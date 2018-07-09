FROM govukpay/nodejs:8.11.3

WORKDIR /app

ADD package.json /app/package.json
ADD package-lock.json /app/package.json

RUN npm install

ADD . /app

CMD 'tail -f /dev/null'
