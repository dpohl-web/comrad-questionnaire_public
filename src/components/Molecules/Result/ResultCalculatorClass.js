export default class ResultCalculatorClass {
    constructor(maxValuesOfCategories, category_values) {
        this.maxValuesOfCategories = maxValuesOfCategories;
        this.category_values = category_values;
        this.styles_interpretation_one = [];
        this.styles_interpretation_two = { x: 0, y: 0 };
    }

    calculateInterpretationOne = calculateInterpretationTwo => {
        // return has to be an array like "styles_interpretation_one = [61, 30, 15, 30]";
        let i = 1;

            
        const styles_interpretation_one = []; // 0 is not evaluated
        for (i; i < this.category_values.length; i++) {
            styles_interpretation_one[i - 1] = parseInt(
                (this.category_values[i] /
                    this.maxValuesOfCategories[i - 1].maxvalue) *
                    100,
                10
            );
        }
        this.styles_interpretation_one = styles_interpretation_one;
        calculateInterpretationTwo();
    };

    calculateInterpretationTwo = () => {
        // return has to be an object like "styles_interpretation_two = {x: 20, y: 80}";
        const x_styles =
            this.styles_interpretation_one[0] -
            this.styles_interpretation_one[2];
        const y_styles =
            this.styles_interpretation_one[1] -
            this.styles_interpretation_one[3];

        this.styles_interpretation_two = { x: x_styles, y: y_styles };
    };

    get_styles() {
        // returns an array like [[61, 30, 15, 30], {x: 58, y: -19}]
        this.calculateInterpretationOne(this.calculateInterpretationTwo);

        return [this.styles_interpretation_one, this.styles_interpretation_two];
    }
}
