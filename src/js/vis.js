/**
 * Created by lucas on 7/15/16.
 */
import Utilities from './modules/Utilities';
import DOMElements from './modules/DOMElements';
import DefaultValues from './modules/DefaultValues';

global.$ = global.jQuery = require('jquery');

let tr = DOMElements.new("tr");
let th = DOMElements.new("th", {text: "cool", id: "myid", class: "btn btn-default"});

// alert(DefaultValues.MAX_COLS)

$(document).ready(function() {
    console.log(tr);
    console.log(th);
    tr.append(th);
    $('thead').append(tr);
});

let header = "col1, col2"
let content = ["1,2","3,4"];
let delimiter = DefaultValues.DELIMITER;

global.inferValue = Utilities.inferValue;

console.log(Utilities.csvToJSON(header, content, delimiter))