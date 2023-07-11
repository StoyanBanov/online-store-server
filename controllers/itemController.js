const { hasAdmin } = require('../middleware/guards')
const { createItem, getAllItems } = require('../services/itemService')
const formParse = require('../middleware/formParse')

const fs = require('fs').promises

const itemController = require('express').Router()

itemController.post('/', /*hasAdmin(),*/formParse(), async (req, res) => {
    try {
        const itemData = { ...req.formBody }
        if (req.formImages.thumbnail)
            itemData.thumbnail = req.formImages.thumbnail.filename
        if (req.formImages.images)
            itemData.images = req.formImages.images.map(i => i.filename)

        const item = await createItem(itemData)

        Object.entries(req.formImages).forEach(async ([key, i]) => {
            if (key === 'thumbnail')
                await fs.writeFile(`./static/images/${i.filename}`, i.image)
            else
                Promise.all(i.map(a => fs.writeFile(`./static/images/${a.filename}`, a.image)))
        })

        res.status(200).json(item)
    } catch (error) {
        console.log(error);
        res.status(404).end()
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
        res.status(404).end()
    }
})

module.exports = itemController