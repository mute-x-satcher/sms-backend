const express = require('express')
const router = express.Router()
const {createClass,getClass,updateClass,deleteClass} = require('../controllers/classController')
const checkGroup = require('../middleware/classMiddleware')
const whatsappClientMiddleware = require('../middleware/whatsappClientMiddlware')

router.post('/get',getClass)
router.post('/create',whatsappClientMiddleware,checkGroup,createClass)
router.put('/update',whatsappClientMiddleware,checkGroup,updateClass)
router.delete('/delete',deleteClass)


module.exports = router