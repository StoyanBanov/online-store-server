const formParse = require('../middleware/formParse');
const { hasAdmin } = require('../middleware/guards');
const { createCategory, getCategories } = require('../services/categoryService');

const categoryController = require('express').Router()

categoryController.post('/', /*hasAdmin(),*/formParse(), async (req, res) => {
    try {
        res.status(200).json(await createCategory(req.formBody))
    } catch (error) {
        console.log(error);
        res.status(404).end()
    }
})

categoryController.get('/', /*hasAdmin(),*/async (req, res) => {
    try {
        let where
        if (req.query.where) {
            where = Object.fromEntries(req.query.where.split('&').map(q => q.split('=').map((a, i) => i == 1 ? a.substring(1, a.length - 1) : a)))
        }
        res.status(200).json(await getCategories(where))
    } catch (error) {
        console.log(error);
        res.status(404).end()
    }
})

module.exports = categoryController