const Twit = require('twit')
const Emitter = require('./EventEmitterHelper')

class TwitterHelper {
  async fetchTweetStream (track) {
    const client = new Twit({
      consumer_key: process.env.TWITTER_CONSUMER_API_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_API_SECRET,
      access_token: process.env.TWITTER_ACCESS_TOKEN,
      access_token_secret: process.env.TWITTER_ACCESS_SECRET
    })

    const stream = client.stream('statuses/filter', { track })
    stream.on('tweet', function (event) {
      const {text, user} = event
      const {name, followers_count} = user
      const feedback = `${name} with ${followers_count} followers said ${text}`
      const lines = new Array(process.stdout.columns).fill('-')

      console.log(...lines)
      console.log(feedback)
      console.log(...lines)

      Emitter.emit(CONSTANTS.EMITTERS.NEW_TWEET, {name, followers: followers_count})
    })

    stream.on('error', function (error) {
      throw new Error(error)
    })
  }
}

module.exports = new TwitterHelper()
