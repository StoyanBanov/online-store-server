const { hasAdmin, hasToken } = require('../middleware/guards')
const { createItem, getAllItems, getItemById, addUserRatingForItemId, getRating, editItemById, deleteItemById } = require('../services/itemService')
const formParse = require('../middleware/formParse')
const { parseError } = require('../util/errorParsing')
const { addImages, delImages } = require('../util/images')

const itemController = require('express').Router()

itemController.get('/', async (req, res) => {
    try {
        let where
        if (req.query.where) {
            where = Object.fromEntries(req.query.where.split('&').map(q => q.split('=').map((a, i) => i == 1 ? a.substring(1, a.length - 1) : a)))
        }
        res.status(200).json(await getAllItems({ ...req.query, where }))
    } catch (error) {
        console.log(error);
        res.status(404).json(parseError(error))
    }
})

itemController.get('/rating', async (req, res) => {
    try {
        let where
        if (req.query.where) {
            where = Object.fromEntries(req.query.where.split('&').map(q => q.split('=').map((a, i) => i == 1 ? a.substring(1, a.length - 1) : a)))
        }
        res.status(200).json(await getRating({ ...req.query, where }))
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
            rating: await item.rating,
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

        if (thumbnailImg)
            itemData.thumbnail = thumbnailImg.filename
        if (imagesImg) {
            if (Array.isArray(imagesImg))
                itemData.images = imagesImg.map(i => i.filename)
            else itemData.images = imagesImg.filename
        }

        const item = await editItemById(req.params.id, itemData)

        addImages(req.formImages)

        res.status(200).json(item)
    } catch (error) {
        console.log(error);
        res.status(400).json(parseError(error))
    }
})

itemController.delete('/:id', hasAdmin(), async (req, res) => {
    try {
        const item = await deleteItemById(req.params.id)

        delImages([...item.images, item.thumbnail])

        res.status(200).json(item)
    } catch (error) {
        console.log(error);
        res.status(400).json(parseError(error))
    }
})

module.exports = itemController