const Address = require("../models/Address");
const Purchase = require("../models/Purchase");
const User = require("../models/User");

async function getUserById(id) {
    return User.findById(id)
        .populate('address')
        .populate('secondAddress')
        .populate({
            path: 'purchases',
            populate: {
                path: 'items',
                populate: {
                    path: 'item'
                }
            }
        })
}

async function addUserAddress(userId, addressData) {
    const user = await User.findById(userId)

    if (user && (!user.address || !user.secondAddress)) {
        const address = await Address.create(addressData)

        if (!user.address) {
            user.address = address._id
        } else {
            user.secondAddress = address._id
        }
        await user.save()

        return address
    } else throw new Error('The user already has two addresses')
}

async function editUserAddress(id, data) {
    const address = await Address.findById(id)

    if (address) {
        Object.assign(address, data)
        await address.save()

        return address
    } else throw new Error('No such address')
}

async function addUserPurchase(userId, purchaseData) {
    const user = await User.findById(userId)

    if (user) {
        const purchase = await Purchase.create({ ...purchaseData, user: userId })

        user.purchases.push(purchase._id)
        await user.save()

        return purchase
    } else throw new Error('No such user')
}

module.exports = {
    getUserById,
    addUserAddress,
    editUserAddress,
    addUserPurchase
}