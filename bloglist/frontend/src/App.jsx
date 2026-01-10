import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [feedback, setFeedback] = useState({ message: null, success: true })
  const [author, setAuthor] = useState('')
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
    const savedUser = JSON.parse(localStorage.getItem('loggedBlogsAppUser'))
    if (savedUser) {
      setUser(savedUser)
      blogService.setToken(savedUser.token)
    }
  }, [])

  const notify = (obj) => {
    setFeedback(obj)
    setTimeout(() => setFeedback({ message: null, success: true }), 3000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login(username, password)
      localStorage.setItem('loggedBlogsAppUser', JSON.stringify(user))
      notify({ message: 'Login successful', success: true })
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (e) {
      notify({ message: 'Invalid credentials', success: false })
    }
  }

  const logout = () => {
    localStorage.removeItem('loggedBlogsAppUser')
    setUser(null)
    notify({ message: `${user.name} logged out`, success: true })
  }

  const handleCreateBlog = async (event) => {
    event.preventDefault()
    const savedBlog = await blogService.create({ title, author, url })
    notify({
      message: `Blog '${savedBlog.title}' by ${savedBlog.author} added`,
      success: true,
    })
    setTitle('')
    setAuthor('')
    setUrl('')
    setBlogs(blogs.concat(savedBlog))
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={feedback.message} success={feedback.success} />
      {!user && (
        <LoginForm
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          handleLogin={handleLogin}
        />
      )}
      {user && (
        <>
          <div>
            {user.name} logged in
            <button onClick={logout}>logout</button>
          </div>
          <h3>New Blog</h3>
          <BlogForm
            title={title}
            author={author}
            url={url}
            setTitle={setTitle}
            setAuthor={setAuthor}
            setUrl={setUrl}
            onSubmit={handleCreateBlog}
          />
        </>
      )}
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  )
}

export default App
