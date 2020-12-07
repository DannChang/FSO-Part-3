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
]

// const generateId = () => {
//     const maxId = notes.length > 0
//         ? Math.max(...notes.map(n => n.id)) // spread syntax ... converts the array to individual numbers as a parameter for Math.max
//         : 0;
//     return maxId + 1;
// }

// app.post('/api/persons', (request, response) => {
//     const body = request.body;

//     if (!body.content) {
//         return response.status(400).json({
//             error: 'content missing'
//         });
//     } 

//     const person = {
//         content: body.content,
//         important: body.important || false,
//         date: new Date(),
//         id: generateId(),
//     }
    
//     notes = persons.concat(person);
//     console.log(person);

//     response.json(person);
// });

app.get('/api/persons', (request, response) => {
    response.json(persons);
});

app.get('/info', (request,response) => {
    const personEntry = `<p>Phonebook has info for ${persons.length} people</p>`
    const dateEntry = `<p>${new Date()}</p>`;
    response.send(`${personEntry}${dateEntry}`);
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);
    console.log(person)
    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    };
});

app.delete('api/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    const persons = persons.filter(note => note.id !== id)

    response.status(204).end();
});


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const PORT2 = 3003;
app.listen(PORT2, () => {
    console.log(`Server is running on port ${PORT2}`);
});