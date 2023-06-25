const { Schema, model, Types: { ObjectId } } = require('mongoose');
const Like = require('./Like');

const schema = new Schema({
    text: {
        type: String,
        minLength: [20, 'Description must be at least 20 characters long'],
        maxLength: [2000, 'Description can\'t be more than 2000 characters long']
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