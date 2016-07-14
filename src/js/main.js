import Animal from './Animal';
import Person from './Person';

global.$ = global.jQuery = require('jquery'); // Defines jquery globally

// const sum = require('./test');

console.log("cool");
// console.log("Sum: " + sum(2, 3));

// const Animal = require('./Animal');
console.log(Animal);
let a = new Animal("elephant");
let b = new Animal("lioness");
// let a = new Animal("myname");

alert(a.getName() + "\t" + b.getName() + '\t' + Person.PROP);

$(document).ready(function() {
    setTimeout(function () {
        alert('ihullll!');
    }, 3000);
});