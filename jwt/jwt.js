require('dotenv').config()
const jwt = require('jsonwebtoken')

const generateToken = (email) => {

    const payload = {
        userEmail: email
    }

    const secretKey = process.env.JWT_SECRET

    const token = jwt.sign(payload,secretKey,{expiresIn: '200d'})

    return token

}

const verifyToken = (token) =>{

    const secretKey = process.env.JWT_SECRET


    try {
        const decoded = jwt.verify(token,secretKey)

        // console.log(decoded)

        return decoded;
    } catch (error) {
        console.log(`JWT-verifyToken Error: ${error}`)
    }   

}


module.exports = {generateToken,verifyToken}