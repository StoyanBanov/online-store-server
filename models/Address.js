const { Schema, model, Types: { ObjectId } } = require('mongoose')

const schema = new Schema({
    street: {
        type: String,
        minLength: [1, 'Street must be at least 1 character long'],
        maxLength: [30, 'Street can\'t be more than 30 characters long'],
        required: true
    },
    city: {
        type: String,
        minLength: [1, 'City must be at least 1 character long'],
        maxLength: [30, 'City can\'t be more than 30 characters long'],
        required: true
    },
    zipCode: {
        type: String,
        minLength: [1, 'ZIP code must be at least 1 character long'],
        maxLength: [5, 'ZIP code can\'t be more than 5 characters long'],
        validate: {
            validator: value => value.split('').every(n => !isNaN(Number(n))),
            message: 'ZIP code must consist of digits only'
        },
        required: true
    },
    county: {
        type: String,
        minLength: [1, 'County must be at least 1 character long'],
        maxLength: [30, 'County can\'t be more than 30 characters long'],
        required: true
    },
    country: {
        type: String,
        minLength: [1, 'County must be at least 1 character long'],
        maxLength: [30, 'County can\'t be more than 30 characters long'],
        required: true
    }
})

const Address = model('Address', schema)

module.exports = Address