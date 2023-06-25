const Item = require("../models/Item");

function getAllItems() {
    return Item.find()
}

function getAllItemsForCategory(category) {
    return Item.find({ category })
}

function getItemById(id) {
    return Item.findById(id)
}

function createItem(data) {
    return Item.create(data)
}

async function editItemById(id, data) {
    const existingItem = await Item.findById(id)
    existingItem.name = data.name
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
    getAllItemsForCategory,
    getItemById,
    createItem,
    editItemById,
    deleteItemById
}