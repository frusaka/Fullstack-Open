const bcrypt = require('bcrypt')
const Note = require('../models/note')
const User = require('../models/user')

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
  return (await User.find({})).map((e) => e._id.toString())
}

const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon' })
  await note.save()
  await note.deleteOne()

  return note._id.toString()
}

const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map((note) => note.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((note) => note.toJSON())
}

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false,
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true,
  },
]

module.exports = {
  testUsers,
  initialNotes,
  nonExistingId,
  notesInDb,
  usersInDb,
}
