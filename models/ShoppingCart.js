const { Schema, model, Types: { ObjectId } } = require('mongoose')

const schema = new Schema({
    items: {
        type: [ObjectId],
        ref: 'Item',
        default: []
    }
})

schema.methods.getTotalPrice = function () {
    //TODO
};

const ShoppingCart = model('ShoppingCart', schema)

module.exports = ShoppingCart