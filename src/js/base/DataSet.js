/**
 * Created by lucas on 7/16/16.
 */

export default class DataSet {


    constructor(path, format) {

        this.rowData = null;
        this.rows = null;
        this.columns = null;
        this.format = format;
        this.path = path;
        this.dimensions = []; // must be an array of Dimension

    }
}