const formParse = require('../middleware/formParse');
const { hasAdmin } = require('../middleware/guards');
const { createCategory, getCategories } = require('../services/categoryService');
const { parseError } = require('../util/errorParsing');

const categoryController = require('express').Router()

categoryController.post('/', /*hasAdmin(),*/ async (req, res) => {
    try {
        res.status(200).json(await createCategory(req.body))
    } catch (error) {
        console.log(error);
        res.status(400).json(parseError(error))
    }
})

categoryController.get('/', /*hasAdmin(),*/async (req, res) => {
    try {
        let where
        if (req.query.where) {
            where = Object.fromEntries(req.query.where.split('&').map(q => q.split('=').map((a, i) => i == 1 ? a.substring(1, a.length - 1) : a)))
        }
        res.status(200).json(await getCategories({ ...req.query, where }))
    } catch (error) {
        console.log(error);
        res.status(404).json(parseError(error))
    }
})

module.exports = categoryController