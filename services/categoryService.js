const Category = require("../models/Category")

async function getCategories(where) {
    let categories
    if (where.hasOwnProperty('childrenCount')) {
        delete where.childrenCount
        categories = await Category.find({
            $where: function () {
                return this.childCategories.length == 0
            }
        }).where(where)
        return categories
    }
    return Category.find(where)
}

async function createCategory(data) {
    return Category.create(data)
}

module.exports = {
    getCategories,
    createCategory
}