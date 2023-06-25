const { Schema, model, Types: { ObjectId } } = require('mongoose')

const schema = new Schema({
    name: {
        type: String,
        minLength: [2, 'Item must be at least 2 characters long'],
        maxLength: [20, 'Item can\'t be more than 20 characters long']
    },
    price: {
        type: Number,
        min: [0.01, 'Price must be a positive number'],
        max: [999999, 'Price can\'t exceed 999 999'],
    },
    description: {
        type: String,
        minLength: [20, 'Description must be at least 20 characters long'],
        maxLength: [3000, 'Description can\'t be more than 3000 characters long']
    },
    category: {
        type: ObjectId,
        ref: 'Category',
        required: [true, 'Category is required']
    },
    _creator: {
        type: ObjectId,
        ref: 'User',
        required: true
    }
})

schema.virtual('rating').get(function () {
    return Rating.count({ item: this._id })
})

const Item = model('Item', schema)

module.exports = Item