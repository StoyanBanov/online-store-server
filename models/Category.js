const { Schema, model, Types: { ObjectId }, default: mongoose } = require('mongoose');
const Item = require('./Item');

const schema = new Schema({
    title: {
        type: String,
        required: true,
        minLength: [2, 'Category must be at least 2 characters long'],
        maxLength: [20, 'Category can\'t be more than 20 characters long']
    },
    parentCategory: {
        type: ObjectId,
        ref: 'Category',
        validate: {
            validator: async parentId => {
                const parentCat = await mongoose.model('Category').findById(parentId)
                return !!parentCat
            },
            message: 'No such category'
        }
    },
    childCategories: {
        type: [ObjectId],
        ref: 'Category'
    },
    items: {
        type: [ObjectId],
        ref: 'Item'
    },
    _creator: {
        type: ObjectId,
        ref: 'User',
        //required: true
    }
})

const Category = model('Category', schema)

module.exports = Category