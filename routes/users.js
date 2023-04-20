
const express = require('express');
const router = express.Router();

const userController = require('../controllers/users_controller');
const { route } = require('.');

router.get('/profile', userController.profile);


module.exports = router;