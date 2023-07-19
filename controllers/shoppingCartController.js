const { getCartById, addToCart } = require('../services/shoppingCartService');

const shoppingCartController = require('express').Router()

shoppingCartController.get('/:id', async (req, res) => {
    try {
        const cart = await getCartById(req.params.id)
        res.status(200).json({ ...cart._doc, totalPrice: await cart.totalPrice })
    } catch (error) {
        console.log(error);
        res.status(404).json(parseError(error))
    }
})

shoppingCartController.post('/:id', async (req, res) => {
    try {
        res.status(200).json(await addToCart(req.params.id, req.body))
    } catch (error) {
        console.log(error);
        res.status(404).json(parseError(error))
    }
})

module.exports = shoppingCartController