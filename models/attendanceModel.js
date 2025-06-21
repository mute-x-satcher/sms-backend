const mongoose = require('mongoose')


const attendanceSchema = mongoose.Schema({

            studentId:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'students',
                required: true
            },
            status:{
                type: String,
                required: true
            }

},{_id: false})


const attendanceReportSchema = mongoose.Schema({

        classId:{
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        reportDate:{
            type: String,
            required: true,
        },
        reportType:{
            type: String,
            default: 'Daily'
        },
        reportName:{
            type: String,
            default: 'Daily Attendance'
        },
        attendance:{
            type: [attendanceSchema],
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now     
        }
})

const attendanceModel = mongoose.model('attendance_reports',attendanceReportSchema)

module.exports = attendanceModel