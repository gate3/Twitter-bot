require('dotenv').config()
const http = require('http')
const TwitterHelper = require('./Helpers/TwitterHelper')
const ServerHelper = require('./Helpers/ServerHelper')
const Emitter = require('./Helpers/EventEmitterHelper')
const SpreadSheet = require('./Helpers/SpreadsheetHelper')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const CONSTANTS = require('./Constants')
global.CONSTANTS = CONSTANTS

function main () {
  rl.question(CONSTANTS.PROMPT.ENTER_INPUT, (ans) => {
    if (ans === '') {
      main()
      return
    }
    const hashtags = ans.split(' ').map(t => {
      if (t.indexOf('#') !== -1) {
        return t
      }
      return `#${t}`
    })
    
    console.log(`${CONSTANTS.PROMPT.WATCHING_PROMPT} ${hashtags.join(',')}`)

    TwitterHelper.fetchTweetStream(hashtags)
  })
}

main()

rl.on('close', () => {
  performCleanUp()
})

function performCleanUp () {
  Emitter.removeAllListeners()
}

Emitter.on(CONSTANTS.EMITTERS.NEW_TWEET, ({name, followers}) => {
  SpreadSheet.save(name, followers)
})

const port = ServerHelper.normalizePort(process.env.PORT || '3000')

// create a server object:
const server = http.createServer(function (req, res) {
  // console.log('port now listening')
  res.end() // end the response
})

server.listen(port)
server.on('error', ServerHelper.onError)
server.on('listening', () => ServerHelper.onListening(server.address()))
