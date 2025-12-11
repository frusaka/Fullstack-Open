export default function Note({ note, toggleImportance }) {
  return (
    <li>
      {note.content}
      <button onClick={toggleImportance}>
        {note.important ? "mark as unimportant" : "mark as important"}
      </button>
    </li>
  );
}
