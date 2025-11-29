import Part from "./Part";

const Content = ({ parts }) => (
  <div>
    {parts.map((part) => (
      <Part key={part.id} name={part.name} excercises={part.excercises}></Part>
    ))}
  </div>
);

export default Content;
