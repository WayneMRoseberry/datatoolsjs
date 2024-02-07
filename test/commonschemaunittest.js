const CommonSchema = require('../datamakerlibs/commonschema');

describe('commonschema suite ', function () {
    describe(':schemaobjects:', function () {
        describe('choiceschemaobject suite', function () {
            it("instantiate choiceschemaobject", function () {
                let testval = new CommonSchema.ChoiceSchemaObject(["val1"]);
                expect(testval.ChoiceArray[0]).toEqual("val1");
            });

            it("instantiate choiceschemaobject with two choices", function () {
                let testval = new CommonSchema.ChoiceSchemaObject(["val1", "val2"]);
                expect(testval.ChoiceArray.length).toEqual(2);
                expect(testval.ChoiceArray[0]).toEqual("val1");
                expect(testval.ChoiceArray[1]).toEqual("val2");
            });

            it("instantiate choiceschemaobject null array", function () {
                expect(() => { let a = new CommonSchema.ChoiceSchemaObject(null); }).toThrow(CommonSchema.NULLVALUEERROR);
            });

            it("instantiate choiceschemaobject non array", function () {
                expect(() => { let a = new CommonSchema.ChoiceSchemaObject("val"); }).toThrow(CommonSchema.NONARRAYVALUEERROR);
            });

            it("instantiate choiceschemaobject array with StaticSchemaObject", function () {
                let staticObject = new CommonSchema.StaticSchemaObject("staticval1");
                let choiceObject = new CommonSchema.ChoiceSchemaObject([staticObject]);
                expect(choiceObject.ChoiceArray[0].StaticValue).toEqual("staticval1");
            });

        })

        describe('optionalschemaobject suite', function () {
            it("instantiate optionalschemaobject", function () {
                let testval = new CommonSchema.OptionalSchemaObject("optionalvalue");
                expect(testval.OptionalValue).toEqual("optionalvalue");
            });

            it("instantiate optionalschemaobject with StaticObject", function () {
                let staticObject = new CommonSchema.StaticSchemaObject("staticval");
                let testval = new CommonSchema.OptionalSchemaObject(staticObject);
                expect(testval.OptionalValue.StaticValue).toEqual("staticval");
            });

            it("instantiate optionalschemaobject with null", function () {
                expect(() => { let testval = new CommonSchema.OptionalSchemaObject(null); }).toThrow(CommonSchema.NULLVALUEERROR);
            });
        });

        describe('rangealphaschemaobject suite', function () {
            it("instantiate rangealphaschemaobject", function () {
                let testval = new CommonSchema.RangeAlphaSchemaObject("a", "z");
                expect(testval.MinAlpha).toEqual("a");
                expect(testval.MaxAlpha).toEqual("z");
            });


            it("instantiate rangealphaschemaobject minalpha equals maxalpha", function () {
                let testval = new CommonSchema.RangeAlphaSchemaObject("m", "m");
                expect(testval.MinAlpha).toEqual("m");
                expect(testval.MaxAlpha).toEqual("m");
            });

            it("instantiate rangealphaschemaobject maxalpha less than minalpha", function () {
                expect(() => { let testval = new CommonSchema.RangeAlphaSchemaObject("z", "a"); }).toThrow(CommonSchema.MAXALPHMUSTBEGREATERTHANOREQUALTOMINALPHA);
            });

            it("instantiate rangealphaschemaobject with null MinAlpha", function () {
                expect(() => { let testval = new CommonSchema.RangeAlphaSchemaObject(null, "z"); }).toThrow(CommonSchema.NULLVALUEERROR);
            });

            it("instantiate rangealphaschemaobject with null MaxAlpha", function () {
                expect(() => { let testval = new CommonSchema.RangeAlphaSchemaObject("a", null); }).toThrow(CommonSchema.NULLVALUEERROR);
            });

            it("instantiate rangealphaschemaobject with non single character minAlpha", function () {
                expect(() => { let testval = new CommonSchema.RangeAlphaSchemaObject("abc", "z"); }).toThrow(CommonSchema.MUSTBESINGLECHARACTERERROR);
            });

            it("instantiate rangealphaschemaobject with non single character maxAlpha", function () {
                expect(() => { let testval = new CommonSchema.RangeAlphaSchemaObject("a", "xyz"); }).toThrow(CommonSchema.MUSTBESINGLECHARACTERERROR);
            });
        });

        describe('rangenumericschemaobject suite', function () {
            it("instantiate rangenumericschemaobject", function () {
                let testval = new CommonSchema.RangeNumericSchemaObject(1, 20);
                expect(testval.MinNumeric).toEqual(1);
                expect(testval.MaxNumeric).toEqual(20);
            });


            it("instantiate rangenumericchemaobject minnumeric equals maxnumeric", function () {
                let testval = new CommonSchema.RangeNumericSchemaObject(5, 5);
                expect(testval.MinNumeric).toEqual(5);
                expect(testval.MaxNumeric).toEqual(5);
            });

            it("instantiate rangenumericchemaobject maxnumeric less than minumeric", function () {
                expect(() => { let testval = new CommonSchema.RangeNumericSchemaObject(20, 1); }).toThrow(CommonSchema.MAXNUMERICMUSTBEGREATERTHANOREQUALTOMINNUMERIC);
            });

            it("instantiate rangenumericschemaobject with null MinNumeric", function () {
                expect(() => { let testval = new CommonSchema.RangeNumericSchemaObject(null, 30); }).toThrow(CommonSchema.NULLVALUEERROR);
            });

            it("instantiate rangenumericschemaobject with null MaxNumeric", function () {
                expect(() => { let testval = new CommonSchema.RangeNumericSchemaObject(3, null); }).toThrow(CommonSchema.NULLVALUEERROR);
            });

        });

        describe('referenceschemaobject suite', function () {
            it("instantiate referenceschemaobject", function () {
                let testval = new CommonSchema.ReferenceSchemaObject("testnamespace", "schemadefname");
                expect(testval.Namespace).toEqual("testnamespace");
                expect(testval.SchemaName).toEqual("schemadefname");
            });

            it("instantiate referenceschemaobject with null namespace", function () {
                expect(() => { let testval = new CommonSchema.ReferenceSchemaObject(null, "schemadefname"); }).toThrow(CommonSchema.NULLVALUEERROR);
            });

            it("instantiate referenceschemaobject with null schemaname", function () {
                expect(() => { let testval = new CommonSchema.ReferenceSchemaObject("testnamespace", null); }).toThrow(CommonSchema.NULLVALUEERROR);
            });
        });

        describe('sequenceschemaobject suite', function () {
            it("instantiate sequenceschemaobject", function () {
                let testval = new CommonSchema.SequenceSchemaObject(["val1"]);
                expect(testval.SequenceArray[0]).toEqual("val1");
            });

            it("instantiate sequenceschemaobject with two choices", function () {
                let testval = new CommonSchema.SequenceSchemaObject(["val1", "val2"]);
                expect(testval.SequenceArray.length).toEqual(2);
                expect(testval.SequenceArray[0]).toEqual("val1");
                expect(testval.SequenceArray[1]).toEqual("val2");
            });

            it("instantiate sequenceschemaobject null array", function () {
                expect(() => { let a = new CommonSchema.SequenceSchemaObject(null); }).toThrow(CommonSchema.NULLVALUEERROR);
            });

            it("instantiate sequenceschemaobject non array", function () {
                expect(() => { let a = new CommonSchema.SequenceSchemaObject("val"); }).toThrow(CommonSchema.NONARRAYVALUEERROR);
            });

            it("instantiate sequenceschemaobject array with StaticSchemaObject", function () {
                let staticObject = new CommonSchema.StaticSchemaObject("staticval1");
                let sequenceObject = new CommonSchema.SequenceSchemaObject([staticObject]);
                expect(sequenceObject.SequenceArray[0].StaticValue).toEqual("staticval1");
            });

        });

        describe('staticschemaobject suite', function () {
            it("instantiate staticschemaobject", function () {
                let testval = new CommonSchema.StaticSchemaObject("staticvalue");
                expect(testval.StaticValue).toEqual("staticvalue");
            })
        });
    });
    describe(':schemadef:', function () {
        describe('schema def tests', function () {

            test("loadSchema roundtrip static schema object", function () {

                let staticObject = new CommonSchema.StaticSchemaObject("val1");
                let schemaDef = new CommonSchema.SchemaDef("schemaDef1", staticObject, "testnamespace");
                expect(schemaDef.RootSchemaObject.StaticValue).toEqual("val1");
                let persistedSchemaDef = CommonSchema.toJson(schemaDef);
                expect(!persistedSchemaDef || persistedSchemaDef.length === 0).toBeFalsy();
                let loadedSchemaDef = CommonSchema.loadSchemaDef(persistedSchemaDef);
                expect(loadedSchemaDef.RootSchemaObject.StaticValue).toEqual(schemaDef.RootSchemaObject.StaticValue);
            });

            test("loadSchema roundtrip nested sequence", function () {

                let staticObject = new CommonSchema.StaticSchemaObject("val1");
                let seqSchemaObject = new CommonSchema.SequenceSchemaObject([staticObject]);
                let schemaDef = new CommonSchema.SchemaDef("schemaDef1", seqSchemaObject, "testnamespace");
                expect(schemaDef.RootSchemaObject.SequenceArray.length).toEqual(1);
                expect(schemaDef.RootSchemaObject.SequenceArray[0].StaticValue).toEqual("val1");
                let persistedSchemaDef = CommonSchema.toJson(schemaDef);
                expect(!persistedSchemaDef || persistedSchemaDef.length === 0).toBeFalsy();
                let loadedSchemaDef = CommonSchema.loadSchemaDef(persistedSchemaDef);
                expect(loadedSchemaDef.RootSchemaObject.SequenceArray.length).toEqual(1);
                expect(loadedSchemaDef.RootSchemaObject.SequenceArray[0].StaticValue).toEqual(schemaDef.RootSchemaObject.SequenceArray[0].StaticValue);
            });
            
            it("schemadef with StaticValue root", function () {
                let staticObject = new CommonSchema.StaticSchemaObject("val1");
                let schemaDef = new CommonSchema.SchemaDef("schemaDef1", staticObject, "testnamespace");
                expect(schemaDef.RootSchemaObject.StaticValue).toEqual("val1");
            });

            it("schemadef with SequenceSchemaObject root", function () {
                let seqObject = new CommonSchema.SequenceSchemaObject(["val1","val2"]);
                let schemaDef = new CommonSchema.SchemaDef("schemaDef1", seqObject, "testnamespace");
                expect(schemaDef.RootSchemaObject.SequenceArray.length).toEqual(2);
                expect(schemaDef.RootSchemaObject.SequenceArray[0]).toEqual("val1");
                expect(schemaDef.RootSchemaObject.SequenceArray[1]).toEqual("val2");
            });

            it("schemadef with null root", function () {
                expect(function () {let schemaDef = new CommonSchema.SchemaDef("schemaDef1", null); }).toThrow(CommonSchema.NULLVALUEERROR);
            });
            it("schemadef with null schemaName", function () {
                let staticObject = new CommonSchema.StaticSchemaObject("val1");
                expect(function () { let schemaDef = new CommonSchema.SchemaDef(null, staticObject); }).toThrow(CommonSchema.NULLVALUEERROR);
            });

        })

    });
});

