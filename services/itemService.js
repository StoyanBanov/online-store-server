const Category = require("../models/Category");
const Item = require("../models/Item");
const Rating = require("../models/Rating");
const Review = require("../models/Review");

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
    const item = await Item.create(data)
    await updateCategory(item.category, item._id)

    return item
}

async function editItemById(id, data) {
    const existingItem = await Item.findById(id)

    if (!existingItem) throw new Error('No such item')

    const isNewCategory = existingItem.category.toString() != data.category
    const oldCategory = existingItem.category

    if (!data.images) data.images = []

    Object.assign(existingItem,
        data,
        {
            images: existingItem.images
                .filter(i => !data.imageNamesToRemove?.includes(i))
                .concat(...data.images)
        }
    )

    await existingItem.save()

    await updateCategory(existingItem.category, existingItem._id)
    await updateCategory(oldCategory, existingItem._id, isNewCategory)

    return existingItem
}

async function deleteItemById(id) {
    const item = await Item.findOneAndDelete({ _id: id })

    await updateCategory(item.category, item._id, true)

    return item
}

//rating

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

//review

async function getReviews({ where }) {
    return Review.find(where).populate('_creator')
}

async function adReviewForItem(data, userId) {
    return Review.create({ ...data, _creator: userId })
}


async function updateCategory(catId, itemId, isDeleting) {
    const cat = await Category.findById(catId)
    if (cat) {
        if (!isDeleting && !cat.items.find(i => i.toString() == itemId.toString())) {
            cat.items.push(itemId)
        } else if (isDeleting) {
            cat.items.splice(cat.items.findIndex(i => i.toString() == itemId.toString()), 1)
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
    getRating,
    getReviews,
    adReviewForItem
}