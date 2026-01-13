const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  response.json(await Blog.find({}).populate('user', { username: 1, name: 1 }))
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const { title, url, author, likes } = request.body
  const user = request.user
  const savedBlog = await Blog({
    title,
    url,
    author,
    likes: likes || 0,
    user: user._id,
  }).save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) response.json(blog)
  else response.status(404).end()
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }
  if (blog.user.toString() !== request.user._id.toString()) {
    return response
      .status(401)
      .json({ error: "can't delete since you're not the owner" })
  }
  await Blog.findByIdAndDelete(blog._id)
  response.status(204).end()
})

blogsRouter.put('/:id', userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }
  if (blog.user.toString() !== request.user._id.toString()) {
    return response
      .status(401)
      .json({ error: "can't update since you're not the owner" })
  }
  blog.likes = request.body.likes
  await blog.save()
  response.status(201).json(blog)
})

module.exports = blogsRouter
