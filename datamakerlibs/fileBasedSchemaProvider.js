const fs = require('fs');
const { NULLVALUEERROR, MUSTNOTBEWHITESPACEOREMPTY } = require("./commonschema");
const { INVALIDNAME, isValidName } = require("./namevalidation");

class FileBasedSchemaProvider {

    // store objects have no prototype so names like __proto__ and constructor are ordinary keys
    schemaStore = Object.create(null);
    _storeFilePath = 'schemaStore.json';

    constructor(storeFilePath) {
        if (storeFilePath != null) {
            this._storeFilePath = storeFilePath;
        }
        this.addSchemaDef = function (schemaDef) {
            if (schemaDef == null || schemaDef.Namespace == null || schemaDef.SchemaName == null) {
                throw NULLVALUEERROR;
            }
            if (!isValidName(schemaDef.Namespace) || !isValidName(schemaDef.SchemaName)) {
                throw INVALIDNAME;
            }

            console.log(`addSchemaDef, namespace:${schemaDef.Namespace}, schemaname:${schemaDef.SchemaName}, schemaDef:${schemaDef}`);

            if (!Object.keys(this.schemaStore).includes(schemaDef.Namespace)) {
                this.schemaStore[schemaDef.Namespace] = Object.create(null);
            }
            this.schemaStore[schemaDef.Namespace][schemaDef.SchemaName] = schemaDef;
            var schemaStoreContents = JSON.stringify(this.schemaStore);
            fs.writeFileSync(this._storeFilePath, schemaStoreContents);
        };

        this.getSchemaDef = function (namespace, schemaName) {
            if (namespace == null || schemaName == null) {
                throw NULLVALUEERROR;
            }
            if (namespace == '' || namespace == ' ' || schemaName == '' || schemaName == '') {
                throw MUSTNOTBEWHITESPACEOREMPTY;
            }
            if (!isValidName(namespace) || !isValidName(schemaName)) {
                throw INVALIDNAME;
            }
            if (Object.keys(this.schemaStore).includes(namespace)) {
                var nameslot = this.schemaStore[namespace];
                if (Object.keys(nameslot).includes(schemaName)) {
                    return this.schemaStore[namespace][schemaName]
                }
            }

            return null;
        };
        this.Namespaces = function () { return Object.keys(this.schemaStore); };

        this.SchemaDefs = function (namespace) {
            if (namespace == null) {
                throw NULLVALUEERROR;
            }
            if (!isValidName(namespace)) {
                throw INVALIDNAME;
            }
            if (Object.keys(this.schemaStore).includes(namespace)) {
                return Object.keys(this.schemaStore[namespace]);
            }
            return [];
        };

        var schemaStoreFileContents = "";
        if (fs.existsSync(this._storeFilePath)) {
            schemaStoreFileContents = fs.readFileSync(this._storeFilePath);
            if (schemaStoreFileContents.length != 0) {
                var parsedStore = JSON.parse(schemaStoreFileContents);
                for (const namespace of Object.keys(parsedStore)) {
                    this.schemaStore[namespace] = Object.assign(Object.create(null), parsedStore[namespace]);
                }
            }
        }
        else {
            fs.writeFileSync(this._storeFilePath, JSON.stringify(this.schemaStore));
        }

    }
}
exports.FileBasedSchemaProvider = FileBasedSchemaProvider;
