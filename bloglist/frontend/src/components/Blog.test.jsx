import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'Test blog',
    author: 'frusaka',
    url: 'https://github.com/frusaka',
    likes: 5,
  }
  beforeEach(() => {
    render(<Blog blog={blog} />)
  })
  test('renders only title by default', () => {
    expect(screen.getByText(blog.title))
    expect(screen.getByText('show').nodeName).toBe('BUTTON')
    // Secondary blog details are hidden
    expect(() => screen.getByText(blog.url)).toThrowError()
    expect(() => screen.getByText(blog.author)).toThrowError()
    expect(() => screen.getByText(blog.likes)).toThrowError()
    // Forms are hidden
    expect(() => screen.getByRole('spinbutton')).toThrowError()
    expect(() => screen.getByText('ok')).toThrowError()
  })

  describe('expands when "show" is clicked', () => {
    test('renders details', async () => {
      const user = userEvent.setup()
      await user.click(screen.getByText('show'))
      expect(screen.getByText(blog.title))
      expect(screen.getByText(blog.url))
      expect(screen.getByText(blog.author))
      expect(screen.getByText(blog.likes))

      expect(screen.getByText('remove').nodeName).toBe('BUTTON')
      expect(screen.getByText('change').nodeName).toBe('BUTTON') // Likes changer
    })
    test('renders form when "change" cliked', async () => {
      const user = userEvent.setup()
      await user.click(screen.getByText('show'))
      await user.click(screen.getByText('change'))
      expect(screen.getByRole('spinbutton'))
      expect(screen.getByText('ok') === 'BUTTON')
    })
  })
})
