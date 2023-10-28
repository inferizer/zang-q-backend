const express = require('express')
const authController = require('../controllers/auth-controller')

const router = express.Router()

router.post('/register/user', authController.userRegister)
router.post('/register/vendorAdmin', authController.vendorAdminRegister)
router.post('/login', authController.login)

module.exports = router