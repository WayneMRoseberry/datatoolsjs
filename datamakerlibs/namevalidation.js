// Namespace and schema names are used as store keys, in URLs, and in HTML, so they are
// restricted to characters that are safe in all of those without escaping.
const NAMEPATTERN = /^[A-Za-z0-9_-]{1,64}$/;
const INVALIDNAME = "name must be 1-64 characters of a-z, A-Z, 0-9, - or _";

function isValidName(value) {
    return typeof value === 'string' && NAMEPATTERN.test(value);
}

// Walks a schema definition and returns the first invalid Namespace or SchemaName found on the
// SchemaDef itself or on any ReferenceSchemaObject nested within it, or null if all are valid.
function findInvalidName(obj) {
    if (obj == null || typeof obj !== 'object') {
        return null;
    }
    if (obj.ObjectTypeName === 'ReferenceSchemaObject' || 'RootSchemaObject' in obj) {
        if (!isValidName(obj.Namespace)) {
            return String(obj.Namespace);
        }
        if (!isValidName(obj.SchemaName)) {
            return String(obj.SchemaName);
        }
    }
    for (const value of Object.values(obj)) {
        const invalidName = findInvalidName(value);
        if (invalidName !== null) {
            return invalidName;
        }
    }
    return null;
}

module.exports = { INVALIDNAME, isValidName, findInvalidName };
