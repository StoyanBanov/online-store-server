const Address = require("../models/Address");
const Item = require("../models/Item");
const Purchase = require("../models/Purchase");
const User = require("../models/User");
const { validatePurchaseItems } = require("../util/serviceUtil");

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

async function getAllPurchases({ where }) {
    let query = Purchase.find().populate({ path: 'items', populate: { path: 'item' } })
    if (where)
        query = query.where(where)
    return query
}

async function addPurchase(userId, purchaseData) {
    validatePurchaseItems(purchase)
    let items = await Item.find({ _id: { $in: purchase.items.map(i => i.item) } })

    for (let i = 0; i < items.length; i++) {
        if (items[i].count < purchaseData.items[i].count)
            throw new Error(`Item ${items[i].title} has only ${items[i].count} units available!`)
    }

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
        purchase = await Purchase.create({ ...purchaseData })
    }

    for (let i = 0; i < items.length; i++) {
        items[i].count -= purchase.items[i].count
    }

    await Promise.all(items.map(i => i.save()))

    return purchase
}

async function editPurchase(id, data) {
    const existingPurchase = await Purchase.findById(id)

    //todo item validation
    validatePurchaseItems(purchase)

    if (existingPurchase) {
        Object.assign(existingPurchase, data)

        await existingPurchase.save()

        return existingPurchase
    } else throw new Error('No such purchase')
}

module.exports = {
    getUserById,
    addUserAddress,
    editUserAddress,
    getAllPurchases,
    addPurchase,
    editPurchase
}