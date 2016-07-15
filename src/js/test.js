/**
 * Created by lucas on 7/10/16.
 */

"use strict";

import BarChart from './barChart/BarChart';

global.$ = global.jQuery = require('jquery'); // Defines jquery globally

let b = new BarChart();

b.print();
