const userModel = require('../models/userModel')
const {generateToken} = require('../jwt/jwt')
const {sendEmail} = require('../nodemailer/nodemail')

const createUser = async (req,res) =>  {

    try {
        
    const {fullName,email,password,organizationName,organizationCategory} = req.body

   

    if(!fullName || !email || !password || !organizationName || !organizationCategory){
        return res.status(400).json({msg: 'Please provide all fields'})
    }

    const max = 999999 
    const min = 100000

    const verificationcode = Math.round(Math.random() * (max - min + 1) + min) 

    const userInfo = await userModel.create({
            fullName: fullName,
            email: email,
            password: password,
            organizationName: organizationName,
            organizationCategory: organizationCategory,
            verificationCode: verificationcode
    })

    // console.log(userInfo)

    await sendEmail(userInfo.email,verificationcode,organizationCategory)

    return res.status(200).json({msg: 'User successfuly created', userInfo: userInfo})

    } catch (error) {
        console.log(`userController-createUser Error: ${error}`)
    }

}

const verifyUser = async (req,res) => {

    try {
        
        const {email,verificationCode} = req.body


        if(!email || !verificationCode){
            return res.status(400).json({msg: "Please provide all fields"})
        }


            const user =  await userModel.updateOne({$and:[{email: email},{verificationCode: verificationCode}]},{$set:{ userVerified: true}})
            
            if(user.matchedCount == 1){
                await userModel.updateOne({email: email},{$unset: {verificationCode: ""}})
                const token = generateToken(email)
                return  res.status(200).json({msg: 'User successfuly verified',authToken: token,userInfo: user})
            }else{
                return res.status(400).json({msg: 'Invalid verification code'})
            }


    } catch (error) {
        console.log(`userController-verifyUser Error: ${error}`)
    }

}

const loginUser = async (req,res) => {


    try {
        
        const {email,password} = req.body 

        if(!email || !password) return res.status(400).json({msg: 'Please provide all fields'})

        const user = await userModel.findOne({email: email})

        if(user?.userVerified == false) return res.status(404).json({msg: 'User is not verified'})

        if(user && user.password === password){
            const token = generateToken(user.email)
            return res.status(200).json({msg: 'Login successful', userInfo: user,authToken: token})
        }else{
            return res.status(400).json({msg: 'Invaild email or password'})
        }

    } catch (error) {
        console.log(`userController-loginUser Error: ${error}`)
    }

}

const protectedUser = async (req,res) => {
    const {userEmail: email} = req.userInfo

    const user = await userModel.findOne({email: email})

    if(user){
        return res.status(200).json({msg: 'Login successfull with Auth-Token', userInfo: user})
    }else{
        return res.status(401).json({msg: 'This token is not valid for any user'})
    }

}



module.exports = {createUser,verifyUser,loginUser,protectedUser}