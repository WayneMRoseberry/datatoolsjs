'use strict';
var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/*', function (req, res) {
    //res.render('index', { title: 'Express' });
    var pagesdir = path.join(__dirname, '..\\pages');

    var fileName = path.join(pagesdir, req.path);
    console.log(`pages routing ${req.path}, opening ${fileName}`);
    res.sendFile(fileName);

});

module.exports = router;
