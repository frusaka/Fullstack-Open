import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import Note from './Note'

describe('<Note />', () => {
  const content = 'Component testing is done with react-testing-library'
  describe('renders content', () => {
    it('important:true', () => {
      render(<Note note={{ content, important: true }} />)
      expect(screen.getByText('mark as unimportant'))
      expect(screen.getByText(content))
    })
    it('important:false', () => {
      render(<Note note={{ content, important: false }} />)
      expect(screen.getByText('mark as important'))
      expect(screen.getByText(content))
    })
  })

  test('changes importance on click', async () => {
    const mockHandler = vi.fn()
    render(
      <Note
        note={{ content, important: true }}
        toggleImportance={mockHandler}
      />,
    )
    const user = userEvent.setup()
    await user.click(screen.getByText('mark as unimportant'))

    expect(mockHandler.mock.calls).toHaveLength(1)
  })
})
