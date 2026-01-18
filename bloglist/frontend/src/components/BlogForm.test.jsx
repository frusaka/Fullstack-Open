import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm />', async () => {
  const blog = {
    title: 'Test blog',
    author: 'frusaka',
    url: 'https://github.com/frusaka',
  }
  const onSubmit = vi.fn()

  render(
    <BlogForm
      title={blog.title}
      author={blog.author}
      url={blog.url}
      onSubmit={onSubmit}
    />,
  )
  const createBtn = screen.getByText('create')
  const user = userEvent.setup()

  await user.click(createBtn)

  expect(onSubmit.mock.calls).toHaveLength(1)
})
