const { hasAdmin, hasToken } = require('../middleware/guards')
const { createItem, getAllItems, getItemById, addUserRatingForItemId, getRating, editItemById, deleteItemById, getReviews, adReviewForItem } = require('../services/itemService')
const formParse = require('../middleware/formParse')
const { parseError } = require('../util/errorParsing')
const { addImages, delImages } = require('../util/images')

const itemController = require('express').Router()

itemController.get('/', async (req, res) => {
    try {
        res.status(200).json(await getAllItems(req.query))
    } catch (error) {
        console.log(error);
        res.status(404).json(parseError(error))
    }
})

itemController.get('/rating', async (req, res) => {
    try {
        res.status(200).json(await getRating(req.query))
    } catch (error) {
        console.log(error);
        res.status(404).json(parseError(error))
    }
})

itemController.get('/review', async (req, res) => {
    try {
        res.status(200).json(await getReviews(req.query))
    } catch (error) {
        console.log(error);
        res.status(404).json(parseError(error))
    }
})

itemController.get('/:id', async (req, res) => {
    try {
        const item = await getItemById(req.params.id)
        res.status(200).json({
            ...item._doc,
            totalRatingVotes: await item.totalRatingVotes
        })
    } catch (error) {
        console.log(error);
        res.status(404).json(parseError(error))
    }
})

itemController.post('/rating', hasToken(), async (req, res) => {
    try {
        res.status(200).json(await addUserRatingForItemId(req.body, req.user._id))
    } catch (error) {
        console.log(error);
        res.status(400).json(parseError(error))
    }
})

itemController.post('/review', hasToken(), async (req, res) => {
    try {
        res.status(200).json(await adReviewForItem(req.body, req.user._id))
    } catch (error) {
        console.log(error);
        res.status(400).json(parseError(error))
    }
})

itemController.post('/', formParse(), hasAdmin(), async (req, res) => {
    try {
        const itemData = { ...req.formBody }
        const thumbnailImg = req.formImages.thumbnail
        const imagesImg = req.formImages.images

        if (thumbnailImg)
            itemData.thumbnail = thumbnailImg.filename
        if (imagesImg) {
            if (Array.isArray(imagesImg))
                itemData.images = imagesImg.map(i => i.filename)
            else itemData.images = imagesImg.filename
        }

        const item = await createItem(itemData)

        addImages(req.formImages)

        res.status(200).json(item)
    } catch (error) {
        console.log(error);
        res.status(400).json(parseError(error))
    }
})

itemController.put('/:id', formParse(), hasAdmin(), async (req, res) => {
    try {
        const itemData = { ...req.formBody }
        const thumbnailImg = req.formImages.thumbnail
        const imagesImg = req.formImages.images

        let existingItem
        if (thumbnailImg) {
            itemData.thumbnail = thumbnailImg.filename
            existingItem = await getCategoryById(req.params.id)
        }
        if (imagesImg) {
            if (Array.isArray(imagesImg))
                itemData.images = imagesImg.map(i => i.filename)
            else itemData.images = [imagesImg.filename]
        }

        const item = await editItemById(req.params.id, itemData)

        addImages(req.formImages)

        if (existingItem?.thumbnail)
            delImages([existingCat.thumbnail])

        if (req.formBody.imagesToRemove)
            delImages(Array.isArray(req.formBody.imagesToRemove) ? req.formBody.imagesToRemove : [req.formBody.imagesToRemove])

        res.status(200).json(item)
    } catch (error) {
        console.log(error);
        res.status(400).json(parseError(error))
    }
})

itemController.delete('/:id', hasAdmin(), async (req, res) => {
    try {
        const item = await deleteItemById(req.params.id)

        if (item.thumbnail)
            item.images.push(item.thumbnail)
        delImages(item.images)

        res.status(200).json(item)
    } catch (error) {
        console.log(error);
        res.status(400).json(parseError(error))
    }
})

module.exports = itemController