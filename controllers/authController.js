const { body, validationResult } = require('express-validator')
const { hasGuest } = require('../middleware/guards')
const { passwordRegex } = require('../globals')
const { register, login, verify } = require('../services/authService')

const authController = require('express').Router()

authController.post('/register',
    hasGuest(),
    body(['fname', 'lname', 'password', 'repeat-password', 'email', 'phone']).trim(),
    body(['fname', 'lname', 'password', 'repeat-password', 'email']).isLength({ min: 1 }).withMessage('Required fields are missing'),
    body('email').isEmail().withMessage('Invalid email'),
    body(['fname', 'lname']).isAlpha().withMessage('The names must contain english letters only'),
    body('password').matches(passwordRegex).withMessage('The password is not safe enough!')
        .isLength({ min: 10, max: 30 }).withMessage('The password must be between 10 and 30 characters!'),
    body('repeat-password').custom((value, { req }) => value == req.body.password).withMessage('The passwords are not the same!'),
    async (req, res) => {
        const { errors } = validationResult(req)
        if (errors.length > 0) throw errors
        try {
            const user = await register(req.body)
            res.status(201).json(user)
        } catch (error) {
            console.log(error);
            //TODO parsing
            res.status(400).json({ message: error.message })
        }
    })

authController.post('/login',
    hasGuest(),
    body(['password', 'email']).trim(),
    body(['password', 'email']).isLength({ min: 1 }).withMessage("Wrong username or password"),
    async (req, res) => {
        const { errors } = validationResult
        if (errors) throw errors
        try {
            const user = await login(req.body)
            res.status(201).json(user)
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    })

authController.post('/verify', async (req, res) => {
    try {
        const user = await verify(req.body)
        res.status(201).json(user)
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message })
    }
})

module.exports = authController