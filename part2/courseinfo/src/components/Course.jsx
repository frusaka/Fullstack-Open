import Header from "./Header";
import Content from "./Content";
import Footer from "./Footer";

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course.name}></Header>
      <Content parts={course.parts}></Content>
      <Footer
        total={course.parts.reduce((prev, curr) => curr.exercises + prev, 0)}
      ></Footer>
    </div>
  );
};

export default Course;
