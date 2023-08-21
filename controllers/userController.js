const { getUserById, addUserAddress, editUserAddress } = require('../services/userService')
const { parseError } = require('../util/errorParsing')

const userController = require('express').Router()

userController.get('/', async (req, res) => {
    try {
        res.status(200).json((await getUserById(req.user._id)))
    } catch (error) {
        console.log(error);
        res.status(404).json(parseError(error))
    }
})

userController.post('/address', async (req, res) => {
    try {
        res.status(200).json((await addUserAddress(req.user._id, req.body)))
    } catch (error) {
        console.log(error);
        res.status(400).json(parseError(error))
    }
})

userController.put('/address/:id', async (req, res) => {
    try {
        res.status(200).json((await editUserAddress(req.params.id, req.body)))
    } catch (error) {
        console.log(error);
        res.status(400).json(parseError(error))
    }
})

module.exports = userController