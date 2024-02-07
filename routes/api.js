'use strict';
var express = require('express');
var router = express.Router();
const CommonSchema = require('../datamakerlibs/commonschema');
const Datamaker = require('../datamakerlibs/datamaker');

var provider = null;
var decider = null;

router.configure = function (configsettings) {
    provider = configsettings.getSchemaProvider();
    decider = configsettings.getDecider();
}

/* GET home page. */
router.get('/', function (req, res) {
    const urlBase = getBaseHostURL(req);

    res.send(`<html><body><a href="${urlBase}/api/namespaces">Schema Namespaces</a>`);
});

router.get('/namespaces', function (req, res) {

    const hostBase = getBaseHostURL(req);

    var namespaces = provider.Namespaces();
    var result = [];
    try {
        for (const namespace of namespaces) {
            result.push({name:namespace, schemadefs:`${hostBase}/api/schemadefs?namespace=${namespace}`});
        }
    }
    catch (err) {
        if (exceptionIsKnownInvalidSchemaConditions(err)) {
            res.status(400);
            result["error"] = `invalid schema: ${err}`;
        }
        else {
            console.log(`error:${err}`);
            throw err;
        }
    }

    res.send(result);
});
router.get('/schemadefs', function (req, res) {
    var namespace = req.query.namespace;
    if (namespace == null) {
        throw CommonSchema.NULLVALUEERROR;
    }
    var hostBase = getBaseHostURL(req);
    console.log(`schemadefs namespace:${namespace}`);
    var result = [];
    try {

        var schemaDefs = provider.SchemaDefs(namespace);
        for (const schemaDef of schemaDefs) {
            result.push({
                name: schemaDef,
                namespace: namespace ,
                definitionUrl: buildSchemaDefUrl(hostBase, namespace, schemaDef),
                getRandomExample: `${hostBase}/api/schemadef/getrandomexample?namespace=${namespace}&schemaname=${schemaDef}&count=1`
            });
        }
    }
    catch (err) {
        if (exceptionIsKnownInvalidSchemaConditions(err)) {
            res.status(400);
            result["error"] = `invalid schema: ${err}`;
        }
        else {
            console.log(`error:${err}`);
            throw err;
        }
    }
    res.send(result);
});

router.get('/schemadef', function (req, res) {
    var namespace = req.query.namespace;
    var schemaname = req.query.schemaname;
    var result = {};
    try {
        if (namespace == null || schemaname == null) {
            throw CommonSchema.NULLVALUEERROR;
        }
        console.log(`schemadef namespace:${namespace}, schemaname:${schemaname}`);
        var schemaDef = provider.getSchemaDef(namespace, schemaname);
        result = schemaDef;
    }
    catch (err) {
        if (exceptionIsKnownInvalidSchemaConditions(err)) {
            res.status(400);
            result["error"] = `invalid schema: ${err}`;
        }
        else {
            console.log(`error:${err}`);
            throw err;
        }
    }
    res.send(result);
});

router.post('/schemadef', function (req, res) {
    console.log('POST schemadef');
    console.log(` schemaDef:${JSON.parse(JSON.stringify(req.body))}`);
    var response = {};
    try {
        const schemaDef = JSON.parse(JSON.stringify(req.body));
        if (typeof schemaDef.Namespace != 'string' || typeof schemaDef.SchemaName != 'string') {
            throw CommonSchema.MUSTBESTRING;
        }
        if (schemaDef.Namespace == ' ' || schemaDef.Namespace == '' || schemaDef.SchemaName == ' ' || schemaDef.SchemaName == '') {
            throw CommonSchema.MUSTNOTBEWHITESPACEOREMPTY;
        }

        if (Datamaker.schemaHasInfiniteLoop(provider, schemaDef.Namespace, schemaDef, [])) {
            throw `schema has infinite loop`;
        }

        provider.addSchemaDef(schemaDef);
        var newlymadeschema = provider.getSchemaDef(schemaDef.Namespace, schemaDef.SchemaName);
        response["SchemaDef"] = newlymadeschema;
        response["SchemaDefUrl"] = buildSchemaDefUrl(getBaseHostURL(req), newlymadeschema.Namespace, newlymadeschema.SchemaName);
    }
    catch (err)
    {
        if (exceptionIsKnownInvalidSchemaConditions(err)) {
            res.status(400);
            response["error"] = `invalid schema: ${err}`;
        }
        else {
            console.log(`error:${err}`);
            throw err;
        }
    }


    res.send(response);
});

router.get('/schemadef/getrandomexample', function (req, res) {
    var namespace = req.query.namespace;
    var schemaname = req.query.schemaname;
    var count = 1;
    if (typeof req.query.count != 'undefined') {
        count = Number(req.query.count);
    }
    console.log(`schemadef namespace:${namespace}, schemaname:${schemaname}`);
    var resultset = [];
    try {
        var schemaDef = provider.getSchemaDef(namespace, schemaname);

        for (var i = 0; i < count; i++) {

            var example = Datamaker.getRandomExample(provider, decider, schemaDef);
            resultset.push(example);
        }
    }
    catch (err) {
        console.log(`error: ${err}`);
        throw err;
    }

    res.send(resultset);
});

module.exports = router;

function exceptionIsKnownInvalidSchemaConditions(err) {
    return err == `schema has infinite loop`
        || err == `invalid SchemaObjectTypeName`
        || err == CommonSchema.MUSTBESTRING
        || err == CommonSchema.MUSTNOTBEWHITESPACEOREMPTY
        || err == CommonSchema.NULLVALUEERROR
        || err == CommonSchema.MAXALPHMUSTBEGREATERTHANOREQUALTOMINALPHA
        || err == CommonSchema.MAXNUMERICMUSTBEGREATERTHANOREQUALTOMINNUMERIC;
}

function buildSchemaDefUrl(hostBase, namespace, schemaDef) {
    return `${hostBase}/api/schemadef?namespace=${namespace}&schemaname=${schemaDef}`;
}

function getBaseHostURL(req) {
    const proxyHost = req.headers["x-forwarded-host"];
    const host = proxyHost ? proxyHost : req.headers.host;
    const hostBase = `${req.protocol}://${host}`;
    return hostBase;
}
