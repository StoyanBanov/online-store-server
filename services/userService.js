const User = require("../models/User");

async function getUserById(id) {
    return User.findById(id).populate('address').populate('secondAddress')
}

module.exports = {
    getUserById
}