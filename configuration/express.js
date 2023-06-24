const { json } = require("express")
const cors = require("../middleware/cors")

module.exports = app => {
    app.use(json())
    app.use(cors())
}