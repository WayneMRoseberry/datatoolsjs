const CommonSchema = require('../datamakerlibs/commonschema');
const DataMaker = require('../datamakerlibs/datamaker'); 
const { DeciderMock } = require('./DeciderMock');
const { ProviderMock } = require('./ProviderMock');
describe('DataMaker test suite', function () {

    describe('getRandomExample subsuite', function () {
        it("GetRandomExample ChoiceSchemaObject", function () {
            let choiceSchemaObject = new CommonSchema.ChoiceSchemaObject(["val1", "val2"]);
            let schemaDef = new CommonSchema.SchemaDef("schemadef1", choiceSchemaObject, "testnamespace");

            let passedInArray = null;

            let mock = new DeciderMock();
            mock.chooseItem = function (itemArray) {
                passedInArray = itemArray;
                return itemArray[0];
            };

            let example = DataMaker.getRandomExample(null, mock, schemaDef);
            expect(passedInArray.length).toEqual(2);
            expect(passedInArray[0]).toEqual("val1");
            expect(passedInArray[1]).toEqual("val2");
            expect(example.SchemaName).toEqual("schemadef1");
            expect(example.ExampleValue).toEqual("val1");

            mock.chooseItem = function (itemArray) {
                return itemArray[1];
            };
            example = DataMaker.getRandomExample(null, mock, schemaDef);
            expect(example.ExampleValue).toEqual("val2");

        });

        it("GetRandomExample OptionalSchemaObject", function () {
            let optionalSchemaObject = new CommonSchema.OptionalSchemaObject("val1");
            let schemaDef = new CommonSchema.SchemaDef("schemadef1", optionalSchemaObject, "testnamespace");

            let passedInObject = null;

            let mock = new DeciderMock();
            mock.optionChosen = function (schemaObject) {
                passedInObject = schemaObject;
                return true;
            };

            let example = DataMaker.getRandomExample(null, mock, schemaDef);
            expect(passedInObject).toEqual("val1");
            expect(example.SchemaName).toEqual("schemadef1");
            expect(example.ExampleValue).toEqual("val1");

            mock.optionChosen = function (schemaObject) {
                return false;
            };
            example = DataMaker.getRandomExample(null, mock, schemaDef);
            expect(example.ExampleValue).toEqual("");

        });

        it("GetRandomExample RangeAlphaSchemaObject", function () {
            let rangeAlphaSchemaObject = new CommonSchema.RangeAlphaSchemaObject("a","z");
            let schemaDef = new CommonSchema.SchemaDef("schemadef1", rangeAlphaSchemaObject, "testnamespace");

            let passedInMin = null;
            let passedInMax = null;

            let mock = new DeciderMock();
            mock.chooseAlphaRange = function (minAlpha, maxAlpha) {
                passedInMin = minAlpha;
                passedInMax = maxAlpha;
                return "b";
            };

            let example = DataMaker.getRandomExample(null, mock, schemaDef);
            expect(passedInMin).toEqual("a");
            expect(passedInMax).toEqual("z");
            expect(example.SchemaName).toEqual("schemadef1");
            expect(example.ExampleValue).toEqual("b");
        });

        it("GetRandomExample RangeNumericSchemaObject", function () {
            let rangeNumericSchemaObject = new CommonSchema.RangeNumericSchemaObject(1, 100);
            let schemaDef = new CommonSchema.SchemaDef("schemadef1", rangeNumericSchemaObject, "testnamespace");

            let passedInMin = -1;
            let passedInMax = -1;

            let mock = new DeciderMock();
            mock.chooseNumericRange = function (minNumeric, maxNumeric) {
                passedInMin = minNumeric;
                passedInMax = maxNumeric;
                return 12;
            };

            let example = DataMaker.getRandomExample(null, mock, schemaDef);
            expect(passedInMin).toEqual(1);
            expect(passedInMax).toEqual(100);
            expect(example.SchemaName).toEqual("schemadef1");
            expect(example.ExampleValue).toEqual(12);
        });

        it("GetRandomExample ReferenceSchemaObject", function () {
            let refSchemaObject = new CommonSchema.ReferenceSchemaObject("namespace1", "refschemadef");
            let testSchemaDef = new CommonSchema.SchemaDef("schemadef1", refSchemaObject, "testnamespace");

            let passedInNamespace = "";
            let passedInSchemaName = "";

            let mock = new ProviderMock();
            mock.getSchemaDef = function (namespace, schemaName) {
                passedInNamespace = namespace;
                passedInSchemaName = schemaName;

                let newSchemaObject = new CommonSchema.StaticSchemaObject("refval1");
                let refSchemaDef = new CommonSchema.SchemaDef("madeupname", newSchemaObject, "testnamespace");
                return refSchemaDef;
            };

            let example = DataMaker.getRandomExample(mock, null, testSchemaDef);
            expect(passedInNamespace).toEqual("namespace1");
            expect(passedInSchemaName).toEqual("refschemadef");
            expect(example.SchemaName).toEqual("schemadef1");
            expect(example.ExampleValue).toEqual("refval1");
        });

        it("GetRandomExample SequenceSchemaObject", function () {
            let sequenceSchemaObject = new CommonSchema.SequenceSchemaObject(["val1","val2"]);
            let schemaDef = new CommonSchema.SchemaDef("schemadef1", sequenceSchemaObject, "testnamespace");
            let example = DataMaker.getRandomExample(null, null, schemaDef);
            expect(example.SchemaName).toEqual("schemadef1");
            expect(example.ExampleValue).toEqual("val1val2");
        });

        it("GetRandomExample StaticSchemaObject", function () {
            let staticObject = new CommonSchema.StaticSchemaObject("val1");
            let schemaDef = new CommonSchema.SchemaDef("schemadef1", staticObject, "testnamespace");
            expect(DataMaker.getRandomExample(null, null, schemaDef).SchemaName).toEqual("schemadef1");
            expect(DataMaker.getRandomExample(null, null, schemaDef).ExampleValue).toEqual("val1");
        });

        it("GetRandomExample TwoDeepSequenceSchemaObject", function () {
            let sequenceSchemaObject = new CommonSchema.SequenceSchemaObject(["val1", "val2"]);
            let sequenceSchemaObject2 = new CommonSchema.SequenceSchemaObject([sequenceSchemaObject, "val3"]);
            let schemaDef = new CommonSchema.SchemaDef("schemadef1", sequenceSchemaObject2, "testnamespace");
            let example = DataMaker.getRandomExample(null, null, schemaDef);
            expect(example.SchemaName).toEqual("schemadef1");
            expect(example.ExampleValue).toEqual("val1val2val3");
        });
    });

    describe('schemaHasInfiniteLoop subsuite', function () {
        it('root is self-reference', function () {
            var schemaRef = new CommonSchema.ReferenceSchemaObject("testnamespace", "testschema");
            expect(schemaRef.Namespace).toEqual("testnamespace");
            var schemaDef = new CommonSchema.SchemaDef("testschema", schemaRef, "testnamespace");
            expect(schemaDef.SchemaName).toEqual("testschema", "testnamespace");
            expect(DataMaker.schemaHasInfiniteLoop(new ProviderMock(), "testnamespace", schemaDef)).toEqual(true);
        });

        it('root is sequence of choice of three range references', function () {
            var alphalower = new CommonSchema.RangeAlphaSchemaObject("a", "z");
            var alphalowerschemadef = new CommonSchema.SchemaDef("alphalower", alphalower, "baseobjects");
            var alphaupper = new CommonSchema.RangeAlphaSchemaObject("A", "Z");
            var alphaupperschemadef = new CommonSchema.SchemaDef("alphaupper", alphaupper, "baseobjects");            
            var alhadigits = new CommonSchema.RangeNumericSchemaObject("0", "9");
            var alphadigitsschemadef = new CommonSchema.SchemaDef("alphadigits", alhadigits, "baseobjects");
            var alphalowerref = new CommonSchema.ReferenceSchemaObject("baseobjects", "alphalower");
            var alphaupperref = new CommonSchema.ReferenceSchemaObject("baseobjects", "alphaupper");
            var alphadigitsref = new CommonSchema.ReferenceSchemaObject("baseobjects", "alphadigits");
            var alphanumericchar = new CommonSchema.ChoiceSchemaObject([alphalowerref, alphaupperref, alphadigitsref]);
            var alphanumericchardef = new CommonSchema.SchemaDef("alphanumericchar", alphanumericchar, "baseobjects");

            var eightcharalphanumeric = new CommonSchema.SequenceSchemaObject([alphanumericchardef, alphanumericchardef, alphanumericchardef, alphanumericchardef, alphanumericchardef, alphanumericchardef, alphanumericchardef, alphanumericchardef]);


            var providerMock = new ProviderMock();
            providerMock.getSchemaDef = function (schemaDef) {

                switch (schemaDef.SchemaName) {
                    case "alphalower":
                        {
                            return alphalowerschemadef;
                            break;
                        }
                    case "alphaupper":
                        {
                            return alphaupperschemadef;
                            break;
                        }
                    case "alphadigits":
                        {
                            return alphadigitsschemadef;
                            break;
                        }
                    case "alphanumericchar":
                        {
                            return alphanumericchardef;
                            break;
                        }
                }
            };

            expect(DataMaker.schemaHasInfiniteLoop(providerMock, "baseobjects", eightcharalphanumeric)).toEqual(false);
        });

        it('optional self-reference', function () {
            var schemaRef = new CommonSchema.ReferenceSchemaObject("testnamespace", "testschema");
            expect(schemaRef.Namespace).toEqual("testnamespace");
            var optObject = new CommonSchema.OptionalSchemaObject(schemaRef);
            var schemaDef = new CommonSchema.SchemaDef("testschema", optObject, "testnamespace");
            expect(schemaDef.SchemaName).toEqual("testschema");
            expect(DataMaker.schemaHasInfiniteLoop(new ProviderMock(), "testnamespace", schemaDef)).toEqual(false);
        });

        it('root is reference to 2nd schema that references 1st schema', function () {
            var schemaRef = new CommonSchema.ReferenceSchemaObject("testnamespace", "testschema2");
            var schemaDef = new CommonSchema.SchemaDef("testschema1", schemaRef, "testnamespace");
            var mock = new ProviderMock();

            mock.getSchemaDef = function (namespace, schemaName) {
                var schemaRef2 = new CommonSchema.ReferenceSchemaObject("testnamespace", "testschema1");
                var schemaDef2 = new CommonSchema.SchemaDef("testschema2", schemaRef2, "testnamespace");
                return schemaDef2;
            };

            expect(DataMaker.schemaHasInfiniteLoop(mock, "testnamespace", schemaDef)).toEqual(true);
        });

        it('root is reference to 2nd schema that terminates', function () {
            var schemaRef = new CommonSchema.ReferenceSchemaObject("testnamespace", "testschema2");
            var schemaDef = new CommonSchema.SchemaDef("testschema1", schemaRef, "testnamespace");
            var mock = new ProviderMock();

            mock.getSchemaDef = function (namespace, schemaName) {
                var staticObject = new CommonSchema.StaticSchemaObject("staticval");
                var schemaDef2 = new CommonSchema.SchemaDef("testschema2", staticObject, "testnamespace");
                return schemaDef2;
            };

            expect(DataMaker.schemaHasInfiniteLoop(mock, "testnamespace", schemaDef)).toEqual(false);
        });

        it('root is reference to 2nd schema that references 3rd schema that references 1st schema', function () {
            var schemaRef = new CommonSchema.ReferenceSchemaObject("testnamespace", "testschema2");
            var schemaDef = new CommonSchema.SchemaDef("testschema1", schemaRef, "testnamespace");
            var mock = new ProviderMock();

            mock.getSchemaDef = function (namespace, schemaName) {

                if (schemaName == "testschema2") {
                    var schemaRef2 = new CommonSchema.ReferenceSchemaObject("testnamespace", "testschema3");
                    var schemaDef2 = new CommonSchema.SchemaDef("testschema2", schemaRef2, "testnamespace");
                    return schemaDef2;
                }
                if (schemaName == "testschema1")
                {
                    return schemaDef;
                }
                else {
                    var schemaRef3 = new CommonSchema.ReferenceSchemaObject("testnamespace", "testschema1");
                    var schemaDef3 = new CommonSchema.SchemaDef("testschema3", schemaRef3, "testnamespace");
                    return schemaDef3;
                }
            };

            expect(DataMaker.schemaHasInfiniteLoop(mock, "testnamespace", schemaDef)).toEqual(true);
        });

        it('root is reference to 2nd schema that references 3rd schema that terminates', function () {
            var schemaRef = new CommonSchema.ReferenceSchemaObject("testnamespace", "testschema2");
            var schemaDef = new CommonSchema.SchemaDef("testschema1", schemaRef, "testnamespace");
            var mock = new ProviderMock();
            var passedInNamespace = "";
            var passedInSchemaName = "";
            var callCtr = 0;

            mock.getSchemaDef = function (namespace, schemaName) {
                callCtr++;
                passedInNamespace = namespace;
                passedInSchemaName = schemaName;

                if (schemaName == "testschema2") {
                    var schemaRef2 = new CommonSchema.ReferenceSchemaObject("testnamespace", "testschema3");
                    var schemaDef2 = new CommonSchema.SchemaDef("testschema2", schemaRef2, "testnamespace");
                    return schemaDef2;
                }
                else {
                    var schemaRef3 = new CommonSchema.StaticSchemaObject("schema3val");
                    var schemaDef3 = new CommonSchema.SchemaDef("testschema3", schemaRef3, "testnamespace");
                    return schemaDef3;
                }
            };

            expect(DataMaker.schemaHasInfiniteLoop(mock, "testnamespace", schemaDef)).toEqual(false);
            expect(passedInNamespace).toEqual("testnamespace");
            expect(passedInSchemaName).toEqual("testschema3");
        });

        it('root is reference to 2nd schema that references itself', function () {
            var schemaRef = new CommonSchema.ReferenceSchemaObject("testnamespace", "testschema2");
            var schemaDef = new CommonSchema.SchemaDef("testschema1", schemaRef, "testnamespace");
            var mock = new ProviderMock();
            var passedInNamespace = "";
            var passedInSchemaName = "";
            var callCtr = 0;

            mock.getSchemaDef = function (namespace, schemaName) {
                callCtr++;
                passedInNamespace = namespace;
                passedInSchemaName = schemaName;

                var schemaRef2 = new CommonSchema.ReferenceSchemaObject("testnamespace", "testschema2");
                var schemaDef2 = new CommonSchema.SchemaDef("testschema2", schemaRef2, "testnamespace");
                return schemaDef2;
            };

            expect(DataMaker.schemaHasInfiniteLoop(mock, "testnamespace", schemaDef)).toEqual(true);
            expect(passedInNamespace).toEqual("testnamespace");
            expect(passedInSchemaName).toEqual("testschema2");
            expect(callCtr).toEqual(1);
        });



        it('optional reference to 2nd schema that references itself', function () {
            var schemaRef = new CommonSchema.ReferenceSchemaObject("testnamespace", "testschema2");
            var optObject = new CommonSchema.OptionalSchemaObject(schemaRef);
            var schemaDef = new CommonSchema.SchemaDef("testschema1", optObject, "testnamespace");
            var mock = new ProviderMock();
            var passedInNamespace = "";
            var passedInSchemaName = "";
            var callCtr = 0;

            mock.getSchemaDef = function (namespace, schemaName) {
                callCtr++;
                passedInNamespace = namespace;
                passedInSchemaName = schemaName;

                var schemaRef2 = new CommonSchema.ReferenceSchemaObject("testnamespace", "testschema2");
                var schemaDef2 = new CommonSchema.SchemaDef("testschema2", schemaRef2, "testnamespace");
                return schemaDef2;
            };

            expect(DataMaker.schemaHasInfiniteLoop(mock, "testnamespace", schemaDef)).toEqual(true);
            expect(passedInNamespace).toEqual("testnamespace");
            expect(passedInSchemaName).toEqual("testschema2");
            expect(callCtr).toEqual(1);
        });

        it('root is option to reference to 2nd schema that references itself - infinite loop because of 2nd schema object looping on itself', function () {
            var schemaRef = new CommonSchema.ReferenceSchemaObject("testnamespace", "testschema2");
            var optObject = new CommonSchema.OptionalSchemaObject(schemaRef);
            var schemaDef = new CommonSchema.SchemaDef("testschema1", optObject, "testnamespace", "testnamespace");
            var mock = new ProviderMock();
            var passedInNamespace = "";
            var passedInSchemaName = "";
            var callCtr = 0;

            mock.getSchemaDef = function (namespace, schemaName) {
                callCtr++;
                passedInNamespace = namespace;
                passedInSchemaName = schemaName;

                var schemaRef2 = new CommonSchema.ReferenceSchemaObject("testnamespace", "testschema2");
                var schemaDef2 = new CommonSchema.SchemaDef("testschema2", schemaRef2, "testnamespace");
                return schemaDef2;
            };

            expect(DataMaker.schemaHasInfiniteLoop(mock, "testnamespace", schemaDef)).toEqual(true);
            expect(passedInNamespace).toEqual("testnamespace");
            expect(passedInSchemaName).toEqual("testschema2");
            expect(callCtr).toEqual(1);
        });

        it('self-reference two down from root, child of single item sequence', function () {
            var schemaRef = new CommonSchema.ReferenceSchemaObject("testnamespace", "testschema");
            var seqObject = new CommonSchema.SequenceSchemaObject([schemaRef]);
            var schemaDef = new CommonSchema.SchemaDef("testschema", seqObject, "testnamespace");
            expect(DataMaker.schemaHasInfiniteLoop(new ProviderMock(), "testnamespace", schemaDef)).toEqual(true);
        });

        it('self-reference two down from root, 2nd child of sequence', function () {
            var schemaRef = new CommonSchema.ReferenceSchemaObject("testnamespace", "testschema");
            var staticObject = new CommonSchema.StaticSchemaObject("testobject");
            var seqObject = new CommonSchema.SequenceSchemaObject([staticObject, schemaRef]);
            var schemaDef = new CommonSchema.SchemaDef("testschema", seqObject, "testnamespace");
            expect(DataMaker.schemaHasInfiniteLoop(new ProviderMock(), "testnamespace", schemaDef)).toEqual(true);
        });

        it('self-reference two down from root, child of single item choice', function () {
            var schemaRef = new CommonSchema.ReferenceSchemaObject("testnamespace", "testschema");
            var choiceObject = new CommonSchema.ChoiceSchemaObject([schemaRef]);
            var schemaDef = new CommonSchema.SchemaDef("testschema", choiceObject, "testnamespace");
            expect(DataMaker.schemaHasInfiniteLoop(new ProviderMock(), "testnamespace", schemaDef)).toEqual(true);
        });

        it('self-reference two down from root, 2nd child of two item choice', function () {
            var staticObject = new CommonSchema.StaticSchemaObject("testobject");
            var schemaRef = new CommonSchema.ReferenceSchemaObject("testnamespace", "testschema");
            var choiceObject = new CommonSchema.ChoiceSchemaObject([staticObject, schemaRef]);
            var schemaDef = new CommonSchema.SchemaDef("testschema", choiceObject, "testnamespace");
            expect(DataMaker.schemaHasInfiniteLoop(new ProviderMock(), "testnamespace", schemaDef)).toEqual(false);
        });

        it('two self-references two down from root, children of two item choice', function () {
            var schemaRef1 = new CommonSchema.ReferenceSchemaObject("testnamespace", "testschema");
            var schemaRef2 = new CommonSchema.ReferenceSchemaObject("testnamespace", "testschema");
            var choiceObject = new CommonSchema.ChoiceSchemaObject([schemaRef1, schemaRef2]);
            var schemaDef = new CommonSchema.SchemaDef("testschema", choiceObject, "testnamespace");
            expect(DataMaker.schemaHasInfiniteLoop(new ProviderMock(), "testnamespace", schemaDef)).toEqual(true);
        });
    });



});

