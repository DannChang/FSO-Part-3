const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path')
const app = express();

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

const getRandomInt = () => {
    const min = Math.ceil(0);
    const max = Math.floor(1000);
    return Math.floor(Math.random() * (max - min) + min);
};

app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, 'build', 'index.html'));
})

app.get('/info', (request,response) => {
    const personEntry = `<p>Phonebook has info for ${persons.length} people</p>`
    const dateEntry = `<p>${new Date()}</p>`;
    response.send(`${personEntry}${dateEntry}`);
});

app.get('/api/persons', (request, response) => {
    response.json(persons);
});

app.post('/api/persons', (request, response) => {
    const body = request.body;
    const found = persons.find(person => person.name === body.name);
    if (!body.name) {
        return response.status(400).json({
            error: 'name is missing'
        });
    } else if (!body.number) {
        return response.status(400).json({
            error: 'number is missing'
        })
    } else if (found) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    } else {
        const newPerson = {
            id: getRandomInt(),
            name: body.name,
            number: body.number,
        };
        persons = persons.concat(newPerson);
        response.json(newPerson);   
    }
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const foundPerson = persons.find(person => person.id === id);
    if (foundPerson) {
        response.json(foundPerson);
    } else {
        response.status(404).end();
    };
});

app.delete('api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const foundPerson = persons.find(person => person.id === id);
    if (foundPerson) {
        response.json(persons.filter(person => person.id !== id));
    } else {
        response.status(204).end();
    };
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});