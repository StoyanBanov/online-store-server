const formParse = require('../middleware/formParse');
const { hasAdmin } = require('../middleware/guards');
const { createCategory, getCategories, getCategoryById } = require('../services/categoryService');
const { parseError } = require('../util/errorParsing');
const { addImages } = require('../util/images');

const categoryController = require('express').Router()

categoryController.get('/', async (req, res) => {
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

categoryController.get('/:id', async (req, res) => {
    try {
        console.log(await getCategoryById(req.params.id));
        res.status(200).json(await getCategoryById(req.params.id))
    } catch (error) {
        console.log(error);
        res.status(404).json(parseError(error))
    }
})

//categoryController.use(hasAdmin())

categoryController.use(formParse())

categoryController.post('/', async (req, res) => {
    try {
        const catData = { ...req.formBody }
        const thumbnailImg = req.formImages.thumbnail
        if (thumbnailImg)
            itemData.thumbnail = thumbnailImg.filename

        const cat = await createCategory(catData)

        res.status(200).json(cat)

        addImages(req.formImages)
    } catch (error) {
        console.log(error);
        res.status(400).json(parseError(error))
    }
})

categoryController.put('/', async (req, res) => {
    try {
        const catData = { ...req.formBody }
        const thumbnailImg = req.formImages.thumbnail
        if (thumbnailImg)
            itemData.thumbnail = thumbnailImg.filename

        const cat = await createCategory(catData)

        res.status(200).json(cat)

        addImages(req.formImages)
    } catch (error) {
        console.log(error);
        res.status(400).json(parseError(error))
    }
})

module.exports = categoryController