const express = require('express')
const router = express.Router()
const {verifyJwt} = require('../middleware/verifyJwt')
const {verifyRoles} = require('../middleware/verifyRoles')
const serviceController = require('../controllers/serviceController')
router.get(
  '/',
  verifyJwt,
  verifyRoles('admin'),
  serviceController.getAllServices
)

module.exports = router
