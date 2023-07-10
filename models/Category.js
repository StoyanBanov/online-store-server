const { Schema, model, Types: { ObjectId } } = require('mongoose')

const schema = new Schema({
    title: {
        type: String,
        minLength: [2, 'Category must be at least 2 characters long'],
        maxLength: [20, 'Category can\'t be more than 20 characters long']
    },
    parentCategory: {
        type: ObjectId,
        ref: 'Category'
    },
    _creator: {
        type: ObjectId,
        ref: 'User',
        //required: true
    }
})

const Category = model('Category', schema)

module.exports = Category