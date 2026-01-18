import { useState, useImperativeHandle } from 'react'

export default function Togglable(props) {
  const [visible, setVisible] = useState(false)
  const toggleVisibility = () => setVisible(!visible)

  useImperativeHandle(props.ref, () => {
    return { toggleVisibility }
  })

  return (
    <div>
      {!visible && (
        <div>
          <button onClick={toggleVisibility}>{props.buttonLabel}</button>
        </div>
      )}
      {visible && (
        <div>
          {props.children}
          <button onClick={() => setVisible(false)}>cancel</button>
        </div>
      )}
    </div>
  )
}
