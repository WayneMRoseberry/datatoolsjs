'use strict';
var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

/* GET home page. */
router.get('/*', function (req, res) {
    var pagesdir = path.join(__dirname, '../pages');
    var fileName = path.join(pagesdir, req.path);
    console.log(` GET pages routing ${req.path}, opening ${fileName}, originalurl:${req.originalUrl}`);

    fs.readFile(fileName, { encoding: 'utf-8' }, function (err, data) {
        if (!err) {
            console.log(` pages data received from ${fileName}, length:${data.length}, writing to response.`);
            res.send(data);
        }
        else {
            console.log(err);
        }
    });

});

module.exports = router;
