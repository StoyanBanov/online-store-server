const { Schema, model, Types: { ObjectId }, default: mongoose } = require('mongoose')

const schema = new Schema({
    items: [
        {
            item: {
                type: ObjectId,
                ref: 'Item',
                required: true
            },
            count: {
                type: Number,
                required: true,
                min: [0, 'Count can\'t be negative'],
                validate: {
                    validator: value => Number.isInteger(value),
                    message: 'Count must be an integer'
                }
            },
        }
    ]
})

schema.virtual('totalPrice').get(async function () {
    const cart = await mongoose.model('ShoppingCart').findById(this._id).populate('items.item')
    return cart.items.reduce((total, itemObj) => total + itemObj.item.price * itemObj.count, 0)
})

const ShoppingCart = model('ShoppingCart', schema)

module.exports = ShoppingCart