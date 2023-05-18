const express = require('express');

const router = express.Router();

router.use('/v2_posts', require('./v2_posts'));

module.exports = router;