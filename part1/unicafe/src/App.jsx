import { useState } from "react";

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;

const StatisticLine = ({ text, value }) => (
  <p>
    {text}: {value}
  </p>
);

const Stats = ({ good, neutral, bad }) => {
  if (good + neutral + bad == 0) {
    return <div>No stats collected</div>;
  }
  return (
    <div>
      <StatisticLine text="Good" value={good}></StatisticLine>
      <StatisticLine text="Neutral" value={neutral}></StatisticLine>
      <StatisticLine text="Bad" value={bad}></StatisticLine>
      <p>All: {good + bad + neutral}</p>
      <p>Average: {(good - bad) / (good + bad + neutral)}</p>
      <p>Positive: {(good / (good + bad + neutral)) * 100}%</p>
    </div>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <h2>Give feedback</h2>
      <Button text="good" onClick={() => setGood(good + 1)}></Button>
      <Button text="neutral" onClick={() => setNeutral(neutral + 1)}></Button>
      <Button text="bad" onClick={() => setBad(bad + 1)}></Button>
      <h2>Statistics</h2>
      <Stats good={good} neutral={neutral} bad={bad}></Stats>
    </div>
  );
};

export default App;
