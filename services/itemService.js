const Category = require("../models/Category");
const Item = require("../models/Item");
const Rating = require("../models/Rating");

async function getAllItems({ where, limit = 10, skip = 0, search = '' }) {
    const searchRegex = new RegExp(search, 'i')
    return Item.find(where)
        .where({ $or: [{ title: { $regex: searchRegex } }, { description: { $regex: searchRegex } }] })
        .limit(limit)
        .skip(skip * limit)
}

async function getItemById(id) {
    const i = await Item.findById(id)
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

async function addUserRatingForItemId(data, userId) {
    const rating = await Rating.findOne({ _creator: userId, item: data.item })
    if (rating) {
        rating.rating = data.rating
        await rating.save()
        return rating
    }
    return Rating.create({ ...data, _creator: userId })
}

async function getRating({ where }) {
    return Rating.find(where)
}

module.exports = {
    getAllItems,
    getItemById,
    createItem,
    editItemById,
    deleteItemById,
    addUserRatingForItemId,
    getRating
}