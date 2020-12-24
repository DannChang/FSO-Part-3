const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Person = require('./models/person');

const url = process.env.MONGODB_URI

console.log("connecting to ")

//create schema
const personSchema = new Schema({
    name: String,
    number: String,
})

module.exports = mongoose.model('person'. personSchema);
