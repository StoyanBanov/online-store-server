const { getCartById, addToCart, emptyCart } = require('../services/shoppingCartService');
const { parseError } = require('../util/errorParsing');

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

shoppingCartController.delete('/:id', async (req, res) => {
    try {
        res.status(200).json(await emptyCart(req.params.id))
    } catch (error) {
        console.log(error);
        res.status(404).json(parseError(error))
    }
})

shoppingCartController.delete('/:cartId/:itemObjId', async (req, res) => {
    try {
        res.status(200).json(await emptyCart(req.params.cartId, req.params.itemObjId))
    } catch (error) {
        console.log(error);
        res.status(404).json(parseError(error))
    }
})

module.exports = shoppingCartController