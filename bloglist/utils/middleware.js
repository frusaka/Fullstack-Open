const logger = require('./logger')

function requestLogger(request, response, next) {
  if (process.env.NODE_ENV !== 'test') {
    console.log('Method:', request.method)
    console.log('Path:', request.path)
    console.log('Body:', request.body)
    console.log('-------')
  }
  next()
}

function unknownEndPoint(request, response, next) {
  response.status(404).json({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}
module.exports = {
  requestLogger,
  unknownEndPoint,
  errorHandler,
}
