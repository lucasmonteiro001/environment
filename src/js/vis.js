/**
 * Created by lucas on 7/15/16.
 */
import Utilities from './modules/Utilities';
import DefaultValues from './modules/DefaultValues';
import Table from './modules/Table';
import DataSet from './base/DataSet';
import Dimension from './base/Dimension';
import HorizontalBar from './base/HorizontalBar';
import BarChart from './base/BarChart';

const d3 = require('d3');

let familyMembers = ['Jon', 'James', 'Robert', 'Mary'];

familyMembers = familyMembers.map(function(member, i) {
    return {key: member, value: i + 1};
});


global.$ = global.jQuery = require('jquery');

global.hierarchicalObj = [];


$(document).ready(function () {


    let barras =  new HorizontalBar("#container-visualizacao", familyMembers);

    global.ordenaValueDSC = function ordenaValueDSC() { barras.sort("valueDSC"); }
    global.ordenaValueASC = function ordenaValueASC() { barras.sort("valueASC"); }
    global.ordenaNameDSC = function ordenaNameDSC() {	barras.sort("nameDSC");	}
    global.ordenaNameASC =  function ordenaNameASC() {	barras.sort("nameASC");	}

    // d3.interval(function () {
    //
    //     familyMembers = ['Jon', 'James', 'Robert', 'Mary'];
    //     familyMembers = familyMembers.map(function(member, i) {
    //         return {key: member, value: Math.floor(Math.random() * (10 - 0)) + 0};
    //     });
    //
    //     x.update(familyMembers);
    //
    // }, 1500);
});

let dataSet = null;

global.dataSet = dataSet;

$(document).ready(() => {

    const monitorEvents = () => {

        // Monitor select changing
        $('#inferredType').find('select').change((e) => {

            let select = e.target,
                id = select.id,
                index = id.split("-")[1];

            // Update inferredValues with new selected value from select menu
            dataSet.inferredValues[index] = select.value;

            $('.hierarchicalRow').remove();
            $('.isHierarchical').find('[type="checkbox"]')[0].checked = false;
        });

        // Monitor for hierarchical data selected from the user
        $('.isHierarchical').find('[type="checkbox"]').change( (e) => {

                let checkbox = e.target;

                // If checkbox is selected
                if(checkbox.checked) {

                    Table.writeHierarchicalRow(global.header, global.inferredValues);

                    console.warn("TBD!");
                    return false;

                    $('#genHierarchicalObj').click( () => {

                        let correctValues = Utilities.getCorrectValuesOnly(global.content, global.errors);
                        console.log(correctValues);
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

            // Object to read from file
            let reader = new FileReader(),
                file = e.target.files.item(0);

            reader.readAsText(file);

            // After loading the file
            reader.onload = (evt) => {

                // Get lines from csv
                let csvval = evt.target.result.split("\n"),
                    header = Utilities.split(csvval[0], DefaultValues.DELIMITER);

                if(!Utilities.isLessThan(header, DefaultValues.MAX_COLS, DefaultValues.DELIMITER)) {
                    alert('File\'s columns should not exceed 10! ');
                    return false;
                }

                dataSet = new DataSet(file.name, file.type);

                // TODO Check if global variable below is needed
                global.dataSet = dataSet;

                dataSet.rawRowData = evt.target.result;
                dataSet.rows = csvval.length;
                dataSet.rowData = Utilities.splitAll(csvval, DefaultValues.DELIMITER);
                dataSet.columns = header.length;

                // Free up space
                csvval = null;

                Table.writeInferredValues(dataSet.inferredValues, table, dataSet.header, DefaultValues.DATA_TYPES);

                // coloca um checkbox para opcao de dados hierarquicos
                Table.drawHierarchicalCheckbox();

                let res = Utilities.getErrorsAndInferredValues(dataSet.inferredValues, dataSet.data);

                dataSet.inferredValues = res.inferredValues;

                Utilities.updateSelectValues(dataSet.inferredValues);

                Table.writeInvalidRows(res.errors, dataSet.data);

                Table.writeValidRows(res.errors, dataSet.data);

                monitorEvents();

            };
        }
    });
});