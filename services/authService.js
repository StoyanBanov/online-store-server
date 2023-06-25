const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')

const { jwtSecret, bcryptHashRounds } = require("../globals");

const User = require("../models/User");
const ShoppingCart = require("../models/ShoppingCart");

async function register(data) {
    const newUser = await User.create({ ...data, password: await bcrypt.hash(data.password, bcryptHashRounds) })
    newUser.shoppingCart = (await ShoppingCart.create())._id
    await newUser.save()
    return { ...newUser, accessToken: createToken(newUser) }
}

async function login({ email, password }) {
    const existingUser = await User.findOne({ email })
    if (existingUser && await bcrypt.compare(password, existingUser.password)) {
        return { ...existingUser, accessToken: createToken(newUser) }
    } else {
        throw new Error('Wrong username or password')
    }
}

function createToken({ _id, verified, fname, shoppingCart }) {
    return jwt.sign({ _id, verified, fname, shoppingCart }, jwtSecret)
}

module.exports = {
    register,
    login
}