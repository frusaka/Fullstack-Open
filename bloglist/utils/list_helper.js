function dummy(blogs) {
  return 1
}

function totalLikes(blogs) {
  return blogs.reduce((acc, curr) => acc + curr.likes, 0)
}

function favoriteBlog(blogs) {
  return blogs.reduce(
    (prev, curr) => (prev.likes > curr.likes ? prev : curr),
    {}
  )
}

function mostBlogs(blogs) {
  if (!blogs.length) return {}
  let totalBlogs = {}
  blogs.forEach(
    (blog) => (totalBlogs[blog.author] = (totalBlogs[blog.author] || 0) + 1)
  )
  const author = Object.keys(totalBlogs).reduce((prev, curr) =>
    totalBlogs[prev] > totalBlogs[curr] ? prev : curr
  )
  return {
    author,
    blogs: totalBlogs[author],
  }
}

function mostLikes(blogs) {
  if (!blogs.length) return {}
  const author = favoriteBlog(blogs).author
  const likes = blogs.reduce(
    (prev, curr) => (curr.author === author ? prev + curr.likes : prev),
    0
  )
  return { author, likes }
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
