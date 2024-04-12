// index.js
const line = require('@line/bot-sdk');
var express = require('express');
const config = {
  channelAccessToken: 'Y0PMV50P3nuZa9D92xS+m2n0FeKxfyd9ux5mqa+/5gXUOiIprgeBOeJ2qK8DXdP3jP5wqcnOiMtztWBazmsQiqWz+EJpkQiJ0S2KEA/CA+gSmPauUiox1ZtyrIP5zcgSt6Y2iQSTf7dbB7Uli5qTkwdB04t89/1O/w1cDnyilFU=',
  channelSecret: '3eb492079914e41fc4baef8b7965021c'
};
// create LINE SDK client
const client = new line.Client(config);
// create Express app
// about Express itself: <https://expressjs.com/>
const app = express();
// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
	console.log(req, res)
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
  // create a echoing text message
  const echo = { type: 'text', text: event.message.text };
  // use reply API
  return client.replyMessage(event.replyToken, echo);
}
// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});