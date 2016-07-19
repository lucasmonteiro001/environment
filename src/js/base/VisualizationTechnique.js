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
        this._dataSet = null;
        this._width = WIDTH_CONVENTION_D3;
        this._height = HEIGHT_CONVENTION_D3;
        this._marginTop = MARGIN_CONVENTION_D3.top;
        this._marginRight = MARGIN_CONVENTION_D3.right;
        this._marginBottom = MARGIN_CONVENTION_D3.bottom;
        this._marginLeft = MARGIN_CONVENTION_D3.left;
        this._svg = null;
    }

    static get nextId() {

        return ID_COUNTER + 1;

    }

    /**
     *
     * @param container is a string
     * @param dataSet is an array of Dimension
     */
    constructor(container = "", dataSet = []) {

        this.properties();
        this.container = container;
        this.dataSet = dataSet;

    }

    set id(id) {
        throw "Setting up new id is not supported!";
        // this._id = id.toString().trim();
    }

    get id () {
        return this._id;
    }

    set container (container) {
        this._container = container.toString().trim();
    }

    get container () {
        return this._container;
    }

    set width (width) {

        width = parseInt(width);

        if(isNaN(width)) {
            throw "{width} should be an Integer";
        }

        this._width = width;
    }

    get width () {
        return this._width;
    }

    set height(height) {

        height = parseInt(height);

        if(isNaN(height)) {
            throw "{height} should be an Integer";
        }

        this._height = height;
    }

    get height () {
        return this._height;
    }

    set marginTop(marginTop) {

        marginTop = parseInt(marginTop);

        if(isNaN(marginTop)) {
            throw "{marginTop} should be an Integer";
        }

        this._marginTop = marginTop;
    }

    get marginTop () {
        return this._marginTop;
    }

    set marginRight(marginRight) {

        marginRight = parseInt(marginRight);

        if(isNaN(marginRight)) {
            throw "{marginRight} should be an Integer";
        }

        this._marginRight = marginRight;
    }

    get marginRight () {
        return this._marginRight;
    }

    set marginBottom(marginBottom) {

        marginBottom = parseInt(marginBottom);

        if(isNaN(marginBottom)) {
            throw "{marginBottom} should be an Integer";
        }

        this._marginBottom = marginBottom;
    }

    get marginBottom () {
        return this._marginBottom;
    }

    set marginLeft(marginLeft) {

        marginLeft = parseInt(marginLeft);

        if(isNaN(marginLeft)) {
            throw "{marginLeft} should be an Integer";
        }

        this._marginLeft = marginLeft;
    }

    get marginLeft () {
        return this._marginLeft;
    }

    set svg(svg) {
        this._svg = svg.toString().trim();
    }

    get svg () {
        return this._svg;
    }

    /**
     *
     * @param dataSet must be an array of Dimension
     */
    set dataSet(dataSet) {

        if(!Array.isArray(dataSet)) {
            throw "{dataSet} must be an array!";
        }

        // Check if elements in {dataSet} are Dimension objects
        dataSet.forEach((el) => {
            // Throw exception if element does not belong to class Dimension
            if(el.constructor.name !== "Dimension") {
                throw "Every dataSet's object should have the Dimension Class";
            }
        });

        this._dataSet = dataSet;
    }

    get dataSet () {
        return this._dataSet;
    }

    update () {
        throw "Unsupported operation!";
    }

}