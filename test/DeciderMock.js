class DeciderMock {
    constructor() {
        this.chooseAlphaRange = function(minAlpha, maxAlpha) { throw "not implemented"; };
        this.chooseNumericRange = function(minNumeric, maxNumeric) { throw "not implemented"; };
        this.chooseItem = function(itemArray) { throw "not implemented"; };
        this.optionChosen = function(schemaObject) { throw "not implemented"; };
    }
}
exports.DeciderMock = DeciderMock;
