const express = require('express')
const router = express.Router()
const {verifyJwt} = require('../middleware/verifyJwt')
const {verifyRoles} = require('../middleware/verifyRoles')
const storageController = require('../controllers/storageController')
router.get('/', verifyJwt, verifyRoles('admin'), storageController.getAllItems)

module.exports = router
