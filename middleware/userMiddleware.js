const userModel = require('../models/userModel')

const novalEmailMiddleware = async(req,res,next) => {

    try {

        const {email,password} = req.body 

        const emailExist = await userModel.findOne({email: email})
        const passwordExist = await userModel.findOne({password: password})

        if(emailExist) return res.status(409).json({msg: 'This email is already used'})
        if((passwordExist)) return res.status(409).json({msg: 'This password is already taken'})
        next()
    } catch (error) {
        console.log(`userMiddleware-novalMiddleware Error: ${error}`)
    }

}

module.exports = novalEmailMiddleware