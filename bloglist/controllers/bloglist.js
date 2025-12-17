const BlogListRouter = require('express').Router()
const Blog = require('../models/blog')

BlogListRouter.get('/', (request, response, next) => {
  Blog.find({})
    .then((results) => {
      response.json(results)
    })
    .catch((error) => next(error))
})

BlogListRouter.post('/', (request, response, next) => {
  Blog({ ...request.body, likes: request.body.likes || 0 })
    .save()
    .then((savedBlog) => {
      response.json(savedBlog)
    })
    .catch((error) => next(error))
})

BlogListRouter.get('/:id', (request, response, next) => {
  Blog.findById(request.params.id)
    .then((blog) => {
      if (blog) response.json(blog)
      else response.status(404).end()
    })
    .catch((error) => next(error))
})

module.exports = BlogListRouter
