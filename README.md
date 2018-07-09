# Pay Performance Slack

Puts pay card performance stats into slack

# How to run

## Specifying the slack channel

Use the `CHANNEL` environment variable, for example:

```
CHANNEL='#govuk-pay'
```

## Node local

```
SLACK_WEBHOOK_URI='https://hooks.slack.com/services/:a/:b/:c' \
NODE_TLS_REJECT_UNAUTHORIZED=0 \
CONNECTOR_URL='https://localhost:9003'
node index.js

# SLACK_WEBHOOK_URI you will need to get from IT or from a password store
# CONNECTOR_URL will be different if you aren't using a standard tunnel
# NODE_TLS_REJECT_UNAUTHORIZED will stop TLS from verifying when running locally
```

## Docker local

```
docker build -t govukpay/performance-slack:local

docker run \
       --rm \
       -it \
       --entrypoint 'ash' \
       --network host \
       -e NODE_TLS_REJECT_UNAUTHORIZED=0 \
       -e 'SLACK_WEBHOOK_URI=https://hooks.slack.com/services/:a/:b/:c' \
       -e 'CONNECTOR_URL=https://host.docker.internal:9003' \
       govukpay/performance-slack:local

# When in the shell
$ node index.js

# --network host is required to mount connector inside the container without extra_hosts trickery
```
