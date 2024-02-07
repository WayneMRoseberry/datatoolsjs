const fs = require('fs');
const { NULLVALUEERROR, MUSTNOTBEWHITESPACEOREMPTY } = require("./commonschema");

class FileBasedSchemaProvider {

    schemaStore = {};
    _storeFilePath = 'schemaStore.json';

    constructor(storeFilePath) {
        if (storeFilePath != null) {
            this._storeFilePath = storeFilePath;
        }
        this.addSchemaDef = function (schemaDef) {
            if (schemaDef == null || schemaDef.Namespace == null || schemaDef.SchemaName == null) {
                throw NULLVALUEERROR;
            }

            console.log(`addSchemaDef, namespace:${schemaDef.Namespace}, schemaname:${schemaDef.SchemaName}, schemaDef:${schemaDef}`);

            if (!Object.keys(this.schemaStore).includes(schemaDef.Namespace)) {
                this.schemaStore[schemaDef.Namespace] = {};
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
            if (Object.keys(this.schemaStore).includes(namespace)) {
                return Object.keys(this.schemaStore[namespace]);
            }
            return [];
        };

        var schemaStoreFileContents = "";
        if (fs.existsSync(this._storeFilePath)) {
            schemaStoreFileContents = fs.readFileSync(this._storeFilePath);
            if (schemaStoreFileContents.length != 0) {
                this.schemaStore = JSON.parse(schemaStoreFileContents);
            }
        }
        else {
            fs.writeFileSync(this._storeFilePath, JSON.stringify(this.schemaStore));
        }

    }
}
exports.FileBasedSchemaProvider = FileBasedSchemaProvider;
