const formParse = require('../middleware/formParse');
const { hasAdmin } = require('../middleware/guards');
const { createCategory, getCategories, getCategoryById, editCategoryById } = require('../services/categoryService');
const { parseError } = require('../util/errorParsing');
const { addImages, delImages } = require('../util/images');

const categoryController = require('express').Router()

categoryController.get('/', async (req, res) => {
    try {
        res.status(200).json(await getCategories(req.query))
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
            catData.thumbnail = thumbnailImg.filename

        catData._creator = req.user._id
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

        let existingCat
        if (thumbnailImg) {
            catData.thumbnail = thumbnailImg.filename
            existingCat = await getCategoryById(req.params.id)
        }

        const cat = await editCategoryById(req.params.id, catData)

        if (existingCat?.thumbnail)
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