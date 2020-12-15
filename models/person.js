const mongoose = require('mongoose');
const Schema = mongoose.Schema;



//create schema
const personSchema = new Schema({
    name: String,
    number: String,
})

module.exports = Person = mongoose.model('person'. personSchema);
