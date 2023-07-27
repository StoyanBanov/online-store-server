const formParse = require('../middleware/formParse');
const { hasAdmin } = require('../middleware/guards');
const { createCategory, getCategories, getCategoryById, editCategoryById } = require('../services/categoryService');
const { parseError } = require('../util/errorParsing');
const { addImages, delImages } = require('../util/images');

const categoryController = require('express').Router()

categoryController.get('/', async (req, res) => {
    try {
        let where
        if (req.query.where) {
            where = Object.fromEntries(req.query.where.split('&').map(q => q.split('=').map((a, i) => i == 1 ? JSON.parse(a) : a)))
        }
        res.status(200).json(await getCategories({ ...req.query, where }))
    } catch (error) {
        console.log(error);
        res.status(404).json(parseError(error))
    }
})

categoryController.get('/:id', async (req, res) => {
    try {
        res.status(200).json(await getCategoryById(req.params.id))
    } catch (error) {
        console.log(error);
        res.status(404).json(parseError(error))
    }
})

categoryController.post('/', formParse(), hasAdmin(), async (req, res) => {
    try {
        const catData = { ...req.formBody }
        const thumbnailImg = req.formImages.thumbnail
        if (thumbnailImg)
            itemData.thumbnail = thumbnailImg.filename

        const cat = await createCategory(catData)

        addImages(req.formImages)

        res.status(200).json(cat)
    } catch (error) {
        console.log(error);
        res.status(400).json(parseError(error))
    }
})

categoryController.put('/:id', formParse(), hasAdmin(), async (req, res) => {
    try {
        const catData = { ...req.formBody }
        const thumbnailImg = req.formImages.thumbnail

        let existingCat = await getCategoryById(req.params.id)

        if (thumbnailImg) {
            catData.thumbnail = thumbnailImg.filename
        }

        const cat = await editCategoryById(req.params.id, Object.assign(catData, { childCategories: existingCat.childCategories }))

        if (existingCat.thumbnail)
            delImages([existingCat.thumbnail])

        addImages(req.formImages)

        res.status(200).json(cat)
    } catch (error) {
        console.log(error);
        res.status(400).json(parseError(error))
    }
})

categoryController.delete('/:id', hasAdmin(), async (req, res) => {
    try {
        const cat = await createCategory(req.params.id)

        delImages([cat.thumbnail])

        res.status(200).json(cat)
    } catch (error) {
        console.log(error);
        res.status(400).json(parseError(error))
    }
})

module.exports = categoryController