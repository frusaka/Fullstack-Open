import { useState, useEffect } from 'react'

import Note from './components/Note'
import Notification from './components/Notification'
import Footer from './components/Footer'

import noteService from './services/notes'
import loginService from './services/login'
import Login from './components/LoginForm'
import NoteForm from './components/BlogForm'

export default function App() {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('a new note...')
  const [showAll, setShowAll] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [feedback, setFeedback] = useState({ message: null, success: true })

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('loggedNoteAppUser'))
    if (savedUser) {
      setUser(savedUser)
      noteService.setToken(savedUser.token)
    }
    noteService.getAll().then((response) => {
      setNotes(response)
    })
  }, [])

  const notify = (obj) => {
    setFeedback(obj)
    setTimeout(() => setFeedback({ message: null, success: true }), 3000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login(username, password)
      localStorage.setItem('loggedNoteAppUser', JSON.stringify(user))
      notify({ message: 'Login successful', success: true })
      noteService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (e) {
      notify({ message: 'Invalid credentials', success: false })
    }
  }

  const logout = () => {
    localStorage.removeItem('loggedNoteAppUser')
    setUser(null)
  }

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    }

    noteService.create(noteObject).then((response) => {
      setNotes(notes.concat(response))
    })

    setNewNote('')
  }

  const handleNoteChange = (event) => setNewNote(event.target.value)

  const toggleImportance = (id) => () => {
    let note = notes.find((n) => n.id == id)
    note = { ...note, important: !note.important }

    noteService.update(id, note).then((response) => {
      setNotes(notes.map((note) => (note.id == id ? response : note)))
    })
  }
  const notesToShow = showAll ? notes : notes.filter((note) => note.important)

  return (
    <div>
      <h1>Notes</h1>
      {!user && (
        <Login
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          handleLogin={handleLogin}
        />
      )}
      <Notification message={feedback.message} success={feedback.success} />

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      {user && (
        <>
          <div>
            {user.name} logged in
            <button onClick={logout}>logout</button>
          </div>
          <NoteForm
            addNote={addNote}
            newNote={newNote}
            handleNoteChange={handleNoteChange}
          />
        </>
      )}
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={toggleImportance(note.id)}
          />
        ))}
      </ul>

      <Footer />
    </div>
  )
}
