const { Schema, model, Types: { ObjectId } } = require('mongoose')

const schema = new Schema({
    _creator: {
        type: ObjectId,
        ref: 'User',
        required: true
    }
})

const Like = model('Like', schema)

module.exports = Like