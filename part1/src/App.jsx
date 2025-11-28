import { useState } from "react";

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;

const History = ({ allClicks }) => {
  if (allClicks.length == 0) {
    return <div>the app is used by pressing the buttons</div>;
  }
  return <div>button press history {allClicks.join(" ")}</div>;
};

const App = () => {
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(0);
  const [allClicks, setAll] = useState([]);

  const handleLeftClick = () => {
    setAll(allClicks.concat("L"));
    setLeft(left + 1);

    // setTotal(left + right + 1);
  };

  const handleRightClick = () => {
    setAll(allClicks.concat("R"));
    setRight(right + 1);

    // setTotal(left + right + 1);
  };

  return (
    <div>
      {left}
      <Button onClick={handleLeftClick} text="left"></Button>
      <Button onClick={handleRightClick} text="right"></Button>
      {right}
      <History allClicks={allClicks} />
    </div>
  );
};

export default App;
