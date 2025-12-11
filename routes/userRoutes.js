const express = require('express')
const router = express.Router()
const {createUser,verifyUser,loginUser,protectedUser,fmcVerification} = require('../controllers/userController')
const tokenMiddleware = require('../middleware/tokenMiddleware')
const novalEmailMiddleware = require('../middleware/userMiddleware')

router.post('/create',novalEmailMiddleware,createUser)
router.post('/verify',verifyUser)
router.post('/login',loginUser)
router.post('/fmc',fmcVerification)
router.post('/protected',tokenMiddleware,protectedUser)


module.exports = router