const hasToken = () => (req, res, next) => {
    if (req.token) {
        next()
    } else {
        res.status('401').end()
    }
}

const hasGuest = () => (req, res, next) => {
    if (req.token) {
        res.status('401').end()
    } else {
        next()
    }
}

module.exports = {
    hasToken,
    hasGuest
}