const attendanceModel = require('../models/attendanceModel')
const formattedDate = require('../date_and_time/formatedDate')
const createAttendanceMiddleware = async(req,res,next) => {

    try {
    
        // const {classId} = req.body
    
        // const date = formattedDate()

        // const isExist = await attendanceModel.find({classId: classId,reportDate: date})
        // console.log(isExist)

        // if(isExist.length > 0) return res.status(409).json({msg: "Today's attendace already exist you can update or delete"})

        next()


    } catch (error) {
        console.log(`attendanceMiddleware-createAttendanceMiddleware Error: ${error}`)
    }

}

module.exports = {createAttendanceMiddleware}