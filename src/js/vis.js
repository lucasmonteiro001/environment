/**
 * Created by lucas on 7/15/16.
 */
import Utilities from './modules/Utilities';
import DefaultValues from './modules/DefaultValues';
import Table from './modules/Table';
import Dimension from  './base/Dimension';
import VisualizationTechnique from  './base/VisualizationTechnique';
import QuantitativeDisplay from  './base/QuantitativeDisplay';

let d = new Dimension('ola', 'temporal');
let v = new VisualizationTechnique();
v.dataSet = [d];

console.log(d);
console.log(v);


let q = new QuantitativeDisplay();

console.log(q)

global.$ = global.jQuery = require('jquery');

global.splitAll = Utilities.splitAll;

global.inferredValues = [];
global.hierarchicalObj = [];
global.errors = null;
global.header = null;
global.content = null;

$(document).ready(() => {

    const monitorEvents = () => {

        // Monitor select changing
        $('#inferredType').find('select').change((e) => {

            let select = e.target,
                id = select.id,
                index = id.split("-")[1];

            // Update inferredValues with new selected value from select menu
            global.inferredValues[index] = select.value;

            $('.hierarchicalRow').remove();
            $('.isHierarchical').find('[type="checkbox"]')[0].checked = false;
        });

        // Monitor for hierarchical data selected from the user
        $('.isHierarchical').find('[type="checkbox"]').change( (e) => {

                let checkbox = e.target;

                // If checkbox is selected
                if(checkbox.checked) {

                    Table.writeHierarchicalRow(global.header, global.inferredValues);

                    throw "TBD!";

                    $('#genHierarchicalObj').click( () => {

                        let correctValues = Utilities.getCorrectValuesOnly(global.content, global.errors);
                        console.log(correctValues)
                        let csv = Utilities.csvToJSON(global.header, correctValues, DefaultValues.DELIMITER),
                            teste = {},
                            groupBy = [],
                            count = 0,
                            row = $('.hierarchicalRow').find('select'),
                            root;

                        console.log(row);

                        $.each(row, (i, val) => {

                            let selectedValue = $(val).val(),
                                headerName = $(val).attr("value");

                            if(selectedValue !== '#') {

                                groupBy.push(selectedValue);
                                teste[global.header.indexOf($(val).parent().text().split("#")[0])] = global.header.indexOf(selectedValue);
                            } else {

                                root = global.header.indexOf($(val).parent().text().split("#")[0]);
                            }
                        });

                        let g = [];

                        console.log(teste);
                        console.log(g);

                        // se groupBy nao for vazio
                        if(groupBy !== []) {

                            let groups = groupBy.map( (val) => {
                                return '.key(function(d) { return d.' + val + ';})';
                            });

                            let nest = 'return ' + 'd3.nest()' + groups.join('') + '.entries(' + JSON.stringify(csv) + ')',
                                f = new Function(nest);

                            console.log(f);
                            console.log(f());

                        }

                    });

                }
                else {

                    $('.hierarchicalRow').remove();
                }
        });
    };

    $("#csvFile").change((e) => {

        let table = $("table"),
            thead = $(table).find("thead"),
            tbody = $(table).find("tbody"),
            fileExtension = $("input#csvFile").val().split(".").pop().toLowerCase();

        // Accepts only csv files
        if($.inArray(fileExtension, ["csv"]) === -1) {
            alert('Upload CSV');
            return false;
        }

        // After reading the file
        if (e.target.files !== undefined) {

            $(thead).empty();
            $(tbody).empty();
            global.inferredValues = [];

            // Object to read from file
            let reader = new FileReader();

            reader.readAsText(e.target.files.item(0));

            // After loading the file
            reader.onload = (evt) => {

                // obtem o array com as linhas do csv
                let csvval = evt.target.result.split("\n"),
                    header = csvval[0];

                if(!Utilities.isLessThan(header, DefaultValues.MAX_COLS, DefaultValues.DELIMITER)) {
                    alert('File\'s columns should not exceed 10! ');
                    return false;
                }

                global.header = Utilities.split(header, DefaultValues.DELIMITER);

                // Get all lines but header
                global.content = csvval.slice(1, csvval.length);

                // Free up space
                csvval = null;

                // Get first line of content from csv file
                var firstLine = global.content[0];

                if(firstLine) {

                    let line = firstLine.split(DefaultValues.DELIMITER);

                    // Infer values from first line
                    global.inferredValues = Utilities.inferValues(line);
                } else {

                    return false;
                }

                Table.writeInferredValues(global.inferredValues, table, global.header, DefaultValues.DATA_TYPES);

                // coloca um checkbox para opcao de dados hierarquicos
                Table.drawHierarchicalCheckbox();

                global.content = Utilities.splitAll(global.content, DefaultValues.DELIMITER);

                let res = Utilities.getErrorsAndInferredValues(global.inferredValues, global.content);

                global.errors = res.errors;
                global.inferredValues = res.inferredValues;

                Utilities.updateSelectValues(global.inferredValues);

                Table.writeInvalidRows(global.errors, global.content);

                Table.writeValidRows(global.errors, global.content);

                monitorEvents();

            };
        }
    });
});