const express = require('express')
const router = express.Router()
const {verifyJwt} = require('../middleware/verifyJwt')
const {verifyRoles} = require('../middleware/verifyRoles')
const orderController = require('../controllers/orderController')
router.get('/', verifyJwt, verifyRoles('admin'), orderController.getAllOrders)

module.exports = router
