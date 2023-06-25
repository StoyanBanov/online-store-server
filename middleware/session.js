const jwt = require("jsonwebtoken")
const { jwtSecret } = require("../globals")

module.exports = () => (req, res, next) => {
    const token = req.headers['Authorization']
    if (token) {
        try {
            req.user = jwt.verify(token, jwtSecret)
            req.token = user.accessToken
        } catch (error) {
            res.status(400).end()
        }
    }
    next()
}