const { json } = require("express")
const cors = require("../middleware/cors")
const session = require("../middleware/session")

module.exports = app => {
    app.use(json())
    app.use(cors())
    app.use(session())
}