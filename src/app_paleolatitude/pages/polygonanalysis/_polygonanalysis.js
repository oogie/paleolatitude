import { m, helpers, options } from '../../../shared/stdimports.js';

//styling
import './_polygonanalysis.less';

//components
import { comp as Map } from './polygonmap.js';
import { comp as Input_file } from '../../../shared/components/input_file.js';
import { comp as Dialog } from '../../../shared/components/dialog/dialog.js';



export const page = {

    oninit: function(vnode) {
        vnode.state.overlapEpsilon = 1_000;

        vnode.state.errors = [];
        vnode.state.plates = [];
        vnode.state.ringCount = 0;
        vnode.state.overlappings = []
        vnode.state.showOverlappings = [0, 9];
        vnode.state.activeOverlap = undefined;

        vnode.state.clickedPlates = [];

        vnode.state.isOpen = {
            plates: false
        }
    },

    onremove: function(vnode) {

    },

    view: function(vnode) {

        return (
            <div class="page polygonanalysis">
                <div class='content_width_narrow'>
                    <br/>
                    <Input_file
                        title="Drop your gpml file"
                        accept=".gpml"
                        onblur={(files) => {
                            m.redraw();

                            window.setTimeout(() => {
                                readFile(files[0])
                                    .then(parseGPML)
                                    .then((res) => {
                                        vnode.state.errors = vnode.state.errors.concat(res.errors);
                                        vnode.state.plates = vnode.state.plates.concat(res.plates);
                                        vnode.state.ringCount = vnode.state.plates.reduce((count, plate) => {return count + plate.rings.length}, 0)

                                        m.redraw();
                                    })
                                    .catch((e) => {
                                        console.log(e);

                                        m.redraw();
                                    })
                            }, 100);
                        }}
                    />
                    <br/>
                </div>

                <div class='content_width_standard actions'>
                    <button onclick={() => {vnode.state.plates = []; vnode.state.errors = []; vnode.state.ringCount = 0; vnode.state.overlappings = []; vnode.state.showOverlappings = [0, 9]; vnode.state.activeOverlap = undefined}}>Reset plates</button>
                    <button onclick={() => {onCheckOverlap(vnode)}}>Check overlapping plates</button>
                    <br/>
                </div>

                <If condition={vnode.state.errors.length > 0}>
                    <div class='content_width_standard'>
                        <h4>Parsing Errors</h4>
                        {vnode.state.errors.map((err) => {
                            return (
                                <div class='txt_error'>
                                    {err.msg}
                                </div>
                            )
                        })}

                    </div>
                    <br/>
                </If>

                <If condition={vnode.state.overlappings.length > 0}>
                    <div class='content_width_standard'>
                        <h4>Overlaps</h4>
                        {vnode.state.overlappings.map((overlap, i) => {
                            if (i < vnode.state.showOverlappings[0] || i > vnode.state.showOverlappings[1]) return;

                            let isActive = vnode.state.activeOverlap === overlap ? "active" : ""

                            return (
                                <div class={`flexequal overlap ${isActive ? "active" : ""}`}>
                                    <span>{overlap.shapeA.id} - {overlap.shapeA.name}</span>
                                    <span>{overlap.shapeB.id} - {overlap.shapeB.name}</span>
                                    <span>
                                        {m.trust(helpers.geo.displayArea(overlap.intersection.area))} overlap
                                        <small> in {overlap.intersection.polygon.length} sections</small>
                                    </span>
                                    <button style='flex-grow: 0.5;' class={isActive ? "disabled" : ""} onclick={() => {vnode.state.activeOverlap = overlap}}>{isActive ? "Showing" : "Show"}</button>
                                </div>
                            )
                        })}

                        <center class='txt_default_lesser'>
                            <br/>
                            <i>
                                Showing overlap {vnode.state.showOverlappings[0] + 1} up
                                to {Math.min(vnode.state.showOverlappings[1] + 1, vnode.state.overlappings.length)} of a total
                                of {vnode.state.overlappings.length}</i>
                            <br/>
                            <small class='flex' style='justify-content: center;'>
                                <button class={vnode.state.showOverlappings[0] === 0 ? "disabled" : ""} onclick={() => {vnode.state.showOverlappings = [vnode.state.showOverlappings[0] - 10, vnode.state.showOverlappings[1] - 10]}}>&lt; Previous</button>
                                <button class={vnode.state.showOverlappings[1] >= vnode.state.overlappings.length ? "disabled" : ""} onclick={() => {vnode.state.showOverlappings = [vnode.state.showOverlappings[0] + 10, vnode.state.showOverlappings[1] + 10]}}>Next &gt;</button>
                            </small>
                        </center>

                    </div>
                    <br/>
                </If>

                <div class='content_width_standard actions'>
                    Drawing {vnode.state.plates.length} plates, {vnode.state.ringCount} shapes
                </div>

                <div class='contentbar'>
                    <Map
                        polygons={vnode.state.plates}
                        activeOverlap={vnode.state.activeOverlap}

                        onclick={(e, plates) => {
                            if (plates.length > 0) {
                                vnode.state.isOpen.plates = true;
                                vnode.state.clickedPlates = plates;

                                m.redraw();
                            }
                        }}

                        height="75vh"
                        width="100vw"
                    />

                    <Dialog
                        isOpen={vnode.state.isOpen.plates}
                        onAnswer={(resp) => { vnode.state.isOpen.plates = false; }}
                        isAlert={true}
                    >
                        <h4>You clicked on</h4>
                        {vnode.state.clickedPlates.map((plate) => {
                            return (
                                <div>{plate.id} - {plate.name}</div>
                            )
                        })}
                    </Dialog>
                </div>

            </div>
        )
    }

}


function readFile(fileHandle) {
    return new Promise((resolve, reject) => {
        try {
            var reader = new FileReader();

            reader.onload = function(e){
                resolve(e.target.result)
            };

            reader.readAsText(fileHandle);
        }
        catch (e) {
            console.error(e);
            reject("Something went wrong while reading the file. Error: 02")
        }
    })
}

function parseGPML(fileContent) {
    const doc = helpers.general.xmlStr2xmlDoc(fileContent);
    const gmlPlates = doc.querySelectorAll("featureMember");

    let result = {
        plates: [],
        errors: []
    }

    gmlPlates.forEach((gmlPlate) => {

        let shadowRings = [];
        let plate = {
            id: gmlPlate.querySelector("reconstructionPlateId value").innerHTML,
            name: gmlPlate.querySelector("name")?.innerHTML,
            age: {
                from: gmlPlate.querySelector("TimePeriod begin timePosition").innerHTML,
                to: gmlPlate.querySelector("TimePeriod end timePosition").innerHTML,
            },
            rings: Array.from(gmlPlate.querySelectorAll("LinearRing posList")).map((el) => {
                let ring = el.innerHTML.split(/\s+/g).map(parseFloat).filter((n) => {return !isNaN(n)}).reduce((acc, cur) => {
                    if (acc.at(-1) === undefined || acc.at(-1)[1] !== undefined) {
                        acc.push([cur])
                    }
                    else {
                        acc.at(-1).unshift(cur);
                    }

                    return acc;
                }, [])

                //check if the ring is a ring around the north or southpole
                let crosses = ring.reduce((crosses, coord, i, ring) => {
                    if (i !== 0) {
                        let prevLat = ring[i-1][0];
                        let curLat = coord[0];

                        if (Math.abs(curLat - prevLat) > 180) {
                            crosses.push([i-1, i]);
                        }
                    }

                    return crosses;
                }, []);

                let isAround = crosses.length % 2 !== 0;

                if (isAround) {
                    let lng = 89;
                    if (ring.at(-1)[1] < 0) {
                        lng = lng * -1;
                    }

                    crosses.forEach((crossover, i) => {
                        let cA = [ring.at(crossover[0])[0], lng]
                        let cB = [ring.at(crossover[1])[0], lng]

                        ring.splice(crossover[1], 0, cB);
                        ring.splice(crossover[1], 0, cA);
                    });
                }
                else {
                    //check every coord, if it would wrap the date line, instead continue drawing 'outside' the map.
                    //When this happens, add a 'shadow ring' on the other side of the world (lat + or - 360);
                    let addShadowRing = false;
                    ring.forEach((coord, i) => {
                        if (i === 0) return;

                        let curLat = ring[i][0];
                        let prevLat = ring[i-1][0];

                        if (Math.abs(curLat - prevLat) > 180) {
                            if (prevLat < 0) { ring[i][0] -= 360; addShadowRing = 360 }
                            else             { ring[i][0] += 360; addShadowRing = -360 }
                        }
                    });

                    //Add a shadow ring if neccecery
                    if (addShadowRing !== false) {
                        let shadowRing = ring.map((c) => {return [c[0] + addShadowRing, c[1]]})

                        shadowRings.push(shadowRing);
                    }
                }

                return ring;
            }).concat(shadowRings)
        }

        if (plate.rings.length === 0) {
            result.errors.push({
                msg: `Plate ${plate.id} ${plate.name} has no geometric feature, not added`,
                plate: plate,
                gmlPlate: gmlPlate
            });
        }
        if (gmlPlate.querySelectorAll("Polygon exterior").length !== plate.rings.length - shadowRings.length) {
            result.errors.push({
                msg: `Plate ${plate.id} ${plate.name} has a more complex geometric model then we currently support, not added`,
                plate: plate,
                gmlPlate: gmlPlate
            });
        }
        else {
            result.plates.push(plate);
        }

    });

    //remove unconstraint plates (id 1001)
    result.plates = result.plates.filter((plate) => {return plate.id !== "1001"})

    //TODO: find a good solution to draw these plates correctly
    //remove plates that are not drawn correctly
    result.plates = result.plates.filter((plate) => {return plate.id !== "901"})
    result.plates = result.plates.filter((plate) => {return plate.id !== "804"})
    result.plates = result.plates.filter((plate) => {return plate.id !== "409"})
    result.plates = result.plates.filter((plate) => {return plate.id !== "119"})

    return result;
}

function onCheckOverlap(vnode) {
    vnode.state.showOverlappings = [0, 9];

    let shapes = vnode.state.plates.reduce((shapes, plate) => {
        plate.rings.forEach((ring, i) => {
            shapes.push({
                id: plate.id,
                name: plate.name,
                ringInd: i,
                ring: ring,
                area: helpers.geo.areaOf(ring),
                extent: extentToPolygon(helpers.geo.extentOf(ring), 0.1)
            })
        });
        return shapes;
    }, []);


    let overlappings = [];
    shapes.forEach((shapeA, i) => {
        console.log(`${i} / ${shapes.length}`)
        console.log(shapeA.extent)

        shapes.forEach((shapeB, j) => {
            if (j <= i) { return; }

            if (helpers.geo.intersect(shapeA.extent, shapeB.extent).length === 0) {
                return;
            }

            //in square meteres
            let epsilon = vnode.state.overlapEpsilon;

            let intersections = helpers.geo.intersect(shapeA.ring, shapeB.ring);

            //remove very small overlappings;
            intersections = intersections.filter((intersection) => {
                return helpers.geo.areaOf(intersection) > epsilon;
            })

            let intersection = {
                polygon: intersections,
                area: intersections.reduce((total, intersection) => {return total + helpers.geo.areaOf(intersection)}, 0)
            }

            //remove overlappings where the complete shape is encapsulated
            if ((((intersection.area + 0.5*epsilon) > shapeA.area && (intersection.area - 0.5*epsilon) < shapeA.area) ||
                ((intersection.area + 0.5*epsilon) > shapeB.area && (intersection.area - 0.5*epsilon) < shapeB.area)))
                return;

            if (intersection.polygon.length !== 0) {
                overlappings.push({
                    shapeA: shapeA,
                    shapeB: shapeB,
                    intersection: intersection
                })
            }
        });
    });

    overlappings = overlappings.sort((a, b) => {return b.intersection.area - a.intersection.area})

    vnode.state.overlappings = overlappings;
    m.redraw();
}


function extentToPolygon(extent, padding) {
    padding = padding ?? 0;

    let bounds = [
        [extent.maxLat + padding, extent.maxLng + padding],
        [extent.minLat - padding, extent.maxLng + padding],
        [extent.minLat - padding, extent.minLng - padding],
        [extent.maxLat + padding, extent.minLng - padding],
        [extent.maxLat + padding, extent.maxLng + padding],
    ]

    return bounds;
}
