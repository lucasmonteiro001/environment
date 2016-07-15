
global.$ = global.jQuery = require('jquery'); // Defines jquery globally

export default class Utilities {

    /**
     * Compare 3 different things in this method:
     * If val is a Number, checks if {val} < {compareTo}
     * If val is a String, split is by {compareTo} or ',' and compare the size of the create array against {compareTo}
     * If val is an Array, compare its size against compareTo
     * @param val
     * @param compareTo
     * @param delimiter
     * @returns {boolean}
     */
    static isLessThan (val, compareTo, delimiter) {

        if(isNaN(compareTo)) {
            throw "{compareTo} must be a Number";
        }

        if(typeof val === "string") {

            delimiter || (delimiter = ",");

            var length = val.split(delimiter).length;

            if(length < compareTo) {
                return true;
            }
            else {
                return false;
            }
        }
        else if ($.isArray(val)){
            return val.length < compareTo;
        }
        else {
            return val < compareTo;
        }

    }

    /**
     * Return only values from {content} that do not belong to {errors}
     * @param content must be an Array
     * @param errors must be a Set
     * @returns an array of correct values
     */
    static getCorrectValuesOnly (content, errors) {

        return content.filter(function(val, i) {
            return errors.has(i);
        });
    }

    /**
     * Get an object containing Errors and the Infered Values from {content}
     * @param inferedValues
     * @param content
     * @param delimiter
     */
    static getErrorsAndInferedValues (inferedValues, content, delimiter) {
        throw "TBD";
    }

}