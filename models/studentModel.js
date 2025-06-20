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