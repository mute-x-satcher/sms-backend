const express = require('express')
const router = express.Router()
const {createClass,getClass,updateClass,deleteClass} = require('../controllers/classController')
const checkGroup = require('../middleware/classMiddleware')

router.post('/get',getClass)
router.post('/create',checkGroup,createClass)
router.put('/update',checkGroup,updateClass)
router.delete('/delete',deleteClass)


module.exports = router