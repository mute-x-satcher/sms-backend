require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const userRoutes = require('./routes/userRoutes')
const dataRoutes = require('./routes/dataTrasnferRoute')
const classRoutes = require('./routes/classRoutes')
const studentRoutes = require('./routes/studentRoutes')
const attendanceRoutes = require('./routes/attendanceRoutes')

const {connectDB} = require('./db/db')
// const {getClient: startClient} = require('./whatsapp-web/client')

// console.log(startClient)

connectDB() // We are initiating a data-base connection
// startClient() //We are initiating a whatsapp client


app.use(cors({}))
app.use(express.json()) // This for parsing in json
app.use('/user',userRoutes)
app.use('/class',classRoutes)
app.use('/student',studentRoutes)
app.use('/attendance',attendanceRoutes)
app.use('/transfer-data',dataRoutes)

app.listen(process.env.PORT,'0.0.0.0',()=> console.log(`Server started on PORT: ${process.env.PORT}`))
