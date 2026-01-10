export default function BlogForm({
  onSubmit,
  title,
  author,
  url,
  setTitle,
  setAuthor,
  setUrl,
}) {
  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>
          title:
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          author:
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          url:
          <input value={url} onChange={({ target }) => setUrl(target.value)} />
        </label>
      </div>
      <button type='submit'>create</button>
    </form>
  )
}
