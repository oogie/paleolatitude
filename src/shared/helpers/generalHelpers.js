import { helpers, options, XLSX } from "../stdimports.js";


export const generalHelpers = {
    makeLocation: function makeLocation(partial, allLocations) {
        partial = partial || {};
        allLocations = allLocations || [];

        const locationTemplate = {
            id: helpers.general.uuid(),

            status: "loading", //can be "loading", "calculating" (only in bulk entry), "error", "ready"
            selected: false,
            isiploc: false,
            color: selectColor(allLocations),

            coord: {
                lat: undefined,
                lon: undefined,
            },

            age: undefined,
            minAge: undefined,
            maxAge: undefined,

            refFrame: undefined,

            calc: undefined,
            error: undefined,

            sample: undefined
        }

        let fullLocation = helpers.general.merge(locationTemplate, partial);

        fullLocation.coord.lat = parseFloat(fullLocation.coord.lat.toString().replaceAll(",", "."));
        fullLocation.coord.lon = parseFloat(fullLocation.coord.lon.toString().replaceAll(",", "."));

        var decimals = 5;
        fullLocation.coord.lat = Math.round(fullLocation.coord.lat * 10**decimals) / (10**decimals);
        fullLocation.coord.lon = Math.round(fullLocation.coord.lon * 10**decimals) / (10**decimals);

        return fullLocation;

        function selectColor(allLocations) {

            //find a color that is not already used by any other location
            //search in the order that is defined by options.locationColor
            //if all the colors are taken, default to the last defined color (probally black)
            let color;
            for (var i = 0; i < options.locationColor.length; i++) {
                color = options.locationColor[i].label;
                if (allLocations.find((loc) => { return loc.color === color; }) === undefined) {
                    break;
                }
            }

            return color
        }

    },

    //serialize a JSON value.
    //Values NaN, Infinity, -Infinity and undefined will be preserved
    serialize: function(v, space) {
        return JSON.stringify(v, function (key, val) {
            if (typeof val === "number") {
                if (isNaN(val)) return "__SERIALIZED__NaN";
                if (val === Infinity) return "__SERIALIZED__Infinity";
                if (val === -Infinity) return "__SERIALIZED__-Infinity";
            }
            if (val === undefined) return "__SERIALIZED__undefined"
            return val;
        }, space);
    },

    //deserialize a string JSON value.
    //Values NaN, Infinity, -Infinity and undefined will be preserved
    deserialize: function(v) {
        return JSON.parse(v, function (key, val) {
            if (val === "__SERIALIZED__NaN") return NaN;
            if (val === "__SERIALIZED__Infinity") return Infinity;
            if (val === "__SERIALIZED__-Infinity") return -Infinity;
            if (val === "__SERIALIZED__undefined") return undefined;

            return val;
        });
    },

    uuid: function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    //https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable-string
    displayFileSize: function displayFileSize(bytes, si=true, dp=1) {
        const thresh = si ? 1000 : 1024;

        if (Math.abs(bytes) < thresh) {
            return bytes + ' B';
        }

        const units = si
            ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
            : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
        let u = -1;
        const r = 10**dp;

        do {
            bytes /= thresh;
            ++u;
        } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

        return bytes.toFixed(dp) + ' ' + units[u];
    },

    currentTimestamp: function currentTimestamp() {
        return Math.floor(Date.now() / 1000).toString();
    },

    now: function now() {
        return parseInt((new Date).getTime() / 1000).toString()
    },

    tsToLocaleString: function tsToLocaleString(timestamp, options) {
        // var options = options ||
        var options = options || { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }
        var jsTimestamp = parseInt(timestamp) * 1000;
        var date = new Date(jsTimestamp);

        return date.toLocaleString("en-GB", options);
    },

    merge: function merge(/*...arguments*/) {
        // Variables
        let target = {};

        // Merge the object into the target object
        let merger = (obj) => {
            for (let prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    if (Object.prototype.toString.call(obj[prop]) === '[object Object]') {
                        // If we're doing a deep merge and the property is an object
                        target[prop] = generalHelpers.merge(target[prop], obj[prop]);
                    } else {
                        // Otherwise, do a regular merge
                        target[prop] = obj[prop];
                    }
                }
            }
        };

        //Loop through each object and conduct a merge
        for (let i = 0; i < arguments.length; i++) {
            merger(arguments[i]);
        }

        return target;
    },

    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    debounce: function debounce(func, wait, immediate) {
    	var timeout;
    	return function() {
    		var context = this, args = arguments;
    		var later = function() {
    			timeout = null;
    			if (!immediate) func.apply(context, args);
    		};
    		var callNow = immediate && !timeout;
    		clearTimeout(timeout);
    		timeout = setTimeout(later, wait);
    		if (callNow) func.apply(context, args);
    	}
    },

    xmlStr2xmlDoc: function xmlStr2xmlDoc(xmlStr) {
        return new DOMParser().parseFromString(xmlStr, 'text/xml');
    },

    downloadFile: function downloadFile(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    },

    // Lets the user download an xlsx file, parameters:
    // fields: array of objects with properties label and value
    // data: array of objects with properties corresponding to the values of the fields or a parser function
    // entityLabel: string
    // fileformat (optional): string (xlsx or csv)
    downloadXlsx: function (fields, data, entityLabel, fileformat) {
        const opts = { fields, defaultValue: "-" };

        window.setTimeout(() => {
            try {
                var wbName = entityLabel.substring(0, 30); //can be no longer then 31 characters
                var fileName = `${entityLabel}, ${generalHelpers.tsToLocaleString(generalHelpers.now())}.${fileformat ?? "xlsx"}`;
                fileName = fileName.replaceAll(":", "-");


                //Create header row
                var headerRow = {};
                fields.forEach(function (field) {
                    headerRow[field.value] = field.label
                });

                //Create data rows
                var rows = [headerRow];

                data.forEach((item) => {
                    var row = {}
                    fields.forEach(function (field) {
                        if (typeof field.value == "function") {
                            row[field.value] = field.value(item);
                        }
                        else if (Array.isArray(field.value)) {
                            var curObj = item;
                            field.value.forEach((key) => {
                                curObj = (curObj ?? {})[key]
                            })
                            row[field.value] = curObj;
                        }
                        else {
                            row[field.value] = item[field.value];
                        }
                    });
                    rows.push(row);
                });

                //Create workbook and sheet
                var wb = XLSX.utils.book_new();
                wb.Props = {
                    Title: wbName,
                    Author: "paleolatitude.org software",
                    CreatedDate: new Date()
                };
                var ws = XLSX.utils.json_to_sheet(rows, { skipHeader: true });
                XLSX.utils.book_append_sheet(wb, ws, wbName);

                //Download the workbook
                XLSX.writeFile(wb, fileName, {});
            } catch (err) {
                console.error(err);
                alert("Error, Something went wrong with the export of " + entityLabel + ".")
            }
        }, 30);
    }

}
