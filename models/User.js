const { Schema, model, Types: { ObjectId } } = require('mongoose')

const schema = new Schema({
    fname: {
        type: String,
        required: true,
        minLength: [1, 'First name must be at least 1 character long'],
        maxLength: [30, 'First name can\'t be more than 30 characters long']
    },
    lname: {
        type: String,
        required: true,
        minLength: [1, 'Last name must be at least 1 character long'],
        maxLength: [30, 'Last name can\'t be more than 30 characters long']
    },
    password: {
        type: String,
        required: true,
        required: [true, 'Password is required']
    },
    email: {
        type: String,
        required: true,
        minLength: [4, 'Email must be at least 4 character long'],
        maxLength: [30, 'Email can\'t be more than 30 characters long'],
        unique: [true, 'The email is already registered']
    },
    verified: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        validate: {
            validator: value => (
                (
                    value
                    && value.every((n, i) => Number.isInteger(n) || n == ' ' || (i == 0 && n == '+'))
                    && value.length >= 7
                    && value.length <= 12
                )
                || true
            ),
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
        ref: 'ShoppingCart'
    }
})

schema.index({ email: 1 }, {
    unique: true,
    collation: {
        locale: 'en',
        strength: 2
    }
})

const User = model('User', schema)

module.exports = User