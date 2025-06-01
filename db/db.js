require('dotenv').config()
const mongoose = require('mongoose')

const connectDB = async() => {
    
    try {
        const MONGO_URI  = process.env.MONGO_URI
        await mongoose.connect(MONGO_URI)
        console.log(`MongoDB connected: ${MONGO_URI}`)

    } catch (error) {
        console.log(`MongoDB Connection Error: ${error}`)
    }


}


module.exports = {connectDB, mongoose};

