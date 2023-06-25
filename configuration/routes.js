const authController = require("../controllers/authController")

module.exports = app => {
    app.use('/auth', authController)
}