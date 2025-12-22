const { test, beforeEach, before, after, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)
let token

before(async () => {
  await User.deleteMany({})
  await helper.testUsers()
})

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('gets correct list of blogs', async () => {
  const response = await api
    .get('/api/bloglist')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('unique identifier is named "id"', async () => {
  assert((await helper.blogsInDb())[0].id)
  assert(!(await helper.blogsInDb())[0]._id)
})

test('creating a new blog works', async () => {
  token = await helper.login(api, 0)
  await api
    .post('/api/bloglist')
    .set('Authorization', 'Bearer ' + token)
    .send(helper.initialBlogs[2])
    .expect(201)
    .expect('Content-Type', /application\/json/)
  assert(
    (await api.get('/api/bloglist')).body.length ==
      helper.initialBlogs.length + 1
  )
})

test('if "likes" property missing, default is 0', async () => {
  token = await helper.login(api, 1)
  const blog = {
    title: 'Missing likes',
    author: 'Lonely Nice',
    url: 'https://something.com',
  }

  assert(
    (
      await api
        .post('/api/bloglist')
        .set('Authorization', 'Bearer ' + token)
        .send(blog)
        .expect(201)
    ).body.likes === 0
  )
})

test('if url,title, or author is missing, returns 400', async () => {
  token = await helper.login(api, 0)
  await api
    .post('/api/bloglist')
    .set('Authorization', 'Bearer ' + token)
    .send({
      author: 'Mr Nice',
      url: 'https://something.com',
    })
    .expect(400)
  await api
    .post('/api/bloglist')
    .set('Authorization', 'Bearer ' + token)
    .send({
      title: 'Missing likes',
      url: 'https://something.com',
    })
    .expect(400)
  await api
    .post('/api/bloglist')
    .set('Authorization', 'Bearer ' + token)
    .send({
      title: 'Missing likes',
      author: 'Mr Nice',
    })
    .expect(400)
  await api
    .post('/api/bloglist')
    .set('Authorization', 'Bearer ' + token)
    .send({})
    .expect(400)
})

describe('deleting a blog', async () => {
  test('succeds with status 204 for a valid id', async () => {
    token = await helper.login(api, 0)
    const blog = (await helper.blogsInDb())[0]
    await api
      .delete(`/api/bloglist/${blog.id}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(204)
    const remainingBlogs = await helper.blogsInDb()
    assert(remainingBlogs.length == helper.initialBlogs.length - 1)
    remainingBlogs.forEach((e) => assert.notDeepStrictEqual(e, blog))
  })
  test('fails with status 404 for invalid id', async () => {
    token = await helper.login(api, 1)
    const id = (await helper.blogsInDb())[1].id
    await api
      .delete(`/api/bloglist/${id}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(204)
    await api
      .delete(`/api/bloglist/${id}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(404)
    const remainingBlogs = await helper.blogsInDb()
    assert(remainingBlogs.length == helper.initialBlogs.length - 1)
  })
})

describe('updating a blog', () => {
  test('succeeds with status 201 for valid id', async () => {
    token = await helper.login(api, 1)
    const id = (await helper.blogsInDb())[3].id
    await api
      .put(`/api/bloglist/${id}`)
      .set('Authorization', 'Bearer ' + token)
      .send({
        likes: 1234,
      })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert((await helper.blogsInDb())[3].likes === 1234)
  })
  test('fails with status 404 for non-existing id', async () => {
    token = await helper.login(api, 0)
    const id = (await helper.blogsInDb())[0].id
    await api
      .delete(`/api/bloglist/${id}`)
      .set('Authorization', 'Bearer ' + token)
    await api
      .put(`/api/bloglist/${id}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(404)
  })
})

describe('accessing a single blog', () => {
  test('succeeds with status 200 for valid id', async () => {
    const blog = (await helper.blogsInDb())[1]
    const resultBlog = await api
      .get(`/api/bloglist/${blog.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    assert.deepStrictEqual(resultBlog.body, blog)
  })
  test('fails with status 404 for invalid id', async () => {
    token = await helper.login(api, 1)
    const id = (await helper.blogsInDb())[5].id
    await api
      .delete(`/api/bloglist/${id}`)
      .set('Authorization', 'Bearer ' + token)
    await api.get(`/api/bloglist/${id}`).expect(404)
  })
})

after(async () => {
  await mongoose.connection.close()
})
