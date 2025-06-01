const mongooose = require('mongoose')

const studentSchema = mongooose.Schema({

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
            type: String,
            required: true,
        },
        parentContacts:{
            type: [String],
            required: true
        },
})


const studnetModel = mongooose.model('students',studentSchema)

module.exports = studnetModel