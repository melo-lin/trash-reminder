'use strict';

const line = require('@line/bot-sdk');
const express = require('express');

// create LINE SDK config from env variables
const config = {
  channelSecret: "3eb492079914e41fc4baef8b7965021c",
};

// create LINE SDK client
const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: "Y0PMV50P3nuZa9D92xS+m2n0FeKxfyd9ux5mqa+/5gXUOiIprgeBOeJ2qK8DXdP3jP5wqcnOiMtztWBazmsQiqWz+EJpkQiJ0S2KEA/CA+gSmPauUiox1ZtyrIP5zcgSt6Y2iQSTf7dbB7Uli5qTkwdB04t89/1O/w1cDnyilFU="
});

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// event handler
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  // create an echoing text message
  const echo = { type: 'text', text: event.message.text };

  // use reply API
  return client.replyMessage({
    replyToken: event.replyToken,
    messages: [echo],
  });
}

// listen on port
const port = 1234 || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
