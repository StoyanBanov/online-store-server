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

async function getCategoryById(id) {
    return Category.findById(id).populate('childCategories')
}

async function createCategory(data) {
    const category = await Category.create(data)

    await updateParentCategory(category.parentCategory, category._id)

    return category
}

async function editCategoryById(id, data) {
    const category = await Category.findById(id)

    if (!category)
        throw new Error('no such category')

    Object.assign(category, data)
    await category.save()

    await updateParentCategory(category.parentCategory, category._id)

    return category
}

async function delCategoryById(id) {
    const category = await Category.findById(id)

    if (category.childCategories.length)
        throw new Error('Cannot delete category, because it has children')
    if (category.items.length)
        throw new Error('Cannot delete category, because it has items')

    await Category.findByIdAndDelete(id)

    await updateParentCategory(category.parentCategory, category._id, true)

    return category
}

async function updateParentCategory(parentId, childId, isDeleting) {
    let parentCat
    if (parentId && (parentCat = await Category.findById(parentId))) {
        if (!isDeleting) {
            parentCat.childCategories.push(childId)
        } else {
            parentCat.childCategories.splice(parentCat.childCategories.indexOf(parentCat.childCategories.find(c => c._id == childId)), 0)
        }
        await parentCat.save()
    }
}

module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    editCategoryById,
    delCategoryById
}