const { default: mongoose } = require('mongoose')
const mognoose = require('mongoose')


const attendanceSchema = mongoose.Schema({

            studentName:{
                type: String,
                required: true,
            },
            rollNumber:{
                type: String,
                required: true
            },
            status:{
                type: String,
                required: true
            }

},{_id: false})


const attendanceReportSchema = mognoose.Schema({

        classId:{
            type: String,
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
        pdfURL:{
            type: String,
            required: true
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