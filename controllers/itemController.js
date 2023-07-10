const { hasAdmin } = require('../middleware/guards')
const { createItem } = require('../services/itemService')
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

module.exports = itemController