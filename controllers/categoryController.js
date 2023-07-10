const { hasAdmin } = require('../middleware/guards');
const { createCategory } = require('../services/categoryService');

const categoryController = require('express').Router()

categoryController.post('/', /*hasAdmin(),*/async (req, res) => {
    try {
        res.status(200).json(await createCategory(req.body))
        res.status(200).end()
    } catch (error) {
        console.log(error);
        res.status(404).end()
    }
})

module.exports = categoryController