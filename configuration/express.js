const { json, urlencoded, static } = require("express")
const cors = require("../middleware/cors")
const session = require("../middleware/session")

module.exports = app => {
    app.use(json())
    app.use(cors())
    app.use(session())
    app.use('/static', static('static'))
    app.use(urlencoded({ extended: true }))
}