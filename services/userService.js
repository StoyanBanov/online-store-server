const Address = require("../models/Address");
const Purchase = require("../models/Purchase");
const ShoppingCart = require("../models/ShoppingCart");
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
    let purchase
    if (userId) {
        const user = await User.findById(userId).populate('shoppingCart')
        if (user && user.shoppingCart.items.length) {
            purchase = await Purchase.create({ ...purchaseData, user: userId })

            user.purchases.push(purchase._id)
            await user.save()
        } else
            throw new Error('No such user or no products in cart')
    } else {
        purchase = await Purchase.create({ ...purchaseData, user: userId })
    }

    return purchase
}

module.exports = {
    getUserById,
    addUserAddress,
    editUserAddress,
    addUserPurchase
}