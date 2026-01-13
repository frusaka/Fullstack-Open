import { useState, useImperativeHandle } from 'react'

export default function Togglable(props) {
  const [visible, setVisible] = useState(false)
  const toggleVisibility = () => setVisible(!visible)

  const style = {
    display: visible ? '' : 'inline-block',
  }

  useImperativeHandle(props.ref, () => {
    return { toggleVisibility }
  })

  return (
    <div style={style}>
      {!visible && (
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      )}
      {visible && (
        <>
          {props.children}
          <button onClick={() => setVisible(false)}>cancel</button>
        </>
      )}
    </div>
  )
}
