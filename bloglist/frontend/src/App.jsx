import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, _setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState({ message: null, success: true })
  const [author, setAuthor] = useState('')
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')

  const blogFormRef = useRef()
  const setBlogs = (blogs) => {
    blogs.sort((a, b) => -(a.likes - b.likes))
    _setBlogs(blogs)
  }
  const handleDeleteBlog = (blog) => {
    if (!confirm(`Are you sure you want to delete '${blog.title}'?`)) {
      return
    }
    blogService.remove(blog.id).then(() => {
      setBlogs(blogs.filter((item) => item.id !== blog.id))
      notify({ message: `blog '${blog.title}' removed`, success: true })
    })
  }

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
    const savedUser = JSON.parse(localStorage.getItem('loggedBlogsAppUser'))
    if (savedUser) {
      setUser(savedUser)
      blogService.setToken(savedUser.token)
    }
  }, [])

  const notify = (obj) => {
    setNotification(obj)
    setTimeout(() => setNotification({ message: null, success: true }), 3000)
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
    } catch {
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
    blogFormRef.current.toggleVisibility()
    const savedBlog = await blogService.create({ title, author, url })
    setBlogs(blogs.concat(savedBlog))
    notify({
      message: `Blog '${savedBlog.title}' by ${savedBlog.author} added`,
      success: true,
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const updateBlog = async (newBlog) => {
    const savedBlog = await blogService.update(newBlog)
    notify({
      message: `Blog '${savedBlog.title}' likes updated to ${savedBlog.likes}`,
      success: true,
    })
    setBlogs(blogs.map((blog) => (blog.id === savedBlog.id ? savedBlog : blog)))
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={notification.message} success={notification.success} />
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
      {user && (
        <>
          <div>
            {user.name} logged in
            <button onClick={logout}>logout</button>
          </div>
          <h3>New Blog</h3>
          <Togglable buttonLabel='add blog' ref={blogFormRef}>
            <BlogForm
              title={title}
              author={author}
              url={url}
              setTitle={setTitle}
              setAuthor={setAuthor}
              setUrl={setUrl}
              onSubmit={handleCreateBlog}
            />
          </Togglable>
        </>
      )}
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          handleUpdate={updateBlog}
          handleDelete={handleDeleteBlog}
        />
      ))}
    </div>
  )
}

export default App
