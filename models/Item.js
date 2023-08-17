const { Schema, model, Types: { ObjectId }, default: mongoose } = require('mongoose')
const Rating = require('./Rating')
const Category = require('./Category')

const schema = new Schema({
    title: {
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
    count: {
        type: Number,
        required: [true, 'Count is required'],
        min: [0, 'Count can\'t be negative'],
        validate: {
            validator: value => Number.isInteger(value),
            message: 'Count must be an integer'
        }
    },
    thumbnail: {
        type: String,
        default: ''
    },
    images: {
        type: [String],
        default: []
    },
    category: {
        type: ObjectId,
        ref: 'Category',
        required: [true, 'Category is required'],
        validate: {
            validator: async catId => {
                return catId && !!(await mongoose.model('Category').findById(catId))
            },
            message: 'No category'
        }
    },
    rating: {
        type: Number,
        default: 0
    },
    _creator: {
        type: ObjectId,
        ref: 'User',
        required: true
    }
}, { strict: false })

schema.virtual('totalRatingVotes').get(function () {
    return Rating.count({ item: this._id })
})
const Item = model('Item', schema)

module.exports = Item