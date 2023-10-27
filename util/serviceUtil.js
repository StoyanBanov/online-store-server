const Item = require("../models/Item")

async function validatePurchaseItems(purchase) {
    let items = await Item.find({ _id: { $in: purchase.items.map(i => i.item) } })
    if (items.length != purchase.items.length)
        throw new Error('Incorrect item data')
}

module.exports = {
    validatePurchaseItems
}