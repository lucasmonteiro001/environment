/**
 * Created by lucas on 7/16/16.
 */
import DataType from './DataType';

export default class Dimension {

    properties() {

        this._data = null;
        this._dataType = null;

    }

    constructor (data = "", dataType = "") {

        this.properties();

        if(data === "" || dataType === "") {
            throw "{data} and {dataType} are required";
        }

        this.data = data;
        this.dataType = dataType;
    }

    set data (data) {
        this._data = data;
    }

    get data() {
        return this._data;
    }

    set dataType (dataType) {

        if(!DataType.isDataType(dataType)) {
            throw "Allowed data types: " + DataType.getAllowedDataTypes();
        }

        this._dataType = dataType;
    }

    get dataType () {
        return this._dataType;
    }

    count () {
        throw "Unsupported operation!";
    }

    max () {
        throw "Unsupported operation!";
    }

    min () {
        throw "Unsupported operation!";
    }

    sum () {
        throw "Unsupported operation!";
    }

    mean () {
        throw "Unsupported operation!";
    }

    median () {
        throw "Unsupported operation!";
    }

    quantile () {
        throw "Unsupported operation!";
    }

    variance () {
        throw "Unsupported operation!";
    }

    deviation () {
        throw "Unsupported operation!";
    }


}