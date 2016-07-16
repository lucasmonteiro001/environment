/**
 * Created by lucas on 7/16/16.
 */
import VisualizationTechnique from './VisualizationTechnique';

export default class QuantitativeDisplay extends VisualizationTechnique {

    properties() {
        this._x = null;
        this._y = null;
        this._ticksX = null;
        this._ticksY = null;
    }


    constructor() {

        super();
        this.properties();

    }

    set x (x) {

        x = parseInt(x);

        if(isNaN(x)) {
            throw "{x} should be an Integer";
        }

        this._x = x;
    }

    get x () {
        return this._x;
    }

    set y (y) {

        y = parseInt(y);

        if(isNaN(y)) {
            throw "{y} should be an Integer";
        }

        this._y = y;
    }

    get y () {
        return this._y;
    }

    set ticksX (ticksX) {

        ticksX = parseInt(ticksX);

        if(isNaN(ticksX)) {
            throw "{ticksX} should be an Integer";
        }

        this._ticksX = ticksX;
    }

    get ticksX () {
        return this._ticksX;
    }

    set ticksY (ticksY) {

        ticksY = parseInt(ticksY);

        if(isNaN(ticksY)) {
            throw "{ticksY} should be an Integer";
        }

        this._ticksY = ticksY;
    }

    get ticksY () {
        return this._ticksY;
    }

}