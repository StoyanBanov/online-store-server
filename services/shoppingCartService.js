const Item = require("../models/Item")
const ShoppingCart = require("../models/ShoppingCart")

async function getCartById(id) {
    return ShoppingCart.findById(id).populate('items.item')
}

async function addToCart(cartId, { item, count }) {
    const [cart, itemToAdd] = await Promise.all([ShoppingCart.findById(cartId), Item.findById(item)])
    if (!cart) throw new Error('No such cart')
    if (!itemToAdd) throw new Error('No such item')
    if (itemToAdd.count < count) throw new Error('Not enough items for count of' + count)

    const itemAlreadyIn = cart.items.find(i => i.item._id === item)
    if (itemAlreadyIn)
        itemAlreadyIn.count = count
    else
        cart.items.push({ item, count })

    await cart.save()

    return cart
}

module.exports = {
    getCartById,
    addToCart
}