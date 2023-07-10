const Item = require("../models/Item");

function getAllItems({ where, limit = 10, skip = 0 }) {
    return Item.find(where).limit(limit).skip(skip * limit)
}

function getItemById(id) {
    return Item.findById(id)
}

function createItem(data) {
    return Item.create(data)
}

async function editItemById(id, data) {
    const existingItem = await Item.findById(id)
    existingItem.title = data.title
    existingItem.category = data.category
    existingItem.price = data.price
    existingItem.description = data.description
    await existingItem.save()

    return existingItem
}

function deleteItemById(id) {
    return Item.findOneAndDelete({ _id: id })
}

module.exports = {
    getAllItems,
    getItemById,
    createItem,
    editItemById,
    deleteItemById
}