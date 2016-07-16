/**
 * Created by lucas on 7/16/16.
 */
export default class VisualizationTechnique {

    /**
     * Define all class properties
     */
    properties() {

        this._id = null;
        this._id = null;
        this._container = null;
        this._width = null;
        this._height = null;
        this._marginTop = null;
        this._marginRight = null;
        this._marginBottom = null;
        this._marginLeft = null;
        this._svg = null;
        this._container = null;
        this._dataSet = null;
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

    set id( id) {
        this._id = id.toString().trim();
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