const authController = require("../controllers/authController")
const itemController = require("../controllers/itemController")
const categoryController = require("../controllers/categoryController")
const shoppingCartController = require("../controllers/shoppingCartController")
const userController = require("../controllers/userController")

module.exports = app => {
    app.use('/auth', authController)
    app.use('/item', itemController)
    app.use('/category', categoryController)
    app.use('/cart', shoppingCartController)
    app.use('/user', userController)
}