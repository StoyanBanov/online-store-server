module.exports = () => (req, res, next) => {
    if (req.query.where) {
        req.query.where = Object.fromEntries(req.query.where.split('&').map(q => q.split('=').map((a, i) => i == 1 ? JSON.parse(a) : a)))
    }
    if (req.query.sortBy) {
        req.query.sortBy = Object.fromEntries(req.query.sortBy.split('&').map(q => q.split('=').map((a, i) => i == 1 ? JSON.parse(a) : a)))
    }
    next()
}