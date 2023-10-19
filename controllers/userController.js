const { getUserById, addUserAddress, editUserAddress, addPurchase, getAllPurchases, editPurchase } = require('../services/userService')
const { parseError } = require('../util/errorParsing')

const userController = require('express').Router()

userController.get('/', async (req, res) => {
    try {
        res.status(201).json((await getUserById(req.user._id)))
    } catch (error) {
        console.log(error);
        res.status(404).json(parseError(error))
    }
})

userController.post('/address', async (req, res) => {
    try {
        res.status(201).json((await addUserAddress(req.user._id, req.body)))
    } catch (error) {
        console.log(error);
        res.status(400).json(parseError(error))
    }
})

userController.put('/address/:id', async (req, res) => {
    try {
        res.status(201).json((await editUserAddress(req.params.id, req.body)))
    } catch (error) {
        console.log(error);
        res.status(400).json(parseError(error))
    }
})

userController.get('/purchase', async (req, res) => {
    try {
        if (req.user?.roles.includes('admin'))
            res.status(200).json((await getAllPurchases(req.query)))
        else throw new Error('Admin permissions mandatory for this request')
    } catch (error) {
        console.log(error);
        res.status(400).json(parseError(error))
    }
})

userController.post('/purchase', async (req, res) => {
    try {
        res.status(201).json((await addPurchase(req.user?._id, req.body)))
    } catch (error) {
        console.log(error);
        res.status(400).json(parseError(error))
    }
})

userController.put('/purchase/:id', async (req, res) => {
    try {
        res.status(200).json((await editPurchase(req.params.id, req.body)))
    } catch (error) {
        console.log(error);
        res.status(400).json(parseError(error))
    }
})

module.exports = userController