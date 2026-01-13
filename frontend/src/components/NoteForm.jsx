import { useState } from 'react'

export default function NoteForm({ createNote }) {
  const [newNote, setNewNote] = useState('')
  const addNote = (event) => {
    event.preventDefault()
    createNote({
      content: newNote,
      important: true,
    })
    setNewNote('')
  }
  const handleNoteChange = ({ target }) => setNewNote(target.value)

  return (
    <form onSubmit={addNote}>
      <input
        value={newNote}
        onChange={handleNoteChange}
        placeholder='a new note...'
      />
      <button type='submit'>save</button>
    </form>
  )
}
