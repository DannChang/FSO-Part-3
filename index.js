require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();

// Imports minified front-end app in 'build' folder
app.use(express.static('build'));
// Imports cross-origin calls
app.use(cors());
// Imports body parser (part of Express now)
app.use(express.json());
// Imports morgan middleware to log [Method, url, status, response]
app.use(morgan((tokens, request, response) => {
  const tokenMethod = tokens.method(request, response);
  const logger = [
    tokenMethod,
    tokens.url(request, response),
    tokens.status(request, response),
    tokens.res(request, response, 'content-length'), '-',
    tokens['response-time'](request, response), 'ms'
  ];
  if (tokenMethod === 'POST') {
    logger.push(JSON.stringify(request.body));
  } return logger.join(' ');
}));


// Requests main page
app.get('/', (request, response) => {
  response.send('Phonebook backend');
});

app.get('/info', (request,response, next) => {
  Person.find({})
    .then((persons) => {
      const personCount = persons.length === 1 ? '1 person' : `${persons.length} people`;

      const personEntry = `<p>Phonebook has info for ${personCount} people</p>`;
      const dateEntry = `<p>${new Date()}</p>`;

      response.send(`${personEntry}${dateEntry}`);
    })
    .catch(next);
});

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => {
      response.json(persons);
    })
    .catch(next);
});

app.post('/api/persons', (request, response, next) => {
  const body = request.body;

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save()
    .then(savedPerson => {
      response.status(201).json(savedPerson);
    })
    .catch(next);
});

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if(person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch(next);
});

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };
  // update by entry's unique ID
  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatedPerson) => {
      if (updatedPerson) {
        response.json(updatedPerson);
      } else {
        response.status(404).end();
      }
    })
    .catch(next);
});

app.delete('api/persons/:id', (request, response, next) => {
  Person
    .findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(200).end();
    })
    .catch(next);
});

app.use((request, response) => {
  response.status(404).json({ error: 'unknown endpoint' });
});

// Error handling of all .catch(next) instances
const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === 'CaseError' && error.kind === 'ObjectId') {
    return (
      response.status(404).json({ error: 'malformatted id' })
    );
  } else if (error.name === 'ValidationError') {
    response.status(400).json({ error: error.message });
  }

  next(error);
};
app.use(errorHandler);


const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});