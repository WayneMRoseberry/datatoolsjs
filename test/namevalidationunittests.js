const { INVALIDNAME, isValidName, findInvalidName } = require('../datamakerlibs/namevalidation');
const CommonSchema = require('../datamakerlibs/commonschema');

describe('namevalidation test suite', function () {

    describe('isValidName subsuite', function () {

        it.each(["a", "Z", "0", "-", "_", "schema-name_01", "ABCxyz789", "a".repeat(64)])
            ("isValidName - %s - true", function (name) {
                expect(isValidName(name)).toEqual(true);
            });

        it.each(["", " ", " name", "name ", "a b", "a.b", "a/b", "a\\b", "../a", "a;b", "a'b", "a\"b",
            "a--b'; DROP TABLE schemas;--", "<script>", "a&b=c", "a?b", "a#b", "a%20b", "a\nb", "é", "名前", "a".repeat(65)])
            ("isValidName - %j - false", function (name) {
                expect(isValidName(name)).toEqual(false);
            });

        it.each([null, undefined, 1, true, ["a"], ["a", "b"], { a: "b" }])
            ("isValidName - non-string %j - false", function (value) {
                expect(isValidName(value)).toEqual(false);
            });

        // __proto__ only uses allowed characters, so stores must handle it as a plain key themselves
        it("isValidName - __proto__ - true", function () {
            expect(isValidName("__proto__")).toEqual(true);
        });
    });

    describe('findInvalidName subsuite', function () {

        it("findInvalidName - valid schemaDef - null", function () {
            var schemaDef = new CommonSchema.SchemaDef("schema1", new CommonSchema.StaticSchemaObject("any text <b>"), "namespace1");
            expect(findInvalidName(schemaDef)).toEqual(null);
        });

        it("findInvalidName - invalid Namespace - returns it", function () {
            var schemaDef = new CommonSchema.SchemaDef("schema1", new CommonSchema.StaticSchemaObject("val1"), "bad name");
            expect(findInvalidName(schemaDef)).toEqual("bad name");
        });

        it("findInvalidName - invalid SchemaName - returns it", function () {
            var schemaDef = new CommonSchema.SchemaDef("bad;name", new CommonSchema.StaticSchemaObject("val1"), "namespace1");
            expect(findInvalidName(schemaDef)).toEqual("bad;name");
        });

        it("findInvalidName - non-string SchemaName - returns it", function () {
            var schemaDef = { Namespace: "namespace1", SchemaName: ["a", "b"], RootSchemaObject: {} };
            expect(findInvalidName(schemaDef)).toEqual("a,b");
        });

        it("findInvalidName - valid nested reference - null", function () {
            var reference = new CommonSchema.ReferenceSchemaObject("namespace2", "schema2");
            var sequence = new CommonSchema.SequenceSchemaObject([new CommonSchema.ChoiceSchemaObject(["x", reference])]);
            var schemaDef = new CommonSchema.SchemaDef("schema1", sequence, "namespace1");
            expect(findInvalidName(schemaDef)).toEqual(null);
        });

        it("findInvalidName - invalid nested reference namespace - returns it", function () {
            var reference = new CommonSchema.ReferenceSchemaObject("bad'namespace", "schema2");
            var sequence = new CommonSchema.SequenceSchemaObject([new CommonSchema.ChoiceSchemaObject(["x", reference])]);
            var schemaDef = new CommonSchema.SchemaDef("schema1", sequence, "namespace1");
            expect(findInvalidName(schemaDef)).toEqual("bad'namespace");
        });

        it("findInvalidName - invalid nested reference schemaname - returns it", function () {
            var reference = new CommonSchema.ReferenceSchemaObject("namespace2", "bad/schema");
            var schemaDef = new CommonSchema.SchemaDef("schema1", new CommonSchema.ChoiceSchemaObject([reference]), "namespace1");
            expect(findInvalidName(schemaDef)).toEqual("bad/schema");
        });

        it("findInvalidName - reference as plain JSON - checked", function () {
            var schemaDef = JSON.parse('{"Namespace":"namespace1","SchemaName":"schema1","RootSchemaObject":{"ObjectTypeName":"ReferenceSchemaObject","Namespace":"ns","SchemaName":"a b"}}');
            expect(findInvalidName(schemaDef)).toEqual("a b");
        });

        it("INVALIDNAME - is a message string", function () {
            expect(typeof INVALIDNAME).toEqual("string");
        });
    });
});
