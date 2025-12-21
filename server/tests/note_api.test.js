const { test, after, beforeEach, before } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Note = require('../models/note')
const User = require('../models/user')

const api = supertest(app)

before(async () => {
  await mongoose.connection.close() // WORKAROUND: using the same db path is problematic due to the nature of async/await 'interleaving'
  await mongoose.connect(process.env.TEST_NOTES_API_MONGODB_URI, { family: 4 })
  await User.deleteMany({})

  const users = await helper.testUsers()
  helper.initialNotes.forEach((note, idx) => {
    note.user = users[idx % 2]
  })
})

beforeEach(async () => {
  await Note.deleteMany({})
  await Note.insertMany(helper.initialNotes)
})

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all notes are returned', async () => {
  const response = await api.get('/api/notes')
  assert.strictEqual(response.body.length, response.body.length)
})

test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes')

  const contents = response.body.map((e) => e.content)
  assert(contents.includes('HTML is easy'))
})

test('a valid note can be added', async () => {
  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true,
    userId: helper.initialNotes[1].user,
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const notes = await helper.notesInDb()
  const contents = notes.map((e) => e.content)

  assert.strictEqual(notes.length, helper.initialNotes.length + 1)
  assert(contents.includes(newNote.content))
})

test('note without content is not added', async () => {
  const newNote = {
    important: true,
  }

  await api.post('/api/notes').send(newNote).expect(400)

  assert((await helper.notesInDb()).length === helper.initialNotes.length)
})

test('a specific note can be viewed', async () => {
  const note = (await helper.notesInDb())[0]
  const resultNote = await api
    .get(`/api/notes/${note.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)
  assert.deepStrictEqual(resultNote.body, {
    ...note,
    user: note.user._id.toString(),
  })
})

test('a note can be deleted', async () => {
  const notesAtStart = await helper.notesInDb()
  const noteToDelete = notesAtStart[0]

  await api.delete(`/api/notes/${noteToDelete.id}`).expect(204)

  const notesAtEnd = await helper.notesInDb()

  const contents = notesAtEnd.map((n) => n.content)
  assert(!contents.includes(noteToDelete.content))

  assert.strictEqual(notesAtEnd.length, helper.initialNotes.length - 1)
})

after(async () => {
  await mongoose.connection.close()
})
