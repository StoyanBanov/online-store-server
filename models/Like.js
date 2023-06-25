const { Schema, model, Types: { ObjectId } } = require('mongoose')

const schema = new Schema({
    review: {
        type: ObjectId,
        ref: 'Review',
        required: true
    },
    _creator: {
        type: ObjectId,
        ref: 'User',
        required: true
    }
})

const Like = model('Like', schema)

module.exports = Like