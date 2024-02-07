'use strict';
const CommonSchema = require('./commonschema');
const EXTERNALSCHEMAINFINITELOOPDETECTED = "external schema has infinite loop";
const SCHEMAHASINFINITELOOP = "schema has infinite loop";
function getRandomExample(schemaProvider, decider, schemaDef) {
    let root = schemaDef.RootSchemaObject;
    let randomValue = evaluateSchemaObject(schemaProvider, decider, root);

    return new CommonSchema.SchemaExample(schemaDef.SchemaName, randomValue);
}

function schemaHasInfiniteLoop(schemaProvider,namespace, schemaDef, seenAlreadyArray) {
    try {
        if (typeof seenAlreadyArray == 'undefined') {
            seenAlreadyArray = [];
        }

        var seenAlreadylabel = `${namespace}_${schemaDef.SchemaName}`;
        seenAlreadyArray.push(seenAlreadylabel);

        return schemaObjectHasInfiniteLoop(schemaProvider, schemaDef.SchemaName, schemaDef.RootSchemaObject, seenAlreadyArray);
    }
    catch (err) {
        if (err == EXTERNALSCHEMAINFINITELOOPDETECTED) {
            return true;
        }
        throw err;
    }
};

module.exports = { getRandomExample, schemaHasInfiniteLoop};

function evaluateSchemaObject(schemaProvider, decider, schemaObject) {
    if (typeof schemaObject == 'undefined') {
        throw "cannot evaluate null schemaObject";
    }
    let randomValue = "";
    let typeName = "";
    if (typeof schemaObject.ObjectTypeName != 'undefined') {
        typeName = schemaObject.ObjectTypeName;
    }
    switch (typeName) {
        case "ChoiceSchemaObject":
            {
                let chosen = decider.chooseItem(schemaObject.ChoiceArray);
                randomValue = evaluateSchemaObject(schemaProvider, decider, chosen);
                break;
            }
        case "OptionalSchemaObject":
            {
                if (decider.optionChosen(schemaObject.OptionalValue)) {
                    randomValue = evaluateSchemaObject(schemaProvider, decider, schemaObject.OptionalValue);
                }
                break;
            }
        case "RangeAlphaSchemaObject":
            {
                return decider.chooseAlphaRange(schemaObject.MinAlpha, schemaObject.MaxAlpha);
                break;
            }
        case "RangeNumericSchemaObject":
            {
                return decider.chooseNumericRange(schemaObject.MinNumeric, schemaObject.MaxNumeric);
                break;
            }
        case "SequenceSchemaObject":
            {
                for(const schemaItem of schemaObject.SequenceArray)
                {
                    randomValue = randomValue + evaluateSchemaObject(schemaProvider, decider, schemaItem);
                }
                break;
            }
        case "StaticSchemaObject":
            {
                randomValue = schemaObject.StaticValue;
                break;
            }
        case "ReferenceSchemaObject":
            {
                let schemaDef = schemaProvider.getSchemaDef(schemaObject.Namespace, schemaObject.SchemaName);
                randomValue = evaluateSchemaObject(schemaProvider, decider, schemaDef.RootSchemaObject);
                break;
            }
        default:
            {
                randomValue = schemaObject;
                break;
            }
    }
    return randomValue;
}

function schemaObjectHasInfiniteLoop(schemaProvider, schemaDefName, schemaObject, seenAlreadyArray) {

    if (typeof schemaObject == 'undefined') {
        return false;
    }

    console.log(` schemaObjectHasInfiniteLoop, schemaDefName: ${schemaDefName}, schemaObject.SchemaName:${schemaObject.SchemaName}`);

    let typeName = "";
    if (typeof schemaObject != 'undefined' && typeof schemaObject.ObjectTypeName != 'undefined') {
        typeName = schemaObject.ObjectTypeName;
    }
    switch (typeName) {
        case 'ReferenceSchemaObject':
            {
                var seenAlreadylabel = `${schemaObject.Namespace}_${schemaObject.SchemaName}`;
                if (schemaObject.SchemaName == schemaDefName) {
                    return true;
                }
                if (seenAlreadyArray.includes(seenAlreadylabel)) {
                    return true;
                }

                var refDef = schemaProvider.getSchemaDef(schemaObject.Namespace, schemaObject.SchemaName);

                if (!seenAlreadyArray.includes(seenAlreadylabel)) {
                    console.log(`   schemaObjectHasInfiniteLoop, Have not seen schema ${seenAlreadylabel} yet, examining for infinite loops.`);
                    if (schemaHasInfiniteLoop(schemaProvider, schemaObject.Namespace, refDef, seenAlreadyArray.map((x) => x))) {
                        throw EXTERNALSCHEMAINFINITELOOPDETECTED;
                    }
                }
                seenAlreadyArray.push(seenAlreadylabel);
                var res = schemaObjectHasInfiniteLoop(schemaProvider, schemaDefName, refDef.RootSchemaObject, seenAlreadyArray);

                return res;
                break;
            }
        case 'SequenceSchemaObject':
            {
                for(const childObject of schemaObject.SequenceArray)
                {
                    if (schemaObjectHasInfiniteLoop(schemaProvider, schemaDefName, childObject, seenAlreadyArray.map((x) => x))) {
                        return true;
                    }
                }
                break;
            }
        case 'ChoiceSchemaObject':
            {
                for (const childObject of schemaObject.ChoiceArray) {
                    if (!schemaObjectHasInfiniteLoop(schemaProvider, schemaDefName, childObject, seenAlreadyArray)) {
                        return false;
                    }
                }
                return true;;
                break;
            }
        case 'OptionalSchemaObject':
            {
                // evaluating in there are loops, but other than external schema objects looping
                // on themselves, all self-references below an option are escapable. Relying
                // on throw detecting infinite loops in external schema objects to catch external
                // case, otherwise always returning true.
                schemaObjectHasInfiniteLoop(schemaProvider, schemaDefName, schemaObject.OptionalValue, seenAlreadyArray);
                return false;
                break;
            }
        case 'RangeAlphaSchemaObject':
            {
                if (schemaObject.MinAlpha == null || schemaObject.MaxAlpha == null) {
                    throw CommonSchema.NULLVALUEERROR;
                }
                if (stringIsSpaceOrEmpty(schemaObject.MinAlpha) || stringIsSpaceOrEmpty(schemaObject.MaxAlpha)) {
                    throw CommonSchema.MUSTNOTBEWHITESPACEOREMPTY;
                }
                if (schemaObject.MaxAlpha < schemaObject.MinAlpha) {
                    throw CommonSchema.MAXALPHMUSTBEGREATERTHANOREQUALTOMINALPHA;
                }
                break;
            }
        case 'RangeNumericSchemaObject':
            {
                if (schemaObject.MinNumeric == null || schemaObject.MaxNumeric == null) {
                    throw CommonSchema.NULLVALUEERROR;
                }
                if (schemaObject.MaxNumeric < schemaObject.MinNumeric) {
                    throw CommonSchema.MAXNUMERICMUSTBEGREATERTHANOREQUALTOMINNUMERIC;
                }
                break;
            }
        default:
            {
                throw `invalid SchemaObjectTypeName`;
                break;
            }
    }
    return false;
}

function stringIsSpaceOrEmpty(min) {
    return min == '' || min == '';
}
