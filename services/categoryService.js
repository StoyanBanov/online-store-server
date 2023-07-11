const Category = require("../models/Category")

async function getCategories({ where, orderBy, asc = 1, limit, skip = 0 }) {
    if (where && where.hasOwnProperty('childrenCount')) {
        delete where.childrenCount

        return Category.find({
            $where: function () {
                return this.childCategories.length == 0
            }
        }).where(where).sort({ [orderBy]: Number(asc) }).skip(skip * limit).limit(limit)
    }

    return Category.find(where).sort({ [orderBy]: Number(asc) }).skip(skip * limit).limit(limit)
}

async function createCategory(data) {
    let parentCat
    if (data.parentCategory && (parentCat = await Category.findById(data.parentCategory))) {
        const category = await Category.create(data)

        parentCat.childCategories.push(category._id)
        await parentCat.save()

        return category
    }
    return Category.create(data)
}

module.exports = {
    getCategories,
    createCategory
}