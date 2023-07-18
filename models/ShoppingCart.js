const { Schema, model, Types: { ObjectId } } = require('mongoose')

const schema = new Schema({
    items: [
        new Schema({
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
        })
    ]
})

schema.methods.getTotalPrice = function () {
    //TODO
};

const ShoppingCart = model('ShoppingCart', schema)

module.exports = ShoppingCart