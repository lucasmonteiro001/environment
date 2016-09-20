/**
 * Created by lucas on 7/16/16.
 */

/**
 * This is the id given to a Visualization Technique when it is first instantiated
 * @type {number}
 */
let ID_COUNTER = 0;

/**
 * The following conventions were extracted from https://bl.ocks.org/mbostock/3019563
 */
const MARGIN_CONVENTION_D3 = {top: 20, right: 10, bottom: 20, left: 10},
    WIDTH_CONVENTION_D3 = 960 - MARGIN_CONVENTION_D3.left - MARGIN_CONVENTION_D3.right,
    HEIGHT_CONVENTION_D3 = 500 - MARGIN_CONVENTION_D3.top - MARGIN_CONVENTION_D3.bottom;

export default class VisualizationTechnique {

    /**
     * Define all class properties
     */
    properties() {

        this._id = VisualizationTechnique.nextId; // should be automatically generated
        ID_COUNTER = ID_COUNTER + 1;

        this._container = null;
        this._data = null;
        this._width = WIDTH_CONVENTION_D3;
        this._height = HEIGHT_CONVENTION_D3;
        this._marginTop = MARGIN_CONVENTION_D3.top;
        this._marginRight = MARGIN_CONVENTION_D3.right;
        this._marginBottom = MARGIN_CONVENTION_D3.bottom;
        this._marginLeft = MARGIN_CONVENTION_D3.left;
        this._svg = null;
        this._svgCanvas = null;
        this._svgMargin = null;
        this._pallete = null;
        this._defaultColor = null;
        this._color = null;
    }

    static get nextId() {

        return ID_COUNTER + 1;

    }

    /**
     *
     * @param container is a string
     * @param data is an array of Dimension
     */
    constructor(container = "", data = []) {

        this.properties();

        this.container = container;
        this.data(data);

    }

    id(id) {

        if (!arguments.length) {
            return this._id;
        }

        throw "Setting up new id is not supported!";
    }

    /**
     * Container should be a valid location.
     * Possible values: [body, id, class]
     * id should start with # and class with dot (.)
     * @param container
     */
    container (container) {

        if (!arguments.length) {
            return this._container;
        }

        container = container.toString().trim();

        if(container !== "body") {
            if(container[0] !== "#" && container[0] !== ".") {
                if(container.length < 2) {
                    throw "Container should be either body, or a element starting with # or .";
                }
            }
        }

        console.warn("jQuery element selection not supported yet for container binding!");

        this._container = container;
    }

    svgCanvas (svgCanvas) {

        if (!arguments.length) {
            return this._svgCanvas;
        }

        this._svgCanvas = svgCanvas;
    }

    svgMargin (svgMargin) {

        if (!arguments.length) {
            return this._svgMargin;
        }

        this._svgMargin = svgMargin;
    }

    pallete (pallete) {

        if (!arguments.length) {
            return this._pallete;
        }

        this._pallete = pallete;
    }

    defaultColor (defaultColor) {

        if (!arguments.length) {
            return this._defaultColor;
        }

        this._defaultColor = defaultColor;
    }

    color (color) {

        if (!arguments.length) {
            return this._color;
        }

        this._color = color;
    }

    width (width) {

        if (!arguments.length) {
            return this._width;
        }

        width = parseInt(width);

        if(isNaN(width)) {
            throw "{width} should be an Integer";
        }

        this._width = width;
    }

    height(height) {

        if (!arguments.length) {
            return this._height;
        }

        height = parseInt(height);

        if(isNaN(height)) {
            throw "{height} should be an Integer";
        }

        this._height = height;
    }

    marginTop (marginTop) {

        if (!arguments.length) {
            return this._marginTop;
        }

        marginTop = parseInt(marginTop);

        if(isNaN(marginTop)) {
            throw "{marginTop} should be an Integer";
        }

        this._marginTop = marginTop;
    }

    marginRight(marginRight) {

        if (!arguments.length) {
            return this._marginRight;
        }

        marginRight = parseInt(marginRight);

        if(isNaN(marginRight)) {
            throw "{marginRight} should be an Integer";
        }

        this._marginRight = marginRight;
    }

    marginBottom(marginBottom) {

        if (!arguments.length) {
            return this._marginBottom;
        }

        marginBottom = parseInt(marginBottom);

        if(isNaN(marginBottom)) {
            throw "{marginBottom} should be an Integer";
        }

        this._marginBottom = marginBottom;
    }

    marginLeft (marginLeft) {

        if (!arguments.length) {
            return this._marginLeft;
        }

        marginLeft = parseInt(marginLeft);

        if(isNaN(marginLeft)) {
            throw "{marginLeft} should be an Integer";
        }

        this._marginLeft = marginLeft;
    }

    svg (svg) {

        if (!arguments.length) {
            return this._svg;
        }

        this._svg = svg;
    }

    /**
     *
     * @param data must be an array of Dimension
     */
    data (data) {

        if (!arguments.length) {
            return this._data;
        }

        if(!Array.isArray(data)) {
            throw "{data} must be an array!";
        }

        // // Check if elements in {dataSet} are Dimension objects
        // data.forEach((el) => {
        //     // Throw exception if element does not belong to class Dimension
        //     if(el.constructor.name !== "Dimension") {
        //         throw "Every dataSet's object should have the Dimension Class";
        //     }
        // });

        this._data = data;
    }

    update () {
        throw "Unsupported operation!";
    }

}