const Hello = (props) => {
  console.log(props)
  return (
    <div>
      <p>Hello {props.name}, you are {props.age} years old</p>
    </div>
  )
}

const App = () => {
  const friends = ["Maya", "Houston"]
  return (
    <div>
      <h1>Greetings</h1>

      <p>{friends}</p>
    </div>
  )
}
export default App