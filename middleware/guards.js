const hasAdmin = () => (req, res, next) => {
    if (req.token && req.user.verified && req.user.roles.includes('admin')) {
        next()
    } else {
        res.status(401).json({ message: 'unauthorized' })
    }
}

const hasToken = () => (req, res, next) => {
    console.log(req.user, req.token);
    if (req.token && req.user.verified) {
        next()
    } else {
        res.status(401).json({ message: 'unauthorized' })
    }
}

const hasGuest = () => (req, res, next) => {
    if (req.token) {
        res.status(401).json({ message: 'unauthorized' })
    } else {
        next()
    }
}

module.exports = {
    hasAdmin,
    hasToken,
    hasGuest
}