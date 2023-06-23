const databaseConfig = require('./configuration/database')
const expressConfig = require('./configuration/express')
const routesConfig = require('./configuration/routes')

const app = require('express')()
const port = 3030

start()

async function start() {
    await databaseConfig(app)
    expressConfig(app)
    routesConfig(app)

    app.listen(process.env.PORT || port, () => console.log('listening at ' + port))
}