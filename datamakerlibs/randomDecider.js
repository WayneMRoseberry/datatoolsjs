const { MUSTBESINGLECHARACTERERROR, MAXALPHMUSTBEGREATERTHANOREQUALTOMINALPHA, MAXNUMERICMUSTBEGREATERTHANOREQUALTOMINNUMERIC } = require("./commonschema");

class RandomDecider {
    constructor() {
        this.chooseAlphaRange = function (minAlpha, maxAlpha) {
            if (minAlpha.length > 1 || maxAlpha.length > 1) {
                throw MUSTBESINGLECHARACTERERROR;
            }
            if (maxAlpha < minAlpha) {
                throw MAXALPHMUSTBEGREATERTHANOREQUALTOMINALPHA;
            }

            var minVal = minAlpha.charCodeAt(0);
            var maxVal = maxAlpha.charCodeAt(0);
            var chosenNumber = pickRandomNumberInRange(maxVal, minVal);
            return String.fromCharCode(chosenNumber);
        };
        this.chooseNumericRange = function (minNumeric, maxNumeric) {
            if (maxNumeric < minNumeric) {
                throw MAXNUMERICMUSTBEGREATERTHANOREQUALTOMINNUMERIC;
            }
            return pickRandomNumberInRange(maxNumeric, minNumeric);
        };
        this.chooseItem = function (itemArray) {
            if (itemArray.length < 1) {
                throw "item array must not be empty"
            }

            var maxItem = itemArray.length;
            var chosen = Math.floor(Math.random() * maxItem);
            return itemArray[chosen];
        };
        this.optionChosen = function(schemaObject) { return Math.random() > 0.5 ; };
    }
}
exports.RandomDecider = RandomDecider;

function pickRandomNumberInRange(maxVal, minVal) {
    return Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
}
