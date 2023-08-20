const { getUserById } = require('../services/userService')
const { parseError } = require('../util/errorParsing')

const userController = require('express').Router()

userController.get('/', async (req, res) => {
    try {
        res.status(200).json((await getUserById(req.user._id)))
    } catch (error) {
        res.status(404).json(parseError(error))
    }
})

module.exports = userController