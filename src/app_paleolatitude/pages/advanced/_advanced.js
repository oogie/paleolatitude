import { m, helpers, options, config, XLSX, vex } from '../../../shared/stdimports.js';


//styling
import './_advanced.less';

import { comp as LocationDetails } from './locationDetails.js';
import { comp as Positionaldialog } from '../../../shared/components/dialog/positionaldialog.js';
import { comp as Input_select } from '../../../shared/components/input_select.js';
import { comp as Input_text } from '../../../shared/components/input_text.js';
import { comp as Input_file } from '../../../shared/components/input_file.js';

import demoInputFile from "../../assets/Demo_Bulk_Input_Paleolatitude.org.xlsx"
import demoOutputFile from "../../assets/Demo_Bulk_Output_Paleolatitude.org.xlsx"


export const page = {

    oninit: function(vnode) {
        resetBulkState(vnode);
    },

    view: function(vnode) {
        let locations = helpers.sessionStorage.getAllLocations();

        return (
            <div class={`page advanced ${vnode.attrs.visible ? "visible" : "hidden"}`}>
                <div class='content_wrapper content_width_standard'>
                    <h2>Advanced Options</h2>

                    <div>
                        <div class='locations'>
                            <div class='titlebar'>
                                <h4>Selected locations</h4>
                            </div>
                            <div>
                                {locations.length > 0 ? (
                                    <div class='comp locationDetails header'>
                                        <span></span>
                                        <span>Latitude</span>
                                        <span>Longitude</span>

                                        <span class='mobile_hidden'></span>
                                        <span class='mobile_hidden'>Age</span>
                                        <span class='mobile_hidden'>Max age</span>
                                        <span class='mobile_hidden'>Min age</span>

                                        <a style='text-align: right' href="javascript:" onclick={(e) => {vnode.state.showDialog = true}}>remove all locations</a>
                                        <Positionaldialog isOpen={vnode.state.showDialog} flow='left' onClose={() => {vnode.state.showDialog = false}}>
                                            <center><b>Are you sure?</b></center><br/>
                                            <div class='flex'>
                                                <button onclick={(e) => {helpers.sessionStorage.removeAllLocations(); vnode.state.showDialog = false}}>Remove all locations</button>
                                                <button onclick={(e) => {vnode.state.showDialog = false}}>Cancel</button>
                                            </div>
                                        </Positionaldialog>
                                    </div>
                                ) : ""}
                                {locations.map((location) => {
                                    return <LocationDetails
                                        location={location}

                                        selectLocation={(id) => {
                                            vnode.attrs.onHideAdvancedControls()
                                            helpers.sessionStorage.selectLocation(id)
                                        }}
                                    />
                                })}
                                <center>
                                    <br/>
                                    {locations.length < config.maxLocations ? (
                                        <small>
                                            <button class='btn_narrow' onclick={(e) => {
                                                helpers.sessionStorage.setLocation({coord: {lat: 0, lon: 0}})
                                            }}>
                                                <i class="fa-solid fa-plus"></i> Add location
                                            </button>
                                        </small>
                                    ) : (
                                        <span class='txt_default_lesser'>Maximum number of locations added</span>
                                    )}
                                </center>
                            </div>
                        </div>

                        <br/><br/>

                        <div class='referenceframe'>
                            <h4>Paleomagnetic reference frame</h4>
                            <Input_select
                                value = {helpers.sessionStorage.getOption("paleomagneticReferenceFrame")}
                                options = {options.paleomagneticReferenceFrame}
                                onblur = {(val) => {
                                    //if the selected value is different from the current selected frame:
                                    //update the reference frame and recalulate all locations.
                                    if (helpers.sessionStorage.getOption("paleomagneticReferenceFrame") !== val) {
                                        helpers.sessionStorage.setOption("paleomagneticReferenceFrame", val);

                                        //remove all the locations, add them agian.
                                        //This is the most relaiable way of resetting all things in
                                        //all the components on the page
                                        helpers.sessionStorage.getAllLocations().forEach((location) => {
                                            helpers.sessionStorage.removeLocation(location.id);

                                            delete location.id;
                                            helpers.sessionStorage.setLocation(location, false);
                                        });
                                    }
                                }}
                            />
                        </div>

                        <br/><br/>

                        <div class='graph'>
                            <h4>Graph options</h4>
                            <div class='flex'>
                                {makeAxisOptions(vnode, "X")}
                                {makeAxisOptions(vnode, "Y")}
                            </div>
                        </div>

                        <br/><br/>


                    {/* <div class='map'>
                        <h4>Map options</h4>
                        <Input_select
                            title = "Map projection"
                            value = {helpers.sessionStorage.getOption("mapProjection")}
                            options = {options.mapProjection}
                            onblur = {(val) => {
                                if (helpers.sessionStorage.getOption("mapProjection") !== val) {
                                    helpers.sessionStorage.setOption("mapProjection", val);
                                    m.redraw();
                                }
                            }} />
                    </div> */}

                    </div>

                    <div class="bulk section">
                        <h4>Bulk entry</h4>
                        <div class='bulkstatus'>
                            {vnode.state.bulk.status === "waiting" ? (
                                <Input_file
                                    title="Drop your csv or xlsx file"
                                    accept=".csv, .xls, .xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/vnd.oasis.opendocument.spreadsheet"
                                    onblur={(files) => {
                                        vnode.state.bulk.status = "loading";
                                        vnode.state.bulk.file = files[0];
                                        m.redraw();

                                        window.setTimeout(() => {
                                            readFile(files[0])
                                                .then(sheetSelection)
                                                .then(bulkWorksheetToLocations)
                                                .then((locations) => {
                                                    startBulkCalculations(vnode, locations)
                                                })
                                                .catch((e) => {
                                                    console.log(e);
                                                    vnode.state.bulk.status = "error";
                                                    vnode.state.bulk.errorMsg = e.message;

                                                    m.redraw();
                                                })
                                        }, 100);
                                    }}
                                />
                            ) : vnode.state.bulk.status === "loading" ? (
                                m.fragment(
                                    <div><b>Reading</b> <i>'{vnode.state.bulk.file.name}'</i></div>,
                                    <button class='btn_narrow' onclick={() => { resetBulkState(vnode); }}>Cancel</button>
                                )
                            ) : vnode.state.bulk.status === "calculating" ? (
                                m.fragment(
                                    <div><b>Calculating</b> {vnode.state.bulk.calculated} / {vnode.state.bulk.locations.length}</div>,
                                    vnode.state.bulk.calcError !== 0 ? <small class='txt_error'>{vnode.state.bulk.calcError} samples could not be calculated</small> : "",
                                    <button class='btn_narrow' onclick={() => { resetBulkState(vnode); }}>Cancel</button>
                                )
                            ) : vnode.state.bulk.status === "finished" ? (
                                m.fragment(
                                    <div><b>Finished calculating</b></div>,
                                    <div>
                                        Calculated paleolatitude of {vnode.state.bulk.calculated} samples.
                                        {vnode.state.bulk.calcError !== 0 ? (<small class='txt_error'><br/>Of which {vnode.state.bulk.calcError} samples could not be calculated.</small>) : ""}
                                    </div>,
                                    <div class='flexequal'>
                                        <button class='btn_narrow btn_primary' onclick={() => { makeBulkDownload(vnode); }}>
                                            Download results
                                            {vnode.state.bulk.calculated < 1000 ? "" : m.fragment(
                                                <br/>,
                                                <small>(this will take some time)</small>
                                            )}
                                        </button>
                                        <button class='btn_narrow' onclick={() => { resetBulkState(vnode); }}>Back</button>
                                    </div>
                                )
                            ) : vnode.state.bulk.status === "error" ? (
                                m.fragment(
                                    <h4 class='txt_error'>Error</h4>,
                                    <span>{vnode.state.bulk.errorMsg}</span>,
                                    <button class='btn_narrow' onclick={() => { resetBulkState(vnode); }}>Try again</button>
                                )
                            ) : "Error: unkown bulk status"}

                        </div>
                        <div>
                            <ol>
                                <li>
                                    Upload a csv or xlsx file (<a href={demoInputFile}>demo input file <i class="fa-light fa-file-arrow-down"></i></a>) with the following named columns:
                                    <ul class='compact'>
                                        <li>latitude <small>degrees plus decimals, N positive, S negative</small></li>
                                        <li>longitude <small>degrees plus decimals, E positive, W negative</small></li>
                                        <li>sample name <small>optional</small></li>
                                        <li>age <small>in Ma, optional</small></li>
                                        <li>min age <small>in Ma, optional</small></li>
                                        <li>max age <small>in Ma, optional</small></li>
                                        <li>
                                            Paleomagnetic Reference Frame <small>optional, can be:</small>
                                            <ul>{options.paleomagneticReferenceFrame.map((opt) => {return (
                                                <li>'{opt.value}' {opt.default ? <small>default</small> : ""}</li>
                                            )})}
                                            </ul>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    Wait until the calculations for all samples are ready.
                                </li>
                                <li>
                                    Download the results per xlsx file. (<a href={demoOutputFile}>demo output file <i class="fa-light fa-file-arrow-down"></i></a>)
                                </li>
                            </ol>
                        </div>
                    </div>

                    <div class='bottom_actions content_width_standard'>
                        <div style="flex-grow: 1;"></div>
                        <button class='btn_primary' onclick={() => {m.route.set("/")}}>back</button>
                    </div>
                </div>
            </div>
        )
    }
}


function makeAxisOptions(vnode, axis) {
    return (
        <div class='axisOptions'>
            <Input_select
                title = {axis + " axis"}
                value = {helpers.sessionStorage.getOption("chart" + axis + "AxisModus")}
                options = {options.chartXAxisModus}
                onblur = {(val) => {
                    if (helpers.sessionStorage.getOption("chart" + axis + "AxisModus") !== val) {
                        helpers.sessionStorage.setOption("chart" + axis + "AxisModus", val);
                    }
                }}
            />
            {helpers.sessionStorage.getOption("chart" + axis + "AxisModus") !== "fixed" ? "" : m.fragment([
                <Input_text title = "min" value={helpers.sessionStorage.getOption("chart" + axis + "AxisMin")} onblur={(val) => {
                    helpers.sessionStorage.setOption("chart" + axis + "AxisMin", parseFloat(val))
                }} />,
                <Input_text title = "max" value={helpers.sessionStorage.getOption("chart" + axis + "AxisMax")} onblur={(val) => {
                    helpers.sessionStorage.setOption("chart" + axis + "AxisMax", parseFloat(val))
                }} />
            ])}

        </div>

    )
}


function resetBulkState(vnode) {
    vnode.state.bulk = {
        status: "waiting",
        file: undefined,
        locations: undefined,

        calculated: 0,
        calcError: 0,

        errorMsg: undefined
    }

    m.redraw();
}

function readFile(fileHandle) {
    return new Promise((resolve, reject) => {
        try {
            if (/^image/.test(fileHandle.type) || /^application\/pdf/.test(fileHandle.type)) {
                console.error(fileHandle.type)
                reject("Something went wrong while reading the file. This is not an XLSX like file. Error: 01");
                return;
            }

            var reader = new FileReader();

            reader.onload = function(e){
                var fileContent = new Uint8Array(e.target.result);
                const workbook = XLSX.read(fileContent, {type:'array'});
                resolve(workbook);
            };

            reader.readAsArrayBuffer(fileHandle);
        }
        catch (e) {
            console.error(e);
            reject("Something went wrong while reading the file. Error: 02")
        }
    })
}

function sheetSelection(workbook) {
    return new Promise((resolve, reject) => {
        var sheetNames = workbook.SheetNames;

        if (sheetNames.length == 0) {
            console.error(workbook.Sheets)
            reject("Something went wrong while reading the file. Error: 03")
        }
        else if (sheetNames.length == 1) {
            resolve(workbook.Sheets[sheetNames[0]]);
        }
        else {
            //aks the user
            vex.dialog.open({
                message: 'From what sheet do you want to import data?',
                input: ["<select name='sheetIndex' id='sheetIndex' required>"]
                    .concat(sheetNames.map((sheetName, i) => {
                        return "<option value='" + i + "'>" + sheetName + "</option>";
                    }))
                    .concat([
                        "</select>"
                    ]).join(''),
                callback: function (data) {
                    if (!data) {
                        reject("The import is canceled");
                    } else {
                        resolve(workbook.Sheets[sheetNames[parseInt(data.sheetIndex)]])
                    }
                }
            })
        }
    })
}

function bulkWorksheetToLocations(worksheet) {
    return new Promise((resolve, reject) => {
        let data = XLSX.utils.sheet_to_json(worksheet, {blankrows: false});

        let locations = data.map((d, i) => {

            //transform all keys to lowercase and without whitespace.
            Object.keys(d).forEach((key) => {
                let sanitizedKey = key.toString().toLowerCase().replaceAll(/\s/g, "");
                d[sanitizedKey] = d[key];
            });

            //remove the ' if someone copies them from the explainer text
            if (d["paleomagneticreferenceframe"]) {
                d["paleomagneticreferenceframe"] = d["paleomagneticreferenceframe"].replaceAll("'", "");
            }

            //set the ref frame to the default if it is not specified in the input
            if (d["paleomagneticreferenceframe"] === undefined) {
                d["paleomagneticreferenceframe"] = options.findDefault("paleomagneticReferenceFrame").value;
            }

            //make the location
            return helpers.general.makeLocation({
                coord: {
                    lat: d["latitude"],
                    lon: d["longitude"]
                },

                age: d["age"],
                minAge: d["minage"],
                maxAge: d["maxage"],

                refFrame: d["paleomagneticreferenceframe"],

                sample: d["samplename"] || `Sample ${i+1}`
            })
        });

        resolve(locations);
    })

}

function startBulkCalculations(vnode, locations) {
    vnode.state.bulk.locations = locations;
    vnode.state.bulk.status = "calculating";
    m.redraw();

    //do 5 simultaneous calculations.
    //Increasing this number wil not result in faster calculation times
    for (let i = 0; i < 5; i++) {
        continueBulkCalculations(vnode);
    }
}

function continueBulkCalculations(vnode) {
    let loc = vnode.state.bulk.locations.find((loc) => {
        return loc.status === "loading";
    });

    if (loc === undefined) {
        if (vnode.state.bulk.locations.filter((loc) => {return loc.status === "calculating"}).length === 0) {
            vnode.state.bulk.status = "finished";
        }
        return;
    }

    //change the status to something other then 'loading'
    //warning: if you ever want to show this in the map UI: this status is not known over there
    loc.status = "calculating";

    helpers.api.getPaleolatitude(loc)
        .then((calculations) => {
            loc.status = "ready";
            loc.calc = calculations;
        })
        .catch((error) => {
            loc.status = "error";
            loc.error = error;
            vnode.state.bulk.calcError = vnode.state.bulk.calcError + 1;
        })
        .finally(() => {
            vnode.state.bulk.calculated = vnode.state.bulk.calculated + 1;
            m.redraw();

            if (vnode.state.bulk.status === "calculating") {
                continueBulkCalculations(vnode);
            }
        })

}


function makeBulkDownload(vnode) {
    let wb = XLSX.utils.book_new();
    wb.Props = {
        Title: "Bulk Entry Paleolatitude.org",
        Author: "paleolatitue.org",
        CreatedDate: new Date()
    };

    createLocationBuckets(vnode.state.bulk.locations).forEach((bucket) => {
        addLocationsToWb(wb, bucket.sheetName, bucket.locations);
    });

    XLSX.writeFile(wb, "Bulk Entry Paleolatitude.org.xlsx");
}

function createLocationBuckets(locations) {
    //devide the samples up in different sheets when the input data is very large
    let bucketSize = 10_000;
    let locBuckets = locations.reduce((buckets, curLoc, i, allLocs) => {
        let bucketIndex = Math.floor(i/bucketSize);

        if (buckets[bucketIndex] === undefined) {
            let sheetName = `Samples ${(bucketIndex * bucketSize) + 1} - ${Math.min((bucketIndex + 1) * bucketSize, allLocs.length)}`;
            buckets[bucketIndex] = {sheetName: sheetName, locations: []};
        }

        buckets[bucketIndex].locations.push(curLoc);
        return buckets;
    }, [])

    if (locBuckets.length === 1) {
        locBuckets[0].sheetName = "Samples"
    }

    return locBuckets;
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

        XLSX.utils.sheet_add_aoa(ws, rows, {origin:-1})
    });

    XLSX.utils.book_append_sheet(wb, ws, sheetName);
}
