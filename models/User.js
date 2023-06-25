const { Schema, model, Types: { ObjectId } } = require('mongoose')

const schema = new Schema({
    fname: {
        type: String,
        minLength: [1, 'First name must be at least 1 character long'],
        maxLength: [30, 'First name can\'t be more than 30 characters long']
    },
    lname: {
        type: String,
        minLength: [1, 'Last name must be at least 1 character long'],
        maxLength: [30, 'Last name can\'t be more than 30 characters long']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    email: {
        type: String,
        minLength: [4, 'Email must be at least 4 character long'],
        maxLength: [30, 'Email can\'t be more than 30 characters long']
    },
    verified: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        minLength: [7, 'Phone must be at least 7 character long'],
        maxLength: [12, 'Email can\'t be more than 12 characters long'],
        validate: {
            validator: value => value.every((n, i) => Number.isInteger(n) || n == ' ' || (i == 0 && n == '+')),
            message: ['Phone is in an incorrect format']
        }
    },
    address: {
        type: ObjectId,
        ref: 'Address',
        default: { street, city, zipCode, county, country }
    },
    secondAddress: {
        type: ObjectId,
        ref: 'Address',
        default: { street, city, zipCode, county, country }
    },
    shoppingCart: {
        type: ObjectId,
        ref: 'ShoppingCart',
        required: [true, 'Shopping cart id is required']
    }
})

const User = model('User', schema)

module.exports = User