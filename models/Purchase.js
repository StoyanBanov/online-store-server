const { Schema, model, Types: { ObjectId } } = require('mongoose')

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
    ],
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    paymentMethod: { type: String, required: true, enum: ['cash', 'card'] },
    deliverTo: { type: String, required: true, enum: ['office', 'address'] },
    address: { type: String, required: true },
    user: { type: ObjectId },
    phone: { type: String, required: true }
})

const Purchase = model('Purchase', schema)

module.exports = Purchase