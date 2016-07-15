/**
 * Created by lucas on 7/15/16.
 */
import DOMElements from './DOMElements';

const range = require('lodash/range');

export default class Table {

    static writeInferredValues (inferredValues, table, header, datatypes) {

        let thead = $(table).find("thead"),
            tbody = $(table).find("tbody"),
            headerRow = DOMElements.new("tr");

        // Build the header row of the table
        $.each(header, (index, val) => {
            $(headerRow).append(DOMElements.new("th", {text: val, class: "text-center"}));
        });

        $(thead).append(headerRow);

        let rowSelects = DOMElements.new("tr", {id: "inferredType"});

        // Create all select's
        $.each(range(header.length), (index) => {

            let select = DOMElements.new("select", {id: `inferredValues-${index}`});

            // For each available option
            $.each(datatypes, function(inner_index, val) {
                select.append(DOMElements.new("option", {text: val, value: val}));
            });

            let td = DOMElements.new("td");

            td.append(select);

            rowSelects.append(td);

        });

        $(tbody).append(rowSelects);

        // Select the infered value for each given column
        $.each(inferredValues, (index, val) => {

            $($('#inferredType').find('select')[index]).val(val);
        });

    }

}