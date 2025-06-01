const mongoose = require('mongoose')

const userSchema = mongoose.Schema({

            fullName:{
                type: String,
                required: true
            },
            email:{
                type: String,
                required: true,
                unique: true
            },
            password:{
                type: String,
                required: true,
                unique: true
            },
            organizationName:{
                type: String,
                required: true,
            },
            organizationCategory:{      
                type: String,
                required: true
            },
            verificationCode:{
                type: String,
                required: true
            },
            userVerified:{
                type: Boolean,
                required: true,
                default: false
            }

})


const userModel = mongoose.model('users',userSchema)

module.exports = userModel
