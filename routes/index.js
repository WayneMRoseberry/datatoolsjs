'use strict';
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    //res.render('index', { title: 'Express' });

    var content = '<html><body><br/><br/><a href="./api">a link to the page</a>';
    content += '<br/><a href="./api/namespaces">all the namespaces</a>';
    content += '<br/><a href="./documentation">DataMaker Documentation</a>'
    content += '</body ></html > ';

    res.send(content);
});

module.exports = router;
