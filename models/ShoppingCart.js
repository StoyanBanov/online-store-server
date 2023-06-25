const { Schema, model, Types: { ObjectId } } = require('mongoose')

const schema = new Schema({
    items: {
        type: [ObjectId],
        ref: 'Item',
        default: []
    }
})

schema.methods.getTotalPrice = function () {
    return this.items.reduce((total, current) => total + current, 0)
};

const ShoppingCart = model('ShoppingCart', schema)

module.exports = ShoppingCart