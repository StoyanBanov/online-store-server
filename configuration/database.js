const mongoose = require("mongoose");

const dbConn = 'mongodb://localhost:27017/online-store'

const databaseConfig = async app => {
    try {
        await mongoose.connect(dbConn, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
        console.log('Database connected');
    } catch (error) {
        console.log('Error initializing database');
        console.error(error.message)
        process.exit(1)
    }
}

module.exports = databaseConfig