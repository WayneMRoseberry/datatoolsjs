class ProviderMock {
    constructor() {
        this.getSchemaDef = function(namespace, schemaName) { throw "not implemented"; };
    }
}
exports.ProviderMock = ProviderMock;
