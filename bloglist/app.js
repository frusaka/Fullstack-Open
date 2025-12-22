const mongoose = require('mongoose')
const express = require('express')
const blogListRouter = require('./controllers/bloglist')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const { MONGODB_URI } = require('./utils/config')
const {
  requestLogger,
  unknownEndPoint,
  errorHandler,
  tokenExtractor,
} = require('./utils/middleware')

app = express()

console.log(`Connecting to ${MONGODB_URI}`)

mongoose
  .connect(MONGODB_URI, { family: 4 })
  .then(() => {
    console.info('Connected to mongoose')
  })
  .catch((error) =>
    console.error('Error connecting to mongoose:', error.message)
  )

app.use(tokenExtractor)
app.use(express.json())
app.use(requestLogger)
app.use('/api/bloglist', blogListRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use(unknownEndPoint)
app.use(errorHandler)

module.exports = app
