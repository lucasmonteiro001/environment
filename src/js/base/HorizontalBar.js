/**
 * Created by lucas on 9/19/16.
 */
import VisualizationTechnique from './VisualizationTechnique';

const d3 = require('d3');
const WIDTH = 640;
const HEIGHT = 480;

export default class HorizontalBar extends VisualizationTechnique {

    properties () {

        this._x = null;
        this._y = null;
        this._xAxis = null;
        this._yAxis = null;
        this._xAxisContainer = null;
        this._yAxisContainer = null;
        this._margin = {top: 30, right: 10, bottom: 20, left: 10};
        this._width = WIDTH - this._margin.left - this._margin.right;
        this._height = HEIGHT - this._margin.top - this._margin.bottom;
    }

    constructor(container, data) {

        super(container, data);

        this.properties();

        this._svgCanvas = d3.select(container).append("svg")
            .attr("preserveAspectRatio", "xMinYMin meet");

        this._svgMargin = this._svgCanvas.append("g")
            .attr("class", "margin");

        this._svg = this._svgMargin.append("g")
            .attr("class", "display");

        this._x = d3.scaleLinear()
            .range([0, this._width]);

        this._y = d3.scaleBand()
            .padding(.3)
            .rangeRound([0, this._height]);

        this._xAxis = d3.axisTop(this._x)
            .ticks(4)
            .tickSize(-this._height);

        this._yAxis = d3.axisLeft(this._y)
            .ticks(0)
            .tickSize(0);

        this._xAxisContainer = this._svgMargin.append("g")
            .attr("class", "x axis");

        this._yAxisContainer = this._svgMargin.append("g")
            .attr("class", "y axis");

        this._pallete = ['#EFB605', '#E79B01', '#E35B0F', '#DD092D', '#C50046', '#A70A61', '#892E83',
            '#604BA2', '#2D6AA6', '#089384', '#25AE64', '#7EB852', '#404040'];

        this._pallete.sort(function(a, b) { return d3.hsl(b).h - d3.hsl(a).h; });

        this._defaultColor = "#45B6C5";

        this._color = d3.scaleOrdinal()
            .range(this._pallete);

        this.update(this._data);

    }

    x (x) {

        if (!arguments.length) {
            return this._x;
        }

        this._x = x;
    }

    y (y) {

        if (!arguments.length) {
            return this._y;
        }

        this._y = y;
    }

    xAxis (xAxis) {

        if (!arguments.length) {
            return this._xAxis;
        }

        this._xAxis = xAxis;
    }

    yAxis (yAxis) {

        if (!arguments.length) {
            return this._yAxis;
        }

        this._yAxis = yAxis;
    }

    width (value) {

        if (!arguments.length) {
            return this._width;
        }

        this._width = value - this._margin.left - this._margin.right;
        this._svgCanvas.attr("viewBox", "0 0 " + (this._width + this._margin.left + this._margin.right) +
            " " + (this._height + this._margin.top + this._margin.bottom));
    }

    height (value) {

        if (!arguments.length) {
            return this._height;
        }

        this._height = value - this._margin.top - this._margin.bottom;
        this._svgCanvas.attr("viewBox", "0 0 " + (this._width + this._margin.left + this._margin.right) +
            " "	+ (this._height + this._margin.top + this._margin.bottom));
    }

    xAxisContainer (xAxisContainer) {

        if (!arguments.length) {
            return this._xAxisContainer;
        }

        this._xAxisContainer = xAxisContainer;
    }

    yAxisContainer (yAxisContainer) {

        if (!arguments.length) {
            return this._yAxisContainer;
        }

        this._yAxisContainer = yAxisContainer;
    }

    xScale (value) {

        if (!arguments.length) {
            return this._x;
        }

        this._x = value;
    }

    yScale (value) {

        if (!arguments.length) {
            return this._y;
        }

        this._y = value;
    }

    maxLeftMargin () {
        return WIDTH * 0.5;
    }

    longestLabelSize (labels) {

        let fontSize = parseInt(this._yAxisContainer.style("font-size").substring(0, 2)),
            leftMarginSize = d3.max(labels, function(d) { return d.length; }) * fontSize,
            maxLeftMarginValue = this.maxLeftMargin();

        return (leftMarginSize > maxLeftMarginValue) ? maxLeftMarginValue : leftMarginSize;
    }

    update(data) {

        let t = d3.transition().duration(750),
            delay = function(d, i) { return i * 50; };

        this.data(data);

        // JOIN new data with old elements.
        let bar = this.svg().selectAll(".bar")
            .data(data, function(d) { return d.key; });

        // EXIT
        // Remove old elements as needed.
        bar.exit().attr("class", "exit")
            .transition(t)
            .attr("x", (this.width() / 4))
            .style("fill-opacity", "#CCCCCC")
            .style("fill-opacity", 1e-6)
            .remove();

        // this._margin.left = this.longestLabelSize(data.map(function(d) { return d.key; }));
        this._width = WIDTH - this._margin.left - this._margin.right;
        this._height = HEIGHT - this._margin.top - this._margin.bottom;

        this._svgCanvas
            .attr("viewBox", "0 0 " + (this._width + this._margin.left + this._margin.right) +
                " "	+ (this._height + this._margin.top + this._margin.bottom));

        this._x.range([0, this._width])
            .domain([0, d3.max(this._data, function(d) { return d.value; })]).nice();

        this._y.rangeRound([0, this._height])
            .domain(this._data.map(function(d){ return d.key; }));

        this._color.domain(this._data.map(function(d) { return d.group || null; }));

        // UPDATE old elements present in new data.
        bar.attr("height", this._y.bandwidth()).transition(t)
            .attr("width", (function(d) { return  this._x(d.value); }).bind(this))
            .attr("y", (function(d) { return this._y(d.key); }).bind(this))
            .style("fill", (function(d) { return (d.group) ? this._color(d.group) : this._defaultColor; }).bind(this));

        // ENTER new elements present in new data.
        bar.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("height", this._y.bandwidth())
            .attr("width", 0)
            .attr("y", (function(d) { return this._y(d.key); }).bind(this))
            .style("fill", (function(d) { return (d.group) ? this._color(d.group) : this._defaultColor; }).bind(this))
            .transition(t).delay(delay)
            .attr("x", 0)
            .attr("width", (function(d) { return  this._x(d.value); }).bind(this));

        this._xAxisContainer.transition(t)
            .call(this._xAxis);

        this._yAxisContainer.transition(t)
            .call(this._yAxis);

    }


}