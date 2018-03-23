'use strict';

const Twitter = require("twitter");
const Alea = require("alea");
const wordfilter = require("wordfilter");
const config = require("./config");

const T = new Twitter(config);

const PRNG = new Alea();

const alphabet =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ,.?!#;:0123456789-'\n ";

function generateRandomTweet() {
  let text = "";
  for (let i = 0; i < 280; i++) {
    text += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  if (tweetOK(text)) {
    return text;
  } else {
    text = generateRandomTweet();
  }
  return text;
}

function tweetOK(phrase) {
  if (
    !wordfilter.blacklisted(phrase) &&
    phrase !== undefined &&
    phrase !== "" &&
    phrase.length <= 280
  ) {
    return true;
  } else {
    return false;
  }
}

module.exports.tweet = (event, context, callback) => {

  const text = generateRandomTweet()
  T.post('statuses/update', {status:text},
    function (err, tweet, response) {
      var message = ""
      if (err) {
        message = "ERROR"
        console.log(message, err)
        return callback(err, { message, event })
      }
      if (tweet) {
        message = "SUCCESS"
        console.log(message)
        return callback(null, { message, event })
      }
      message = "...how did this happen?"
      console.log(message, response)
      callback(null, { message, event })
    }
  )
};
