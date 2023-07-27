const jwt = require("jsonwebtoken")
const { jwtSecret } = require("../globals")

module.exports = () => (req, res, next) => {
    const token = req.headers['authorization']
    if (token) {
        try {
            req.user = jwt.verify(token, jwtSecret)
            req.token = token
        } catch (error) {
            console.log(error);
            res.status(400).end()
            return
        }
    }
    next()
}