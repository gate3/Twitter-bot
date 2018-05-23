const EventEmitter = require('events')
class MyEmitter extends EventEmitter {}

// we need a singleton
module.exports = new MyEmitter()
