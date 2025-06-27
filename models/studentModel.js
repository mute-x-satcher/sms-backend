const mongoose = require('mongoose')

const studentSchema = mongoose.Schema({

        studentName:{
            type: String,
            required: true
        },
        rollNumber:{
            type: String,
            required: true
        },
        className:{
            type: String,
            required: true
        },
        absentCount:{
            type: Number,
            default: 0,
            min: 0
        },
        bunkCount:{
            type: Number,
            default: 0,
            min: 0
        },
         classId:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        parentContacts:{
            type: [String],
            required: true
        },
})


const studnetModel = mongoose.model('students',studentSchema)

module.exports = studnetModel