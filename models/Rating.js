const { Schema, model, Types: { ObjectId } } = require('mongoose')

const schema = new Schema({
    rating: {
        type: Number,
        min: [0, 'Rating can\'t be negative'],
        max: [10, 'Rating can\'t exceed 5'],
        default: 0
    },
    item: {
        type: ObjectId,
        ref: 'Item',
        required: true
    },
    _creator: {
        type: ObjectId,
        ref: 'User',
        required: true
    }
})

const Rating = model('Rating', schema)

module.exports = Rating