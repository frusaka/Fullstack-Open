const mongoose = require('mongoose')
const express = require('express')
const BlogListRouter = require('./controllers/bloglist')
const { MONGODB_URI } = require('./utils/config')
const {
  requestLogger,
  unknownEndPoint,
  errorHandler,
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

app.use(express.json())
app.use(requestLogger)
app.use('/api/bloglist', BlogListRouter)
app.use(unknownEndPoint)
app.use(errorHandler)

module.exports = app
