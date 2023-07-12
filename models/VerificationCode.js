const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
    user: { type: Types.ObjectId, required: true, ref: 'User' },
    code: { type: String, require: true, minLength: 4, maxLength: 4 }
})

const VerificationCode = model('VerificationCode', schema)

module.exports = VerificationCode