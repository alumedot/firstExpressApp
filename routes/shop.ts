import path = require('path');

import express = require('express');

const rootDir = require('../util/path');

const router = express.Router();

router.get('/', (req, res, next) => {
  console.log('__dirname', __dirname);
  res.sendFile(path.join(rootDir, 'views', 'shop.html'));
});

module.exports = router;
