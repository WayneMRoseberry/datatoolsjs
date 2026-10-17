const { FileBasedSchemaProvider } = require('../datamakerlibs/fileBasedSchemaProvider');
const CommonSchema = require('../datamakerlibs/commonschema');
const { INVALIDNAME } = require('../datamakerlibs/namevalidation');
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

        it.each([["bad name", "schema1"], ["namespace", "bad'name"], ["namespace", ["a"]]])
            ("addSchemaDef - invalid name namespace:%j schemaname:%j - throws", function (namespace, schemaName) {
                var schemaDef = new CommonSchema.SchemaDef(schemaName, new CommonSchema.StaticSchemaObject("val1"), namespace);
                var schemaProvider = new FileBasedSchemaProvider(persistedStoreFile);
                expect(() => { schemaProvider.addSchemaDef(schemaDef); }).toThrow(INVALIDNAME);
                expect(schemaProvider.Namespaces()).toEqual([]);
            });

        it.each([["__proto__", "schema1"], ["namespace", "__proto__"], ["constructor", "constructor"]])
            ("addSchemaDef - object key name namespace:%s schemaname:%s - persists as plain key", function (namespace, schemaName) {
                var schemaDef = new CommonSchema.SchemaDef(schemaName, new CommonSchema.StaticSchemaObject("val1"), namespace);
                new FileBasedSchemaProvider(persistedStoreFile).addSchemaDef(schemaDef);

                var schemaProvider = new FileBasedSchemaProvider(persistedStoreFile);
                expect(schemaProvider.Namespaces()).toEqual([namespace]);
                expect(schemaProvider.SchemaDefs(namespace)).toEqual([schemaName]);
                expect(schemaProvider.getSchemaDef(namespace, schemaName).RootSchemaObject.StaticValue).toEqual("val1");
            });
    });

    describe('name validation subsuite', function () {

        it.each([["bad name", "schema1"], ["namespace", "a;b"], ["namespace", "../x"], [{ a: "b" }, "schema1"]])
            ("getSchemaDef - invalid name namespace:%j schemaname:%j - throws", function (namespace, schemaName) {
                var schemaProvider = new FileBasedSchemaProvider(persistedStoreFile);
                expect(() => { schemaProvider.getSchemaDef(namespace, schemaName); }).toThrow(INVALIDNAME);
            });

        it("getSchemaDef - empty name - still throws empty error", function () {
            var schemaProvider = new FileBasedSchemaProvider(persistedStoreFile);
            expect(() => { schemaProvider.getSchemaDef("", "schema1"); }).toThrow(CommonSchema.MUSTNOTBEWHITESPACEOREMPTY);
        });

        it("getSchemaDef - valid unknown name - null", function () {
            var schemaProvider = new FileBasedSchemaProvider(persistedStoreFile);
            expect(schemaProvider.getSchemaDef("constructor", "toString")).toEqual(null);
        });

        it.each(["bad name", "a'b", ["a", "b"]])
            ("SchemaDefs - invalid namespace %j - throws", function (namespace) {
                var schemaProvider = new FileBasedSchemaProvider(persistedStoreFile);
                expect(() => { schemaProvider.SchemaDefs(namespace); }).toThrow(INVALIDNAME);
            });
    });
});

function cleanUpPersistedFile() {
    fs.rmSync(persistedStoreFile);
}
