const mongoose = require('mongoose')

const classSchema = mongoose.Schema({

        className:{
            type: String,
            required: true
        },
        standard:{
            type: String,
            required: true
        },
        groupName:{
            type: String,
            required: true
        },
        groupId:{
            type: String,
            required: true
        },
        accountId:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        }
})

const classModel = mongoose.model('classes',classSchema)

module.exports = classModel