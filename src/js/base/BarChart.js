/**
 * Created by lucas on 9/19/16.
 */
import VisualizationTechnique from './VisualizationTechnique';

const d3 = require('d3');
const WIDTH = 640;
const HEIGHT = 480;

export default class BarChart extends VisualizationTechnique {

    properties () {

        this._x = null;
        this._y = null;
        this._xAxis = null;
        this._yAxis = null;
        this._xAxisContainer = null;
        this._yAxisContainer = null;
        // TODO pertence a visualization technique
        this._margin = {top: 30, right: 10, bottom: 20, left: 20};
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

        this._y = d3.scaleLinear()
            .range([this._height, 0]);

        this._x = d3.scaleBand()
            .padding(.3)
            .rangeRound([0, this._width]);

        this._xAxis = d3.axisBottom(this._x);

        this._yAxis = d3.axisLeft(this._y);

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

    sort (value) {
        //FIXME
        let t = d3.transition().duration(750),
            delay = function(d, i) { return i * 50; };


        switch(value) {

            case "nameASC":
                this._data.sort(function(a, b) { return d3.ascending(a.key, b.key); });
                break;

            case "nameDSC":
                this._data.sort(function(a, b) { return d3.descending(a.key, b.key); });
                break;

            case "valueASC":
                this._data.sort(function(a, b) { return a.value - b.value; });
                break;

            case "valueDSC":
                this._data.sort(function(a, b) { return b.value - a.value; });
                break;

            case "groupASC":
                this._data.sort(function(a, b) { return d3.ascending(a.group, b.group); });
                break;

            case "groupDSC":
                this._data.sort(function(a, b) { return d3.descending(a.group, b.group); });
                break;

            default:
                break;
        }


        let y0 = this._y.domain(this._data.map(d => d.key))
            .copy();

        this._svg.transition(t).selectAll(".bar")
            .delay(delay)
            .attr("y", d => y0(d.key) );

        this._yAxisContainer.transition(t)
            .call(this._yAxis)
            .selectAll("g")
            .delay(delay);
    }

    update(data) {

        // TODO t sera chamado de transition e mudar para VisualizationTechnique
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
            .attr("y", (this._height / 2))
            .style("fill-opacity", "#CCCCCC")
            .style("fill-opacity", 1e-6)
            .remove();

        // this._margin.left = this.longestLabelSize(data.map(function(d) { return d.key; }));
        this._width = WIDTH - this._margin.left - this._margin.right;
        this._height = HEIGHT - this._margin.top - this._margin.bottom;

        this._svgCanvas
            .attr("viewBox", "0 0 " + (this._width + this._margin.left + this._margin.right) +
                " "	+ (this._height + this._margin.top + this._margin.bottom));

        this._svgMargin.attr("transform", "translate(" + (this._margin.left) + "," + (this._margin.top) + ")");

        this._x.rangeRound([0, this._width])
            .domain(this._data.map(function(d){ return d.key; }));

        this._y.range([this._height, 0])
            .domain([0, d3.max(this._data, function(d) { return d.value; })]);

        this._color.domain(this._data.map(function(d) { return d.group || null; }));

        // UPDATE old elements present in new data.
        bar.attr("height", function(d) {return this._height - this._y(d.value)}).transition(t)
            .attr("width", (function(d) { return  this._x.bandwidth() }).bind(this))
            .attr("y", (function(d) { return this._y(d.value); }).bind(this))
            .style("fill", (function(d) { return (d.group) ? this._color(d.group) : this._defaultColor; }).bind(this));

        // ENTER new elements present in new data.
        bar.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("height", function(d) { return this._height - this._y(d.value)})
            .attr("width", this._x.bandwidth())
            .attr("y", (function(d) { return this._y(d.value)}).bind(this))
            .style("fill", (function(d) { return (d.group) ? this._color(d.group) : this._defaultColor; }).bind(this))
            .transition(t).delay(delay)
            .attr("x", function(d) { return this.x(d.key)})
            .attr("width", (function(d) { return  this._x.bandwidth(); }).bind(this));

        this._xAxisContainer.transition(t)
            .call(this._xAxis);

        this._yAxisContainer.transition(t)
            .call(this._yAxis);

    }


}