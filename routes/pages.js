'use strict';
var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/*', function (req, res) {
    var fileName = path.join(__dirname, req.path);
    console.log(`pages routing ${req.path}, opening ${fileName}`);
    res.sendFile(fileName);

});

module.exports = router;
