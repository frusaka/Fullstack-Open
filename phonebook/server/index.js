require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const Person = require("./models/person");

const app = express();

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(express.static("dist"));
app.use(express.json());
morgan.token("body", (request) => JSON.stringify(request.body));
app.use(morgan(":method :url :status - :response-time ms :body"));

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/info", (request, response) => {
  const now = new Date().toLocaleString();
  Person.find({}).then((persons) =>
    response.send(`
<div>
  <p>PhoneBook has info for ${persons.length} people</p>
  <p>${now}</p>
</div>`)
  );
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => response.json(person));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => response.status(204).end())
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!(body.name && body.number)) {
    return response.status(400).json({ error: "Content missing" });
  }
  Person.find({ name: body.name }).then((value) => {
    if (value.length) {
      return response.status(400).json({ error: "Person already exists" });
    }

    Person({
      name: body.name,
      number: body.number,
    })
      .save()
      .then((person) => response.json(person));
  });
});

app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body;
  Person.findById(request.params.id).then((person) => {
    if (!person) {
      return response.status(404).end();
    }
    person.name = name;
    person.number = number;

    person
      .save()
      .then((updatedPerson) => response.json(updatedPerson))
      .catch((error) => next(error));
  });
});

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.log(error.message);
  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
