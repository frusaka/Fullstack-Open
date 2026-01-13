const bcrypt = require('bcrypt')
const User = require('../models/user')
const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  },
]

async function blogsInDb() {
  const blogs = await Blog.find({})
  return blogs.map((e) => e.toJSON())
}

async function testUsers() {
  await new User({
    username: 'testuser1',
    name: 'Me Myself',
    passwordHash: await bcrypt.hash('sekret', 10),
  }).save()
  await new User({
    username: 'testuser2',
    name: 'Frederic R',
    passwordHash: await bcrypt.hash('comeSee', 10),
  }).save()
  const ids = (await User.find({})).map((e) => e._id.toString())
  initialBlogs.forEach((blog, idx) => (blog.user = ids[idx % 2]))
}

async function login(api, idx) {
  let token
  if (!idx) {
    token = (
      await api
        .post('/api/login')
        .send({ username: 'testuser1', password: 'sekret' })
    ).body.token
  } else {
    token = (
      await api
        .post('/api/login')
        .send({ username: 'testuser2', password: 'comeSee' })
    ).body.token
  }

  return token
}

module.exports = {
  initialBlogs,
  testUsers,
  login,
  blogsInDb,
}
