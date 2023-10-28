const Item = require("../models/Item")

async function validatePurchaseItems(purchase) {
    let items = await Item.find({ _id: { $in: purchase.items.map(i => i.item) } })
    if (items.length != purchase.items.length)
        throw new Error('Incorrect item data')
}

async function validateItemsCount(items, purchase) {
    for (let i = 0; i < items.length; i++) {
        if (items[i].count < purchase.items[i].count)
            throw new Error(`Item ${items[i].title} has only ${items[i].count} units available!`)
    }
}

module.exports = {
    validatePurchaseItems,
    validateItemsCount
}