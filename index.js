require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path')
const app = express();
const Person = require('./models/person');

app.use(express.static('build'));
app.use(cors());
app.use(express.json());
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

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    },
    {
        id: 5,
        name: "Random Dude",
        number: "8888888888"
    },
];


app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, 'build', 'index.html'));
})

app.get('/info', (request,response) => {
    const personEntry = `<p>Phonebook has info for ${persons.length} people</p>`;
    const dateEntry = `<p>${new Date()}</p>`;
    response.send(`${personEntry}${dateEntry}`);
});

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons);
    });
});

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (body.content === undefined) {
        return response.status(400).json({ error: 'content missing' })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedNote => {
        response.json(savedNote)
    })
});

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if(person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
});

app.delete('api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(next)
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});