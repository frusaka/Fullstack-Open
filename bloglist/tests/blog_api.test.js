const { test, beforeEach, after, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../models/blog')
const { initialBlogs } = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

test('gets correct list of blogs', async () => {
  const response = await api
    .get('/api/bloglist')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('unique identifier is named "id"', async () => {
  assert((await api.get('/api/bloglist')).body[0].id)
  assert(!(await api.get('/api/bloglist')).body[0]._id)
})

test('creating a new blog works', async () => {
  await api
    .post('/api/bloglist')
    .send(initialBlogs[2])
    .expect(201)
    .expect('Content-Type', /application\/json/)
  assert(
    (await api.get('/api/bloglist')).body.length == initialBlogs.length + 1
  )
})

test('if "likes" property missing, default is 0', async () => {
  const blog = {
    title: 'Missing likes',
    author: 'Lonely Nice',
    url: 'https://something.com',
  }

  assert((await api.post('/api/bloglist').send(blog)).body.likes === 0)
})

test('if url,title, or author is missing, returns 400', async () => {
  await api
    .post('/api/bloglist')
    .send({
      author: 'Mr Nice',
      url: 'https://something.com',
    })
    .expect(400)
  await api
    .post('/api/bloglist')
    .send({
      title: 'Missing likes',
      url: 'https://something.com',
    })
    .expect(400)
  await api
    .post('/api/bloglist')
    .send({
      title: 'Missing likes',
      author: 'Mr Nice',
    })
    .expect(400)
  await api.post('/api/bloglist').send({}).expect(400)
})

describe('deleting a blog', () => {
  test('succeds with status 204 for a valid id', async () => {
    const blog = (await api.get('/api/bloglist')).body[0]
    await api.delete(`/api/bloglist/${blog.id}`).expect(204)
    const remainingBlogs = (await api.get('/api/bloglist')).body
    assert(remainingBlogs.length == initialBlogs.length - 1)
    remainingBlogs.forEach((e) => assert.notDeepStrictEqual(e, blog))
  })
  test('fails with status 404 for invalid id', async () => {
    const id = (await api.get('/api/bloglist')).body[0].id
    await api.delete(`/api/bloglist/${id}`)
    await api.delete(`/api/bloglist/${id}`).expect(404)
  })
})

describe('updating a blog', () => {
  test('succeeds with status 201 for valid id', async () => {
    const id = (await api.get('/api/bloglist')).body[0].id
    const newBlog = (
      await api
        .put(`/api/bloglist/${id}`)
        .send({
          likes: 10000,
        })
        .expect(201)
        .expect('Content-Type', /application\/json/)
    ).body
    assert.deepEqual((await api.get(`/api/bloglist/${id}`)).body, newBlog)
  })
  test('fails with status 404 for invalid id', async () => {
    const id = (await api.get('/api/bloglist')).body[0].id
    await api.delete(`/api/bloglist/${id}`)
    await api.put(`/api/bloglist/${id}`).expect(404)
  })
})

describe('accessing a single blog', () => {
  test('succeeds with status 200 for valid id', async () => {
    const blog = (await api.get('/api/bloglist')).body[1]
    const resultBlog = await api
      .get(`/api/bloglist/${blog.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    assert.deepStrictEqual(resultBlog.body, blog)
  })
  test('fails with status 404 for invalid id', async () => {
    const id = (await api.get('/api/bloglist')).body[0].id
    await api.delete(`/api/bloglist/${id}`)
    await api.get(`/api/bloglist/${id}`).expect(404)
  })
})

after(async () => {
  await mongoose.connection.close()
})
