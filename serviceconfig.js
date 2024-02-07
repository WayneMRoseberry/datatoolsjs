'use strict';
const { RandomDecider } = require('./datamakerlibs/randomDecider');
const { FileBasedSchemaProvider } = require('./datamakerlibs/fileBasedSchemaProvider');

const CommonSchema = require('./datamakerlibs/commonschema');
const SCHEMAFILEPATH = "schemafile.json";
const EXAMPLENAMESPACE = "schemaexamples";

const filestore = new FileBasedSchemaProvider(SCHEMAFILEPATH);

var defStatic = new CommonSchema.StaticSchemaObject("val1");
var defSchemaDef = new CommonSchema.SchemaDef("defaultschema", defStatic, EXAMPLENAMESPACE);
filestore.addSchemaDef(defSchemaDef);

var defChoice = new CommonSchema.ChoiceSchemaObject(["choice1", defStatic]);
var defSchemaChoiceDef = new CommonSchema.SchemaDef("defaultchoiceschemaexample", defChoice, EXAMPLENAMESPACE);
filestore.addSchemaDef(defSchemaChoiceDef);

var refSchemaObject = new CommonSchema.ReferenceSchemaObject(EXAMPLENAMESPACE, "defaultchoiceschemaexample");
var refSchemaDef = new CommonSchema.SchemaDef("referenceschemaexample", refSchemaObject, EXAMPLENAMESPACE);
filestore.addSchemaDef(refSchemaDef);

var sequenceSchemaObject = new CommonSchema.SequenceSchemaObject([defChoice, defStatic]);
var sequenceSchemaDef = new CommonSchema.SchemaDef("sequenceschemaexample", sequenceSchemaObject, EXAMPLENAMESPACE);
filestore.addSchemaDef(sequenceSchemaDef);

var rangeAlphaSchemaObject = new CommonSchema.RangeAlphaSchemaObject("a", "z");
var rangeAlphaSchemaDef = new CommonSchema.SchemaDef("rangealphaschemaexample", rangeAlphaSchemaObject, EXAMPLENAMESPACE);
filestore.addSchemaDef(rangeAlphaSchemaDef);

var rangeNumericSchemaObject = new CommonSchema.RangeNumericSchemaObject(0, 9);
var rangeNumericSchemaDef = new CommonSchema.SchemaDef("rangenumericschemaexample", rangeNumericSchemaObject, EXAMPLENAMESPACE);
filestore.addSchemaDef(rangeNumericSchemaDef);

function getDecider() {
    return new RandomDecider();
}

function getSchemaProvider() {
    return filestore;
};

module.exports = { getDecider, getSchemaProvider, SCHEMAFILEPATH};

