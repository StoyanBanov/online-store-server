const authController = require("../controllers/authController")
const itemController = require("../controllers/itemController")

module.exports = app => {
    app.use('/auth', authController)
    app.use('/item', itemController)
}