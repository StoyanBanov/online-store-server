const Category = require("../models/Category");
const Item = require("../models/Item");

async function getAllItems({ where, limit = 10, skip = 0, search = '' }) {
    const searchRegex = new RegExp(search, 'i')
    return Item.find(where)
        .where({ $or: [{ title: { $regex: searchRegex } }, { description: { $regex: searchRegex } }] })
        .limit(limit)
        .skip(skip * limit)
}

async function getItemById(id) {
    return Item.findById(id)
}

async function createItem(data) {
    const cat = await Category.findById(data.category)
    if (cat) {
        const item = await Item.create(data)

        cat.items.push(item._id)
        await cat.save()

        return item
    } else throw new Error("No category")
}

async function editItemById(id, data) {//TODO debug
    const existingItem = await Item.findById(id)
    existingItem.title = data.title
    existingItem.category = data.category
    existingItem.price = data.price
    existingItem.description = data.description
    await existingItem.save()

    return existingItem
}

async function deleteItemById(id) {
    return Item.findOneAndDelete({ _id: id })
}

module.exports = {
    getAllItems,
    getItemById,
    createItem,
    editItemById,
    deleteItemById
}