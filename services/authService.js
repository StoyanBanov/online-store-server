const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')

const { sendConfirmationEmail } = require('../util/emailVerification')

const { jwtSecret, bcryptHashRounds } = require("../globals");

const User = require("../models/User");
const ShoppingCart = require("../models/ShoppingCart");
const VerificationCode = require("../models/VerificationCode");

async function register(data) {
    const newUser = await User.create({ ...data, password: await bcrypt.hash(data.password, bcryptHashRounds) })
    newUser.shoppingCart = (await ShoppingCart.create({}))._id
    await newUser.save()

    await VerificationCode.create({ user: newUser._id, code: await sendConfirmationEmail(newUser) })

    return await extractUser(newUser)
}

async function login({ email, password }) {
    const existingUser = await User.findOne({ email })
    if (existingUser && await bcrypt.compare(password, existingUser.password)) {
        return await extractUser(existingUser)
    } else {
        throw new Error('Wrong username or password')
    }
}

async function verify({ userId, code }) {
    const existingUser = await User.findById(userId)
    if (existingUser) {
        const verificationCode = await VerificationCode.findOne({ user: userId })
        if (verificationCode.code == code) await VerificationCode.findByIdAndDelete(verificationCode._id)

        return await extractUser(existingUser)
    } else throw new Error('No such user')
}

async function extractUser(userDoc) {
    const verificationCode = await VerificationCode.findOne({ user: userDoc._id })

    return {
        accessToken: createToken(userDoc),
        verified: verificationCode == null,
        _id: userDoc._id,
        email: userDoc.email,
        shoppingCart: userDoc.shoppingCart,
        roles: userDoc.roles
    }
}

function createToken({ _id, verified, fname, shoppingCart }) {
    return jwt.sign({ _id, verified, fname, shoppingCart }, jwtSecret)
}

module.exports = {
    register,
    login,
    verify
}