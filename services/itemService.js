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
    return await Item.findById(id)
}

async function createItem(data) {
    const item = await Item.create(data)

    await updateCategory(item.category, item._id)

    return item
}

async function editItemById(id, data) {
    const existingItem = await Item.findById(id)
    existingItem.title = data.title
    existingItem.category = data.category
    existingItem.price = data.price
    existingItem.description = data.description
    await existingItem.save()

    await updateCategory(existingItem.category, existingItem._id)

    return existingItem
}

async function deleteItemById(id) {
    const item = await Item.findOneAndDelete({ _id: id })

    await updateCategory(item.category, item._id, true)

    return item
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

async function updateCategory(catId, itemId, isDeleting) {
    const cat = await Category.findById(catId)
    if (cat) {
        if (!isDeleting) {
            cat.items.push(itemId)
        } else {
            cat.items.splice(cat.items.findIndex(cat.items.find(i => i._id == itemId)), 0)
        }
        await cat.save()
    }
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