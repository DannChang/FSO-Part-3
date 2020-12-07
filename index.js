const express = require('express');
const app = express();

app.use(express.json());

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
        name: "Bobby Chan",
        number: "8888888888"
    },
];

const getRandomInt = () => {
    const min = Math.ceil(0);
    const max = Math.floor(1000);
    return Math.floor(Math.random() * (max - min) + min);
};

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name) {
        return response.status(400).json({
            error: 'name is missing'
        });
    } else if (!body.number) {
        return response.status(400).json({
            error: 'number is missing'
        })
    } else if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    } 

    const person = {
        id: getRandomInt(),
        name: body.name,
        number: body.number,
    };
    
    persons = persons.concat(person);
    console.log(person);
    console.log(error);
    response.json(person);
});

app.delete('api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);
    console.log(persons)
    response.status(204).end();
    
});

app.get('/api/persons', (request, response) => {
    response.json(persons);
});


app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const personId = persons.find(person => person.id === id);
    console.log(personId);
    if (personId) {
        response.json(personId);
    } else {
        response.status(404).end();
    };
});



app.get('/info', (request,response) => {
    const personEntry = `<p>Phonebook has info for ${persons.length} people</p>`
    const dateEntry = `<p>${new Date()}</p>`;
    response.send(`${personEntry}${dateEntry}`);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const PORT2 = 3003;
app.listen(PORT2, () => {
    console.log(`Server is running on port ${PORT2}`);
});