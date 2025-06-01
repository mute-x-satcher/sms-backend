const {verifyToken} = require('../jwt/jwt')

const tokenMiddleware = async (req,res,next) => {


        const authToken = req.headers.authorization?.split(" ")[1]
        
        if(!authToken) return res.status(402).json({msg: 'Please provide a authToken'})

        const userInfo = verifyToken(authToken)

        if(!userInfo) return res.status(401).json({msg: 'Auth-Token is Invaild or Expired'})

        req.userInfo = userInfo

        next()
}

module.exports = tokenMiddleware