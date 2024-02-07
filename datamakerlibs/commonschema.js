'use strict';
const MAXALPHMUSTBEGREATERTHANOREQUALTOMINALPHA = "maxalpha must be equal to or larger than minalpha";
const MAXNUMERICMUSTBEGREATERTHANOREQUALTOMINNUMERIC = "maxnumeric must be equal to or larger than minnumeric";
const MUSTBESINGLECHARACTERERROR = "argument must be a single character";
const MUSTBESTRING = "argument must be a string";
const NULLVALUEERROR = "value must not be null";
const NONARRAYVALUEERROR = "value must be an array";
const MUSTNOTBEWHITESPACEOREMPTY = "value must not be whitespace or empty";

class SchemaObjectBase {
    constructor(objectTypeName) {
        this.ObjectTypeName = objectTypeName;
    }
}

class ChoiceSchemaObject extends SchemaObjectBase {
    constructor(choiceArray) {
        super("ChoiceSchemaObject");
        if(choiceArray == null) {
            throw NULLVALUEERROR;
        }
        if (!Array.isArray(choiceArray)) {
            throw NONARRAYVALUEERROR;
        }
        this.ChoiceArray = choiceArray;
    }
}

class OptionalSchemaObject extends SchemaObjectBase {
    constructor(optionalValue) {
        super("OptionalSchemaObject");
        if (optionalValue == null) {
            throw NULLVALUEERROR;
        }

        this.OptionalValue = optionalValue;
    }
}

class RangeAlphaSchemaObject extends SchemaObjectBase {
    constructor(minAlpha, maxAlpha) {
        super("RangeAlphaSchemaObject");
        if (minAlpha == null || maxAlpha == null) {
            throw NULLVALUEERROR;
        }
        if (minAlpha > maxAlpha) {
            throw MAXALPHMUSTBEGREATERTHANOREQUALTOMINALPHA;
        }
        if (minAlpha.length != 1 || maxAlpha.length != 1) {
            throw MUSTBESINGLECHARACTERERROR;
        }
        this.MinAlpha = minAlpha;
        this.MaxAlpha = maxAlpha;
    }
}

class RangeNumericSchemaObject extends SchemaObjectBase {
    constructor(minNumeric, maxNumeric) {
        super("RangeNumericSchemaObject");
        if (minNumeric == null || maxNumeric == null) {
            throw NULLVALUEERROR;
        }
        if (minNumeric > maxNumeric) {
            throw MAXNUMERICMUSTBEGREATERTHANOREQUALTOMINNUMERIC;
        }
        this.MinNumeric = minNumeric;
        this.MaxNumeric = maxNumeric;
    }
}

class ReferenceSchemaObject extends SchemaObjectBase {
    constructor(namespace, schemaname) {
        super("ReferenceSchemaObject");
        if (namespace == null || schemaname == null) {
            throw NULLVALUEERROR;
        }
        this.Namespace = namespace;
        this.SchemaName = schemaname;
    }
}

class SchemaDef {
    constructor(schemaName, rootSchemaObject, namespace) {
        if (schemaName == null || rootSchemaObject == null || namespace == null) {
            throw NULLVALUEERROR;
        }
        this.SchemaName = schemaName;
        this.RootSchemaObject = rootSchemaObject;
        this.Namespace = namespace;
    }
}

class SchemaExample {
    constructor(schemaName, exampleValue) {
        this.SchemaName = schemaName;
        this.ExampleValue = exampleValue;
    }
}

class SequenceSchemaObject extends SchemaObjectBase {
    constructor(sequenceArray) {
        super("SequenceSchemaObject");
        if (sequenceArray == null) {
            throw NULLVALUEERROR;
        }
        if (!Array.isArray(sequenceArray)) {
            throw NONARRAYVALUEERROR;
        }
        this.SequenceArray = sequenceArray;
    }
}

class StaticSchemaObject extends SchemaObjectBase {
    constructor(value) {
        super("StaticSchemaObject");
        this.StaticValue = value;
    }
}

function loadSchemaDef(schemaJson) {
    return JSON.parse(schemaJson);
}

function toJson(schemaDef) {
    return JSON.stringify(schemaDef);
}


module.exports = {
    ChoiceSchemaObject, OptionalSchemaObject, RangeAlphaSchemaObject, RangeNumericSchemaObject, ReferenceSchemaObject, SchemaDef, SchemaExample, SequenceSchemaObject, StaticSchemaObject,
    loadSchemaDef, toJson,
    MAXALPHMUSTBEGREATERTHANOREQUALTOMINALPHA, MAXNUMERICMUSTBEGREATERTHANOREQUALTOMINNUMERIC, MUSTBESINGLECHARACTERERROR, MUSTBESTRING, MUSTNOTBEWHITESPACEOREMPTY, NULLVALUEERROR, NONARRAYVALUEERROR
};