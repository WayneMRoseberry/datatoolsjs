const { FileBasedSchemaProvider } = require('../datamakerlibs/fileBasedSchemaProvider');
const CommonSchema = require('../datamakerlibs/commonschema');
const fs = require('fs');
const persistedStoreFile = "persistedstore.json";
describe('filebasedschemaprovider test suite', function () {
    afterEach(() => {
        cleanUpPersistedFile();
    });

    describe('addSchemaDef subsuite', function () {

        it("addSchemaDef", function () {
            var staticObject = new CommonSchema.StaticSchemaObject("val1");
            var schemaDef = new CommonSchema.SchemaDef("schema1", staticObject, "namespace");

            var schemaProvider = new FileBasedSchemaProvider(persistedStoreFile);
            schemaProvider.addSchemaDef(schemaDef);

            var returnedSchema = schemaProvider.getSchemaDef("namespace", "schema1");
            expect(returnedSchema.RootSchemaObject.StaticValue).toEqual("val1");
            expect(`includes namespace=${schemaProvider.Namespaces().includes("namespace")}`).toEqual("includes namespace=true");
            expect(`includes schema1=${schemaProvider.SchemaDefs("namespace").includes("schema1")}`).toEqual("includes schema1=true");
        });

        it("addSchemaDef - schemaDef null - throws", function () {
            var schemaProvider = new FileBasedSchemaProvider(persistedStoreFile);
            expect(() => { schemaProvider.addSchemaDef(null); }).toThrow(CommonSchema.NULLVALUEERROR);

        });

        it("addSchemaDef - schemaDef undefined - throws", function () {
            var schemaDef;
            var schemaProvider = new FileBasedSchemaProvider(persistedStoreFile);
            expect(() => { schemaProvider.addSchemaDef(schemaDef); }).toThrow(CommonSchema.NULLVALUEERROR);
        });

        it("addSchemaDef - persists across new providers", function () {
            var staticObject = new CommonSchema.StaticSchemaObject("val1");
            var schemaDef = new CommonSchema.SchemaDef("schema1", staticObject, "namespace");

            var firstSchemaProvider = new FileBasedSchemaProvider(persistedStoreFile);
            firstSchemaProvider.addSchemaDef(schemaDef);

            var secondSchemaProvider = new FileBasedSchemaProvider(persistedStoreFile);

            var returnedSchema = secondSchemaProvider.getSchemaDef("namespace", "schema1");
            expect(returnedSchema.RootSchemaObject.StaticValue).toEqual("val1");
            expect(`includes namespace=${secondSchemaProvider.Namespaces().includes("namespace")}`).toEqual("includes namespace=true");
            expect(`includes schema1=${secondSchemaProvider.SchemaDefs("namespace").includes("schema1")}`).toEqual("includes schema1=true");
            expect(`${persistedStoreFile} exists=${fs.existsSync(persistedStoreFile)}`).toEqual(`${persistedStoreFile} exists=true`);
        });
    });
});

function cleanUpPersistedFile() {
    fs.rmSync(persistedStoreFile);
}
