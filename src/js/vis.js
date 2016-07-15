/**
 * Created by lucas on 7/15/16.
 */
import Utilities from './modules/Utilities';
import DOMElements from './modules/DOMElements';

global.$ = global.jQuery = require('jquery');

let tr = DOMElements.new("tr");
let th = DOMElements.new("th", {text: "cool", id: "myid", class: "btn btn-default"});

$(document).ready(function() {
    console.log(tr);
    console.log(th);
    tr.append(th);
    $('thead').append(tr);
});