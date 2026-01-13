import { useRef, useState } from 'react'
import Togglable from './Togglable'

const Blog = ({ blog, handleUpdate, handleDelete }) => {
  const [detailsVisible, setDetailsVisible] = useState('')
  const [likes, setLikes] = useState(blog.likes)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const likesFormRef = useRef()

  const changeLikes = (event) => {
    event.preventDefault()
    likesFormRef.current.toggleVisibility()
    handleUpdate({ ...blog, likes: likes, user: blog.user.id })
  }

  return (
    <div style={blogStyle}>
      <h3>
        {blog.title}
        <button onClick={() => setDetailsVisible(!detailsVisible)}>
          {detailsVisible ? 'hide' : 'show'}
        </button>
      </h3>
      {detailsVisible && (
        <div>
          <div>
            URL: <a href={blog.url}>{blog.url}</a>
          </div>
          <div>
            Likes: {blog.likes}
            <Togglable buttonLabel='change' ref={likesFormRef}>
              <form action='put' onSubmit={changeLikes}>
                <input
                  type='number'
                  value={likes}
                  onChange={({ target }) => setLikes(target.value)}
                />
                <button type='submit'>ok</button>
              </form>
            </Togglable>
          </div>
          <p>Author: {blog.author}</p>
          <button onClick={() => handleDelete(blog)}>remove</button>
        </div>
      )}
    </div>
  )
}

export default Blog
