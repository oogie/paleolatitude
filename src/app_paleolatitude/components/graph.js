import { m, helpers, XLSX, options } from '../../shared/stdimports.js';

import Highcharts from 'highcharts';
import more from 'highcharts/highcharts-more';
more(Highcharts);

import { comp as Positionaldialog } from '../../shared/components/dialog/positionaldialog.js';


import "./graph.less";

/*
vnode.attrs = {
 locations: [..location..]

  series: ["paleolatitude", "paleolatitudeCI", "temperature"] //leave any string to not show that series
}
*/

export const comp = {

    oninit: function(vnode) {
        vnode.state.isOpen = {
            export: false,
        }
    },

    oncreate: function (vnode) {
        initGraph(vnode);
        if (vnode.state.showGraph) { m.redraw(); }

        comp.setHoverdLocation = (locId) => {
            return setHoverdLocation(vnode, locId);
        }
    },

    view: function (vnode) {
        updateGraphVisibility(vnode);
        updateSeries(vnode);
        updateAxis(vnode);

        return (
            <div class={`comp graph ${vnode.state.showGraph ? "visible" : ""}`}>
                <div id='graphWrapper'>
                    <div id='graphContent'>Loading graph..</div>
                </div>

                <div class='export_button'>
                    <button class='btn_icon' onclick={() => { vnode.state.isOpen.export = true }}>
                        <i class="fa-solid fa-bars"></i>
                    </button>

                    <Positionaldialog 
                        anchor="right"
                        flow="left"
                        direction="down"
                        isOpen={vnode.state.isOpen.export} 
                        onClose={() => { vnode.state.isOpen.export = false }}>
                        <div class='menu'>
                            <a onclick={() => { vnode.state.graph.fullscreen.open(); vnode.state.isOpen.export = false }} href='javascript:'>
                                <i class="fa-solid fa-arrows-maximize fa-fw"></i> Show fullscreen
                            </a>
                            <div class='spacer' />
                            <a onclick={() => { ExportXLSX(vnode); vnode.state.isOpen.export = false }} href='javascript:'>
                                <i class="fa-solid fa-download fa-fw"></i> Download XLSX
                            </a>
                            <a onclick={() => { vnode.state.graph.exportChartLocal({ type: 'application/pdf', filename: `Paleolatitude.org ${filenameTimestamp()}` }); vnode.state.isOpen.export = false }} href='javascript:'>
                                <i class="fa-solid fa-download fa-fw"></i> Download PDF
                            </a>

                            <div class='spacer' />
                            <a onclick={() => { vnode.state.graph.exportChartLocal({ type: 'image/png', filename: `Paleolatitude.org ${filenameTimestamp()}` }); vnode.state.isOpen.export = false }} href='javascript:'>
                                <i class="fa-solid fa-download fa-fw"></i> Download PNG
                            </a>
                            <a onclick={() => { vnode.state.graph.exportChartLocal({ type: 'image/jpeg', filename: `Paleolatitude.org ${filenameTimestamp()}` }); vnode.state.isOpen.export = false }} href='javascript:'>
                                <i class="fa-solid fa-download fa-fw"></i> Download JPG
                            </a>
                            <a onclick={() => { vnode.state.graph.exportChartLocal({ type: 'image/svg+xml', filename: `Paleolatitude.org ${filenameTimestamp()}` }); vnode.state.isOpen.export = false }} href='javascript:'>
                                <i class="fa-solid fa-download fa-fw"></i> Download SVG
                            </a>
                        </div>
                    </Positionaldialog>
                </div>

            </div>
        )
    }

}

function setHoverdLocation(vnode, locId) {
    vnode.state.graph.series.forEach((series, i) => {
        if (locId === undefined || series.options.id.startsWith(locId)) {
          series.setState('normal');
        } else {
          series.setState('inactive');
        }
    })
}


function initGraph(vnode) {
    const graph = Highcharts.chart('graphContent', {
        exporting: {
            buttons: {
                contextButton: {
                    enabled: false
                }
            },
            fallbackToExportServer: false,
            url: "",
        },
        chart: {
            type: 'line',
            zoomType: 'xy',
            animation: {
                duration: 1000
            },
            events: {
                click: function (e) {
                    vnode.state.graph.series.forEach((series, i) => {
                        let markerEl = window[series.options.id];
                        if (markerEl) {
                            if (markerEl.classList.contains("highlight") === true) {
                                helpers.sessionStorage.selectLocation(series.options.id);
                                m.redraw();
                            }
                        }
                    });
                }
            }
        },
        title: { text: '' },
        legend: { enabled: false },
        xAxis: {
            title: {
                text: "Age (Ma)"
            },
            reversed: true,
        },
        yAxis: [{
            opposite: false,
            title: undefined,

            tickInterval: 15,

            ceiling: 90,
            floor: -90,

            labels: {
                formatter: function () {
                    return `${this.value}°`
                }
            }
        }, {
            opposite: true,
            title: undefined,

            labels: {
                formatter: function () {
                    return `${this.value} &deg;C`
                }
            }
        }],
        series: [],
        tooltip: {
            shared: false,
            useHTML: true,

            formatter: function() {
                if(this.series.options.id.endsWith("temp")) {
                    return `
                        <div>
                            <div style='color:${this.color};'>Plate: ${this.series.name}</div>
                            <div><b>${this.y.toFixed(2)}  &deg;C</b></div>
                            <div>${this.x}<small>Ma</small></div>
                            <div>${this.point.context.lat}°</div>
                            <br/>
                            <div><small>Temperature when latitude is<br/>rounded instead of interpolated:<br/>${this.point.context.temp.toFixed(2)} &deg;C (diff: ${(this.point.context.temp - this.point.context.interpolatedtemp).toFixed(2)} &deg;C)</small></div>
                        </div>
                    `
                }

                // find bounds
                let bounds = undefined;
                if (this.series.linkedSeries[0]) {
                    let boundsIndex = this.series.linkedSeries[0].xData.findIndex((xVal) => {return xVal === this.x});
                    if (boundsIndex) {
                        bounds = this.series.linkedSeries[0].yData[boundsIndex];
                    }
                }

                return `
                    <div>
                        <div style='color:${this.color};'>Plate: ${this.series.name}</div>
                        <div><b>${this.y}°</b></div>
                        <div>${this.x}<small>Ma</small></div>
                        ${bounds === undefined ? "" : `
                            <div><small>[${bounds[0]}°, ${bounds[1]}°]<sub>95% CI</sub></small></div>
                        `}
                    </div>
                `
            }

        },
        plotOptions: {
            series: {
                states: {
                    normal: {
                        animation: {
                            duration: 150
                        }
                    }
                },
                events: {
                    mouseOver: function (e) {
                        let markerEl = window[e.target.options.id];
                        if (markerEl) {
                            markerEl.classList.add("highlight");
                        }
                    },
                    mouseOut: function (e) {
                        let markerEl = window[e.target.options.id];
                        if (markerEl) {
                            markerEl.classList.remove("highlight");
                        }
                    },
                    click: function (e) {
                        e.point.series.options.id
                        if (helpers.sessionStorage.selectLocation(e.point.series.options.id)) {
                            m.redraw();
                        }
                    }
                }
            },
            line: {
                point: {
                    events: {
                        mouseOver: function (e) {
                            // TODO make a line on the map on this latitude
                            // console.log(e.target.x, e.target.y, e.target.color, e.target.series.options.id);
                        },
                        mouseOut: function (e) {
                            // console.log()
                        }
                    }
                }
            }
        }
    });

    vnode.state.graph = graph;
}

function updateAxis(vnode) {
    //if the graph is not yet inited, skip
    if (vnode.state.graph === undefined) return;

    //todo: tmp fix, need a better place to configure this
    let xDfltMax = vnode.attrs.series.includes("temperature") ? 90 : null;

    let xAxisModus = helpers.sessionStorage.getOption("chartXAxisModus")
    vnode.state.graph.xAxis[0].update({
        min: xAxisModus === "flexible" ? 0 : get("chartXAxisMin"),
        max: xAxisModus === "flexible" ? xDfltMax : get("chartXAxisMax")
    })

    let yAxisModus = helpers.sessionStorage.getOption("chartYAxisModus")
    vnode.state.graph.yAxis[0].update({
        min: yAxisModus === "flexible" ? null : get("chartYAxisMin"),
        max: yAxisModus === "flexible" ? null : get("chartYAxisMax"),
    })

    function get(option) {
        let val = parseFloat(helpers.sessionStorage.getOption(option));
        return isNaN(val) ? null : val;
    }

}


function updateSeries(vnode) {
    //if the graph is not yet inited, skip
    if (vnode.state.graph === undefined) return;

    //first check if there are series where the corresponding location is removed or updating.
    //make a shallow copy of the series list, because highcharts will live edit the series array when removing a series.
    [].concat(vnode.state.graph.series).forEach((series, i) => {
        let location = vnode.attrs.locations.find((l) => {return series.options.id.startsWith(l.id)});

        if (location === undefined) { series.remove(false, false, false); }
        else if (location.status !== "ready") { series.remove(false, false, false); }
    });

    vnode.attrs.locations.forEach((location, i) => {
        if (location.status === "ready") {
            //check if the series is already added, then don't add it again
            if (vnode.state.graph.series.find((series) => {return location.id === series.options.id }) !== undefined) {
                return;
            }

            // LATITUDE DATA SERIES
            if (vnode.attrs.series.includes("paleolatitude")) {
                vnode.state.graph.addSeries({
                    id: location.id,
                    type: 'line',
                    name: location.calc.plate.name,
                    color: location.color,
                    marker: {
                        enabled: true,
                        symbol: "circle"
                    },
                    data: location.calc.paleolatitude.filter((p) => {return !p.onlytemp}).map((p) => {
                        let isAgePoint = parseFloat(location.age).toFixed(2) === p.age.toFixed(2);

                        return {
                            marker: {
                                radius: isAgePoint ? 6 : undefined,
                                fillColor: isAgePoint ? "white" : undefined,
                                lineWidth: isAgePoint ? 2 : undefined,
                                lineColor: isAgePoint ? location.color : undefined,
                                symbol: isAgePoint ? "triangle" : undefined
                            },
                            x: p.age,
                            y: p.lat
                        }
                    })
                }, false, false)
            }

            // LATITUDE CONFIDENCE INTERVAL SERIES
            if (vnode.attrs.series.includes("paleolatitudeCI")) {
                vnode.state.graph.addSeries({
                    id: location.id + "bounds",

                    linkedTo: location.id,
                    enableMouseTracking: false,

                    type: 'arearange',
                    lineWidth: 0,
                    color: location.color,
                    fillOpacity: 0.3,
                    marker: {
                        enabled: false
                    },
                    data: location.calc.paleolatitude
                        .map((p) => {
                            return [p.age, p.upperbound, p.lowerbound]
                        }).filter((p) => {
                            //if any of the values are not a number (resulting from parseFloat("")) filter this point out
                            return p.every((val) => {return !isNaN(val)})
                        })
                }, false, false)
            }

            // TEMPERATURE SERIES
            if (vnode.attrs.series.includes("temperature")) {
                vnode.state.graph.addSeries({
                    id: location.id + "temp",
                    name: location.calc.plate.name,

                    linkedTo: location.id,

                    type: 'line',
                    lineWidth: 1,
                    dashStyle: "Dash",
                    color: location.color,
                    fillOpacity: 1,

                    yAxis: 1,
                    marker: {
                        enabled: true,
                        symbol: "square"
                    },

                    data: location.calc.paleolatitude
                        .map((p) => {
                            return {x: p.age, y: p.interpolatedtemp, context: p}
                        }).filter((p) => {
                            //if any of the values are not a number (resulting from parseFloat("")) filter this point out
                            return !isNaN(p.x) && !isNaN(p.y)
                        })
                }, false, false)
            }
        }
    });
}


function updateGraphVisibility(vnode) {
    vnode.state.showGraph = vnode.attrs.locations.filter((loc) => {return loc && loc.status === "ready"}).length > 0;
}


function filenameTimestamp() {
    return helpers.general.tsToLocaleString(helpers.general.now());
}


function ExportXLSX(vnode) {
    let wb = XLSX.utils.book_new();
    wb.Props = {
        Title: "Paleolatitude.org",
        Author: "paleolatitue.org software",
        CreatedDate: new Date()
    };

    let locations = vnode.attrs.locations   
                                .filter((loc) => {return loc && loc.status === "ready"})
                                .map((loc) => {
                                    loc.sample = options.locationColor.find((c) => {return c.label === loc.color}).name;
                                });

    console.log(vnode.attrs.locations);
    addLocationsToWb(wb, "paleolatitude", vnode.attrs.locations.filter((loc) => {return loc && loc.status === "ready"}));

    XLSX.writeFile(wb, `Paleolatitude.org ${filenameTimestamp()}.xlsx`);
}

function addLocationsToWb(wb, sheetName, locations) {
    let ws = XLSX.utils.aoa_to_sheet([[
        "sample",
        "error",
        "age",
        "paleolatitude",
        "lower bound",
        "upper bound",
        "interpolated",
        "sample latitude",
        "sample longitude",
        "plate ID",
        "plate name",
        "paleomagnetic reference frame"
    ]]);

    locations.forEach((loc, i) => {
        console.log(loc);
        let rows = [];

        if (loc.error !== undefined) {
            rows.push([
                loc.sample,
                loc.error,
                undefined,      //age
                undefined,      //paleolatitude
                undefined,      //lower bound
                undefined,      //upper bound
                undefined,      //interpolated flag
                loc.coord.lat,
                loc.coord.lon,
                undefined,      //plate ID
                undefined,      //plate name
                loc.refFrame
            ])
        }
        else {
            rows = loc.calc.paleolatitude.map((calc) => {
                return [
                    loc.sample,
                    loc.error,
                    calc.age,
                    calc.lat,
                    calc.lowerbound,
                    calc.upperbound,
                    calc.interpolated ? "true" : "false",
                    loc.coord.lat,
                    loc.coord.lon,
                    loc.calc.plate.id,
                    loc.calc.plate.name,
                    loc.refFrame
                ]
            })
        }

        XLSX.utils.sheet_add_aoa(ws, rows, { origin: -1 })
    });

    XLSX.utils.book_append_sheet(wb, ws, sheetName);
}
