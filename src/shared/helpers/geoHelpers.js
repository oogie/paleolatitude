import 'polygon-tools';
import * as geolib from 'geolib';


var numberFormatter =  new Intl.NumberFormat("en");

export const geoHelpers = {
    latitudeFormatter: function latitudeFormatter(lat) {
        //get some shorthands
        var absLat = Math.abs(lat);
        var latDecimals = absLat.toFixed(4).toString().split(".")[1] || "";

        //calc the displayed values
        var deg = parseInt(absLat);
        var min = latDecimals.substring(0,2);
        var sec = latDecimals.substring(2);
        var hem = lat === 0 ? "" : (lat > 0 ? "N" : "S");

        //find out what values to display (so we dont be overspecific)
        var str = `${deg}°`;
        if (sec !== "00") { str += `${min}'${sec}''` }
        else if (min !== "00") { str += `${min}'` }
        str += `${hem}`

        return str;
    },

    //filter out non-existant or smaller then 1cm squared (rounding errors within PolygonTools)
    filterTooSmallPolygonen: function filterTooSmallPolygonen(polygonen) {
        return polygonen.filter((p) => {
            return (p.length != 0 && geolib.getAreaOfPolygon(p) > 0.1);
        })
    },

    areaOf: function areaOf(polygon) {
        return geolib.getAreaOfPolygon(polygon) //get area (in square meteres?)
    },

    extentOf: function(polygon) {
        return geolib.getBounds(polygon);
    },

    displayArea: function displayArea(m) {
        let unitDisplay = "m";
        let unitCode = "m2";

        if (m > 100_000) {
            unitDisplay = "km";
            unitCode = "km2";
        }

        return `${numberFormatter.format( Math.round(geolib.convertArea(m, unitCode) * 10) / 10 )} ${unitDisplay}²`
    },

    intersect: function intersect(polygonA, polygonB) {
        return PolygonTools.polygon.intersection(polygonA, polygonB);
    }
}
