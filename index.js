require("dotenv").config();
const express = require("express");
var morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const app = express();
app.use(express.static("build"));
app.use(cors());
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :param")
);

morgan.token("param", function (req, res, param) {
  return JSON.stringify(req.body);
});

app.get("/info", (request, response) => {
  const result = Person.find({});
  response.send(
    `<div><p>Phonebook has info for ${
      result.length
    } people</p><p>${new Date()}</p></div>`
  );
});

// const unknownEndpoint = (request, response) => {
//   response.status(404).send({ error: "unknown endpoint" });
// };

// // handler of requests with unknown endpoint
// app.use(unknownEndpoint);

app.get("/api/persons", (request, response) => {
  Person.find({}).then((result) => {
    response.json(result);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  Person.find({}).then((result) => {
    if (result.includes(body.name)) {
      return response.status(400).json({
        error: "Name already exists",
      });
    }
  });

  const person = new Person({
    name: body.name,
    number: body.number || "",
  });

  person
    .save()
    .then((savedPers) => {
      response.json(savedPers);
    })
    .catch((err) => {
      next(err);
    });
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person)
    .then((updatedPers) => {
      response.json(updatedPers);
    })
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
