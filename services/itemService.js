const Category = require("../models/Category");
const Item = require("../models/Item");
const Like = require("../models/Like");
const Rating = require("../models/Rating");
const Review = require("../models/Review");

async function getAllItems({ where, limit, skip = 0, search = '', count, sortBy, minPrice, maxPrice }) {
    const searchRegex = new RegExp(search, 'i')
    const query = Item.find()
        .where({ title: { $regex: searchRegex } })

    if (where) {
        for (const [key, value] of Object.entries(where)) {
            if (Array.isArray(value))
                query = query.where({ [key]: { $in: value } })
            else
                query = query.where({ [key]: value })
        }
    }

    if (sortBy)
        query = query.sort({ ...sortBy, _id: -1 })

    if (limit)
        query = query.limit(limit).skip(skip * limit)

    if (minPrice || maxPrice)
        query = query.where({ price: { $gte: minPrice ?? 0, $lte: maxPrice || Number.MAX_SAFE_INTEGER } })

    query = query.populate('category')

    return count ? query.count() : query
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

    const itemCategory = await Category.findById(existingItem.category)

    for (const key in itemCategory.itemFields) {
        existingItem.set(key, data[key], { strict: false })
    }

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

    const item = await Item.findById(data.item)

    if (item) {
        let rating = await Rating.findOne({ _creator: userId, item: data.item })
        if (rating) {
            rating.rating = data.rating
            await rating.save()
        } else {
            rating = await Rating.create({ ...data, _creator: userId })
        }

        const ratings = await Rating.find({ item: data.item })
        item.rating = (ratings.reduce((rating, curRate) => rating + curRate.rating, 0) / ratings.length) || 0
        item.save()

        return rating
    } else throw new Error('No such item')
}

async function getRating({ where }) {
    return Rating.find(where)
}

//review

async function getReviews({ where, limit, skip = 0, count }) {
    const query = Review.find(where).limit(limit).skip(skip * limit).populate('_creator').populate('likes').sort({ _id: -1 })

    return count ? query.count() : query
}

async function adReviewForItem(data, userId) {
    return Review.create({ ...data, _creator: userId })
}

async function addLikeForReview({ reviewId }, userId) {
    const review = await Review.findById(reviewId).populate('likes')
    if (review) {
        if (review.likes.some(l => l._creator === userId))
            throw new Error('You already liked this review')

        const like = await Like.create({ _creator: userId })

        review.likes.push(like._id)
        await review.save()

        return like
    } else throw new Error('No such review')
}

async function removeLikeForReview({ reviewId }, userId) {
    const review = await Review.findById(reviewId).populate('likes')
    if (review) {
        const likeId = review.likes.splice(review.likes.findIndex(l => l._creator === userId), 1)[0]._id

        const like = await Like.findByIdAndRemove(likeId)

        await review.save()

        return like
    } else throw new Error('No such review')
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
    adReviewForItem,
    addLikeForReview,
    removeLikeForReview
}