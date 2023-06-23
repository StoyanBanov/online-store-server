const { json, urlencoded } = require("express")

const expressConfig = app => {
    app.use(json())
    app.use(urlencoded({ extended: true }))
}

module.exports = expressConfig