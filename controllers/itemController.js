const { hasAdmin } = require('../middleware/guards')
const { createItem } = require('../services/itemService')

const itemController = require('express').Router()

itemController.post('/', /*hasAdmin(),*/ async (req, res) => {
    try {
        console.log(req.body);
        const item = await createItem({ ...req.body })
        res.status(200).json(item)
    } catch (error) {
        console.log(error);
        res.status(404).end()
    }
})

module.exports = itemController