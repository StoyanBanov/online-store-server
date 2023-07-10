const { json, urlencoded } = require("express")
const cors = require("../middleware/cors")
const session = require("../middleware/session")

module.exports = app => {
    app.use(json())
    app.use(cors())
    app.use(session())
    app.use(urlencoded({ extended: true }))
}