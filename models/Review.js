const { Schema, model, Types: { ObjectId } } = require('mongoose');
const Like = require('./Like');

const schema = new Schema({
    text: {
        type: String,
        minLength: [10, 'Text must be at least 10 characters long'],
        maxLength: [2000, 'Text can\'t be more than 2000 characters long']
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

schema.virtual('likesCount').get(function () {
    return Like.count({ review: this._id })
})

const Review = model('Review', schema)

module.exports = Review