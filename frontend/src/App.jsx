import { useState, useEffect, useRef } from 'react'

import Note from './components/Note'
import Notification from './components/Notification'
import Footer from './components/Footer'

import noteService from './services/notes'
import loginService from './services/login'

import LoginForm from './components/LoginForm'
import NoteForm from './components/NoteForm'
import Togglable from './components/Togglable'

export default function App() {
  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [feedback, setFeedback] = useState({ message: null, success: true })

  const noteFormRef = useRef()

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
    } catch {
      notify({ message: 'Invalid credentials', success: false })
    }
  }

  const logout = () => {
    localStorage.removeItem('loggedNoteAppUser')
    notify({ message: `${user.name} logged out`, success: true })
    setUser(null)
  }

  const creatNote = (note) => {
    noteFormRef.current.toggleVisibility()
    noteService.create(note).then((response) => {
      setNotes(notes.concat(response))
      notify({ message: `Note '${response.content}' added`, success: true })
    })
  }

  const toggleImportance = (id) => () => {
    let note = notes.find((n) => n.id === id)
    note = { ...note, important: !note.important }

    noteService.update(id, note).then((response) => {
      setNotes(notes.map((note) => (note.id === id ? response : note)))
    })
  }
  const notesToShow = showAll ? notes : notes.filter((note) => note.important)

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={feedback.message} success={feedback.success} />
      {!user && (
        <Togglable buttonLabel='login'>
          <LoginForm
            username={username}
            password={password}
            setUsername={setUsername}
            setPassword={setPassword}
            handleLogin={handleLogin}
          />
        </Togglable>
      )}

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
          <Togglable buttonLabel='Add Note' ref={noteFormRef}>
            <NoteForm createNote={creatNote} />
          </Togglable>
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
