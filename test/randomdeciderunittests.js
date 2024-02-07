const { RandomDecider }  = require('../datamakerlibs/randomDecider');

describe('randomDecider test suite', function () {
    describe('optionChose subsuite', function () {
        it("optionChosen will be approximate 50% true 50% false", function () {
            var trueCtr = 0;
            var falseCtr = 0;

            var decider = new RandomDecider();

            for (i = 0; i < 1000; i++) {
                if (decider.optionChosen("anything")) {
                    trueCtr++;
                }
                else {
                    falseCtr++;
                }
            }
            expect(trueCtr + falseCtr).toEqual(1000);
            expect(trueCtr).toBeGreaterThanOrEqual(300);
            expect(falseCtr).toBeGreaterThanOrEqual(300);
        });

    });

    describe('chooseItem subsuite', function () {

        it("chooseItem - 0 item in array - throws", function () {
            var decider = new RandomDecider();
            expect(() => { decider.chooseItem([]);}).toThrow();
        });

        it("chooseItem - 1 item in array", function () {
            var decider = new RandomDecider();
            expect(decider.chooseItem(["abc"])).toEqual("abc");
        });

        it("chooseItem - 2 item in array - each approximately 50%", function () {
            var item0ctr = 0;
            var item1ctr = 0;
            var itemarray = ["abc", "def"];
            var decider = new RandomDecider();

            for (i = 0; i < 100; i++) {
                var chosen = decider.chooseItem(itemarray);
                if (chosen == "abc") {
                    item0ctr++;
                }
                if (chosen == "def") {
                    item1ctr++;
                }
            }

            expect(item0ctr + item1ctr).toEqual(100);
            expect(item0ctr / 100 > 0.4).toBeTruthy();
            expect(item1ctr / 100 > 0.4).toBeTruthy();
        });
    });

    describe('rangeAlph subsuite', function () {

        it("rangeAlpha - min max same", function () {
            var decider = new RandomDecider();
            expect(decider.chooseAlphaRange("a","a")).toEqual("a");
        });

        it("rangeAlpha - min one away from max - approx 50% hits both", function () {
            var aCtr = 0;
            var bCtr = 0;
            var decider = new RandomDecider();
            for (i = 0; i < 100; i++) {
                var chosen = decider.chooseAlphaRange("a", "b");
                if (chosen == "a") {
                    aCtr++;
                }
                if (chosen == "b") {
                    bCtr++;
                }
            }
            expect(aCtr + bCtr).toEqual(100);
            expect(aCtr).toBeGreaterThanOrEqual(40);
            expect(bCtr).toBeGreaterThanOrEqual(40);
        });

        it("rangeAlpha - min 10 away from max - hits all the possible values", function () {
            var decider = new RandomDecider();
            var holder = [];
            for (i = 0; i < 1000; i++) {
                var chosen = decider.chooseAlphaRange("a", "j");
                if (!holder.includes(chosen)) {
                    holder.push(chosen);
                }

            }
            expect(holder.length).toEqual(10);
        });

        it("rangeAlpha - min larger than max", function () {
            var decider = new RandomDecider();
            expect(() => { decider.chooseAlphaRange("z", "a"); }).toThrow();
        });

        it("rangeAlpha - min and max more than one char", function () {
            var decider = new RandomDecider();
            expect(() => { decider.chooseAlphaRange("aa", "z"); }).toThrow();
            expect(() => { decider.chooseAlphaRange("a", "zz"); }).toThrow();
        });
    });

    describe('rangeNumeric subsuite', function () {
        it('rangeNumeric min and max are same value', function () {
            var decider = new RandomDecider();
            expect(decider.chooseNumericRange(5, 5)).toEqual(5);
        });

        it('rangeNumeric min and max are one apart', function () {
            var decider = new RandomDecider();
            var fiveCtr = 0;
            var sixCtr = 0;

            for (i = 0; i < 100; i++) {
                var chosen = decider.chooseNumericRange(5, 6);
                if (chosen == 5) {
                    fiveCtr++;
                }
                if (chosen == 6) {
                    sixCtr++;
                }
            }

            expect(fiveCtr + sixCtr).toEqual(100);
            expect(fiveCtr).toBeGreaterThanOrEqual(30);
            expect(sixCtr).toBeGreaterThanOrEqual(30);
        });

        it('rangeNumeric min and max are 10 apart - returns all of them if called enough', function () {
            var decider = new RandomDecider();
            var chosenItems = [];

            for (i = 0; i < 1000; i++) {
                var chosen = decider.chooseNumericRange(5, 14);
                if (!chosenItems.includes(chosen)) {
                    chosenItems.push(chosen);
                }
            }
            expect(chosenItems.length).toEqual(10);
        });
        it('max is smaller than min, throws', function () {
            var decider = new RandomDecider();
            expect(() => { decider.chooseNumericRange(6, 5); }).toThrow();
        });
    });


});
