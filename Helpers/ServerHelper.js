/**
 * Event listener for HTTP server "error" event.
 */

function onError (error) {
  if (error.syscall !== 'listen') {
    throw error
  }
      // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error('port requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error('port is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

    /**
     * Event listener for HTTP server "listening" event.
     */

function onListening (addr) {
  var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port
  // console.log('Listening on ' + bind)
}

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort (val) {
  var port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

module.exports = {
  onError,
  onListening,
  normalizePort
}