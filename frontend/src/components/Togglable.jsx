import { useState, useImperativeHandle } from 'react'

export default function Togglable(props) {
  const [visble, setVisible] = useState(false)
  const toggleVisibility = () => setVisible(!visble)

  useImperativeHandle(props.ref, () => {
    return { toggleVisibility }
  })

  return (
    <div>
      <div style={{ display: !visble ? '' : 'none' }}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={{ display: visble ? '' : 'none' }}>
        {props.children}
        <button onClick={() => setVisible(false)}>cancel</button>
      </div>
    </div>
  )
}
