const mongoose = require('mongoose');
const { Schema } = mongoose;
// const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>');
  process.exit(1);
}
// hard coded pw: z0mrmh7mUtqcKvnU
const password = process.argv[2];
const MONGO_URI = `mongodb+srv://fullstack:${password}@cluster0.9um01.mongodb.net/<dbname>?retryWrites=true&w=majority`;

mongoose.connect(MONGO_URI, { useNewUrlParser: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);



if (process.argv.length < 5) {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
} else {
  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Person({ name, number });
  person.save().then(result => {
    console.log(`Added ${result.name} number: ${result.number} to the phonebook`);
    mongoose.connection.close();
  });
}


