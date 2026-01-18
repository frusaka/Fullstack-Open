import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Togglable from './Togglable'

describe('<Togglable />', () => {
  beforeEach(() => {
    render(
      <Togglable buttonLabel='show...'>
        <div>togglable content</div>
      </Togglable>,
    )
  })

  test('renders "show" button', () => {
    expect(screen.getByText('show...'))
  })

  test('children not rendered by default', () => {
    expect(() => screen.getByText('togglable content')).toThrowError()
    expect(() => screen.getByText('cancel')).toThrowError()
  })

  test('shows children and "cancel" when "show" button pressed', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByText('show...'))
    expect(screen.getByText('togglable content'))
    expect(screen.getByText('cancel'))
  })

  test('hides children when "cancel" button pressed', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByText('show...'))
    await user.click(screen.getByText('cancel'))
    expect(() => screen.getByText('togglable content')).toThrowError()
    expect(() => screen.getByText('cancel')).toThrowError()
  })
})
