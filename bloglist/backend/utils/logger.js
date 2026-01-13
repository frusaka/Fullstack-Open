function info(...params) {
  if (process.env.NODE_ENV != 'test') console.info(...params)
}

function error(...params) {
  if (process.env.NODE_ENV != 'test') console.error(...params)
}

module.exports = { info, error }
