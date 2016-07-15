
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

    /**
     * Converts a CSV to JSON
     * @param header is the csv header, must be an string delimited by {delimiter}
     * @param content is the csv content, must be an array where each position represents a line, this position
     * should contain a string delimited by {delimiter}
     * @param delimiter of the csv lines
     * @returns {Array|*}
     */
    static csvToJSON (header, content, delimiter) {

        // recebe uma string e faz virar um array
        let keys = header.split(delimiter);

        // obtem o array de objetos
        let json = content.map(function(val, i) {

            val = val.split(delimiter);

            let obj = {};

            // cria o objeto com suas propriedades
            $.each(val, function(index, value) {
                obj[keys[index].trim()] = value;
            });

            return obj;

        });

        return json;
    };

    static inferValue (val) {

        let inferedValue = null,
            val_aux = Number(val);

        // If val is a string, get rid of leading and trailing '"'
        if(val[0] === '"' && val[val.length - 1] === '"') {
            val_aux = Number(val.substring(1, val.length - 1));
        }

        // If val is a Number
        if(val_aux !== undefined && !isNaN(val_aux)) {

            // Check if val is Integer
            if((val_aux % 10).toString().indexOf(".") == -1) {
                inferedValue = "integer";
            }
            // Check if val is Real
            else if((val_aux % 10).toString().indexOf(".") >= 0) {
                inferedValue = "real";
            }
            else {
                inferedValue = undefined;
            }
        }
        else { // If val is not a number

            // TODO use momentjs library to make this cast
            val_aux = new Date(val);

            // Check if val is a Date
            if(val_aux.getDate()) {
                inferedValue = "Date";
            }
            // Get rid of leading and trailing '"'
            else if(val_aux[0] === '"' && val_aux[val.length - 1] === '"') {
                val_aux = new Date(val.substring(1, val.length - 1));
            }

            // If val is a date
            if(val_aux.getDate()) {
                inferedValue = "Date";
            }
            // If none of the above checks matched, infer that val is a string
            else {
                inferedValue = "string";
            }
        }
        return inferedValue;
    };

}