/**
 * Created by lucas on 7/15/16.
 */
import Utilities from './modules/Utilities';
import DefaultValues from './modules/DefaultValues';
import Table from './modules/Table';

global.$ = global.jQuery = require('jquery');

global.inferredValues = [];
global.hierarchicalObj = [];
global.errors;

$(document).ready(() => {

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

                header = Utilities.split(header, DefaultValues.DELIMITER);

                // Get all lines but header
                let content = csvval.slice(1, csvval.length);

                // Free up space
                csvval = null;

                // Get first line of content from csv file
                var firstLine = content[0];

                if(firstLine) {

                    let line = firstLine.split(DefaultValues.DELIMITER);

                    // Infer values from first line
                    global.inferredValues = Utilities.inferValues(line);
                } else {

                    return false;
                }

                Table.writeInferredValues(global.inferredValues, table, header, DefaultValues.DATA_TYPES);

                // coloca um checkbox para opcao de dados hierarquicos
                Table.drawHierarchicalCheckbox();

                return false;

                // monitora o valor do tipo inferido
                $('#tipoInferido').find('select').change(function(e) {
                    var select = e.target;
                    var id = select.id;
                    // limpa o lixo na id
                    var index = id.split("-")[1];
                    inferedValues[index] = select.value;
                    $('.hierarchicalRow').remove();
                    $('.isHierarchical').find('[type="checkbox"]')[0].checked = false;
                });

                // monitora se o valor eh clicado ou nao
                $('.isHierarchical').find('[type="checkbox"]')
                    .change(function(e) {

                        var checkbox = e.target;
                        if(checkbox.checked) {

                            tbl.writeHierarchicalRow(table, header, inferedValues, defaultValues.DELIMITER);

                            $('#genHierarchicalObj').click(function(e) {
                                // obtem apenas os valores corretos
                                var correctValues = utilities.getCorrectValuesOnly(content, errors);
                                // obtem os json dos valores corretos
                                var csv = converter.csvToJSON(header, correctValues, defaultValues.DELIMITER);
                                // gera a funcao do d3.nest()
                                var teste = {};
                                var groupBy = [];
                                var count = 0;
                                var row = $('.hierarchicalRow').find('select');
                                var root;
                                $.each(row, function(i,val){
                                    var selectedValue = $(val).val();
                                    var headerName = $(val).attr("value");

                                    if(selectedValue !== '#') {
                                        groupBy.push(selectedValue);
                                        // quem liga em quem
                                        // teste[i] = header.split(";").indexOf(selectedValue);
                                        teste[header.split(";").indexOf($(val).parent().text().split("#")[0])] = header.split(";").indexOf(selectedValue);
                                    } else {

                                        root = header.split(";").indexOf($(val).parent().text().split("#")[0]);
                                    }

                                })

                                var g = [];
                                console.log(root);
                                // var root = teste['#'];
                                // // adiciona o primeiro elemento
                                // g.push(root);
                                // for(var i = 0; i < ($('.hierarchicalRow').find('select').length; i++) {
                                //     g.push(teste[i], 0, )
                                // }




                                console.log(teste);
                                console.log(g);

                                // se groupBy nao for vazio
                                if(groupBy !== []) {
                                    var groups = groupBy.map(function(val, i){
                                        return '.key(function(d) { return d.' + val + ';})';
                                    });
                                    var nest = 'return ' + 'd3.nest()' + groups.join('') + '.entries(' + JSON.stringify(csv) + ')';

                                    var f = new Function(nest);
                                    console.log(f);
                                    console.log(f());

                                }

                            });
                        }
                        else {
                            $('.hierarchicalRow').remove();
                        }
                    });

                var res = utilities.getErrorsAndInferedValues(inferedValues, content, defaultValues.DELIMITER);

                errors = res.errors;
                inferedValues = res.inferedValues;

                tbl.writeErrors(table, errors, content, defaultValues.DELIMITER);
                tbl.writeDataButErrors(table, errors, content, defaultValues.DELIMITER);

                // precisa de mudar o valor dos dropdowns com os novos valores inferidos
                // seleciona o tipo inferido
                $.each(inferedValues, function(index, val) {
                    $($('select')[index]).val(val);
                });

            };


        }

    });

});