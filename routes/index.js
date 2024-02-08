'use strict';
var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

/* GET home page. */
router.get('/', function (req, res) {
    //res.render('index', { title: 'Express' });

    var fileName = path.join(__dirname, "../pages/mainindex.html");

    fs.readFile(fileName, { encoding: 'utf-8' }, function (err, data) {
        if (!err) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            res.end();
        }
        else {
            console.log(err);
        }
    });
});

module.exports = router;
