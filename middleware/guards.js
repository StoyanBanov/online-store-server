const hasAdmin = () => (req, res, next) => {
    if (req.token && req.user.verified && req.user.roles.includes('admin')) {
        next()
    } else {
        res.status('401').end()
    }
}

const hasToken = () => (req, res, next) => {
    if (req.token && req.user.verified) {
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
    hasAdmin,
    hasToken,
    hasGuest
}