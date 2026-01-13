const jwt = require('jsonwebtoken')
const logger = require('./logger')
const User = require('../models/user')

function requestLogger(request, response, next) {
  if (process.env.NODE_ENV !== 'test') {
    console.log('Method:', request.method)
    console.log('Path:', request.path)
    console.log('Body:', request.body)
    console.log('-------')
  }
  next()
}

function tokenExtractor(request, response, next) {
  const auth = request.get('Authorization')
  if (auth && auth.startsWith('Bearer ')) {
    request.token = auth.replace('Bearer ', '')
  } else {
    request.token = null
  }
  next()
}

async function userExtractor(request, response, next) {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'invalid token' })
  }
  request.user = await User.findById(decodedToken.id)
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
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired',
    })
  }

  next(error)
}
module.exports = {
  requestLogger,
  tokenExtractor,
  userExtractor,
  unknownEndPoint,
  errorHandler,
}
