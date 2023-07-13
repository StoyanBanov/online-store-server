const { hasAdmin } = require('../middleware/guards')
const { createItem, getAllItems } = require('../services/itemService')
const formParse = require('../middleware/formParse')
const { parseError } = require('../util/errorParsing')

const fs = require('fs').promises

const itemController = require('express').Router()

itemController.post('/', /*hasAdmin(),*/formParse(), async (req, res) => {
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

        Object.values(req.formImages).forEach(async (i) => {
            if (Array.isArray(i))
                await Promise.all(i.map(a => fs.writeFile(`./static/images/${a.filename}`, a.image)))
            else
                await fs.writeFile(`./static/images/${i.filename}`, i.image)
        })

        res.status(200).json(item)
    } catch (error) {
        console.log(error);
        res.status(400).json(parseError(error))
    }
})

itemController.get('/', /*hasAdmin(),*/ async (req, res) => {
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

module.exports = itemController