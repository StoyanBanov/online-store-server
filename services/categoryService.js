const Category = require("../models/Category")

function createCategory(data) {
    return Category.create(data)
}

module.exports = {
    createCategory
}