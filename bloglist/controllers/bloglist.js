const BlogListRouter = require('express').Router()
const Blog = require('../models/blog')

BlogListRouter.get('/', async (request, response) => {
  response.json(await Blog.find({}))
})

BlogListRouter.post('/', async (request, response) => {
  const savedBlog = await Blog({
    ...request.body,
    likes: request.body.likes || 0,
  }).save()
  response.status(201).json(savedBlog)
})

BlogListRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) response.json(blog)
  else response.status(404).end()
})

BlogListRouter.delete('/:id', async (request, response) => {
  if (await Blog.findByIdAndDelete(request.params.id))
    response.status(204).end()
  else response.status(404).end()
})

BlogListRouter.put('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (!blog) return response.status(404).end()
  blog.likes = request.body.likes
  await blog.save()
  response.status(201).json(blog)
})

module.exports = BlogListRouter
