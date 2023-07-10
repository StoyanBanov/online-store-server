const authController = require("../controllers/authController")
const itemController = require("../controllers/itemController")
const categoryController = require("../controllers/categoryController")

module.exports = app => {
    app.use('/auth', authController)
    app.use('/item', itemController)
    app.use('/category', categoryController)
}