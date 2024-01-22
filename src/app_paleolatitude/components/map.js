import { m, helpers, options, config } from '../../shared/stdimports.js';

import "./map.less";

import 'ol/ol.css';
import * as ol from 'ol';

import View from 'ol/View';
import Projection from 'ol/proj/Projection';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';

import Graticule from 'ol/layer/Graticule';

import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js'; 
import VectorSource from 'ol/source/Vector.js';
import { OSM } from 'ol/source';

import { Fill, Stroke, Style } from 'ol/style';

import { Polygon } from 'ol/geom'
import * as olRender from 'ol/render';

import Overlay from 'ol/Overlay';
import Point from 'ol/geom/Point';

import {fromLonLat} from 'ol/proj';
import {containsCoordinate} from 'ol/extent';

import KML from 'ol/format/KML.js';

import KML_plateborders from '../assets/plateborders.kml';



export const comp = {

    oninit: function (vnode) {
        vnode.state.projection = helpers.sessionStorage.getOption("mapProjection");
    },

    oncreate: function (vnode) {
        initMap(vnode);
        updateLocations(vnode);
    },

    view: function (vnode) {
        //if the projection changed, init the map again
        let newProjection = helpers.sessionStorage.getOption("mapProjection");
        if (newProjection !== vnode.state.projection) {
            vnode.state.projection = newProjection;
            changeProjection(vnode);
        }

        updateLocations(vnode);


        return (
            <div class={`comp map ${vnode.state.showGraph > 0 ? "graphVisible" : ""}`}  tabindex="0">

                <div id="map" />

                <div id="newLocMarker">
                    {vnode.attrs.locations.length < config.maxLocations ? (
                        <div key="newLocation" style='display: contents;'>
                            <i class="fa-thin fa-location-dot fa-3x"></i>
                            <a
                                class="description"
                                href="javascript:"
                                onclick={(e) => {
                                    var overlay = vnode.state.map.getOverlayById("newLocMarker");
                                    var moll_coordinate = overlay.getPosition()
                                    var merc_coordinate = new Point(moll_coordinate).transform(vnode.state.map.getView().getProjection(), 'EPSG:4326').getFirstCoordinate()
                                    helpers.sessionStorage.setLocation({
                                        coord: { lat: merc_coordinate[1], lon: merc_coordinate[0] }
                                    })

                                    //hide newLocMarker overlay
                                    overlay.setPosition(undefined)
                                }}
                                onwheel={(e) => {
                                    //prevents scrolling the page when scrolled on this link
                                    //the user might whant to zoom the map
                                    return false;
                                }}
                            >show paleolatitude</a>
                        </div>
                    ) : (
                        <div key="maxlocations" style='display: contents;'>
                            <i class="fa-solid fa-xmark fa-2x"></i>
                            <a
                                class="description"
                                href="javascript:"
                                onclick={(e) => {
                                    //hide newLocMarker overlay
                                    var overlay = vnode.state.map.getOverlayById("newLocMarker");
                                    overlay.setPosition(undefined)
                                }}
                                onwheel={(e) => {
                                    //prevents scrolling the page when scrolled on this link
                                    //the user might whant to zoom the map
                                    return false;
                                }}
                            >Max. locations</a>
                        </div>
                    )}
                </div>

            </div>
        )
    }
}


function initMap(vnode) {
    const sphereMollweideProjection = setupProjection(vnode);
    const layer_streetMap = setupStreetMap();
    const layer_graticule = setupGraticule();
    // const plateborders = setupPlateborders();

    setupMaskingOval(layer_streetMap, sphereMollweideProjection)

    const map = new ol.Map({
        // layers: [layer_streetMap, layer_graticule, plateborders],
        layers: [layer_streetMap, layer_graticule],
        target: 'map',
        view: new View({
            projection: sphereMollweideProjection,
            center: [0, 0],
            zoom: 0,
            extent: [-27000000, -12000000, 27000000, 12000000], //todo, this has to change to the view extend???

            enableRotation: false
        })
    });

    vnode.state.map = map;
    setupEvents(vnode);

    //give the map focus so the zoom events will work without clicking on the map first
    document.querySelector(".comp.map").focus();
}

function setupProjection(vnode) {
    var projParams = {
        "ESRI:54009": "+proj=moll +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 units=m +no_defs",
        "EPSG:3857": "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs"
    }

    var projExtend = {
        "ESRI:54009": [-18019909.21177587, -9009954.605703328, 18019909.21177587, 9009954.605703328],
        "EPSG:3857": [-20037508.34, -20048966.1, 20037508.34, 20048966.1]
    }

    proj4.defs(vnode.state.projection, projParams[vnode.state.projection]);
    // Maybe usefull when we want to move the mollweide center
    // proj4.defs('ESRI:54009', '+proj=moll +lon_0=0 +x_0=0 +y_0=0 +a=8070997 +b=8070997 +datum=WGS84 units=m +no_defs');
    // proj4.defs('ESRI:54009', '+proj=moll +lon_0=270 +x_0=0 +y_0=0 +datum=WGS84 units=m +no_defs');
    register(proj4);

    const proj = new Projection({
        code: vnode.state.projection,
        extent: projExtend[vnode.state.projection],
        worldExtent: [-179.99, -89.99, 179.99, 89.99],
    });

    return proj;
}

function setupStreetMap() {
    return new TileLayer({
        source: new OSM({
            zDirection: 2,
        })
    })
}

function setupGraticule() {
    return new Graticule({
        showLabels: true, //show lat long labels
        lonLabelFormatter: (lon) => {
            return ""; //remove longitude labels
        },
        latLabelFormatter: function labelFormatter(lat) {
            //on the map, degrees are odly specific around the poles
            //round it to 90 degrees N or S
           if (lat > 88.9999) lat = 90;
           if (lat < -88.9999) lat = -90;

            return helpers.geo.latitudeFormatter(lat);
        },
        strokeStyle: new Stroke({
            color: 'rgba(0, 0, 0, 0.2)'
        })
    })
}

function setupPlateborders() {
    return new VectorLayer({
        source: new VectorSource({
            url: KML_plateborders,
            format: new KML(),
        }),
    });

}

function setupMaskingOval(layer, projection) {
    var coordinates = [];
    for (var i = 90; i >= -90; --i) {coordinates.push([-179.99, i * 0.9999])}
    for (var i = -90; i <= 90; ++i) {coordinates.push([179.99, i * 0.9999])}
    coordinates.push(coordinates[0]);

    var clip = new Polygon([coordinates]).transform('EPSG:4326', projection);
    var style = new Style({ fill: new Fill() });

    layer.on('postrender', function (e) {
        const vectorContext = olRender.getVectorContext(e);
        e.context.globalCompositeOperation = 'destination-in';
        vectorContext.setStyle(style);
        vectorContext.drawGeometry(clip);
        e.context.globalCompositeOperation = 'source-over';
    });
}

//todo break up this function
function setupEvents(vnode) {
    new ResizeObserver(onMapResize).observe(vnode.state.map.getViewport())
    function onMapResize() {
        vnode.state.map.updateSize();
    }

    //New Location popup
    const newLocOverlay = new Overlay({
        id: "newLocMarker",
        element: document.getElementById('newLocMarker'),
    });
    vnode.state.map.addOverlay(newLocOverlay);

    vnode.state.map.on("click", function(evt) {
        moveNewLocMarker(evt.coordinate);
    });

    vnode.state.map.getViewport().addEventListener('contextmenu', function (evt) {
        newLocOverlay.setPosition(undefined);
        var changed = helpers.sessionStorage.selectLocation(undefined);
        if (changed) { m.redraw() };
    })


    function moveNewLocMarker(coord) {
        var changed = helpers.sessionStorage.selectLocation(undefined);
        if (changed) { m.redraw() };

        if (isInsideMaskingOval(coord)) {
            //TODO find a better solution for this without waiting (by canceling the 'click' event
            //Wait a litle while to move the overlay.
            //The touch event on smartphones will otherwise directly 'click' the 'show paleolatitude' link inside the overlay
            window.setTimeout( () => {
                newLocOverlay.setPosition(coord);
            }, 50);
        }
        else {
            newLocOverlay.setPosition(undefined);
        }

        function isInsideMaskingOval(c) {
            //Check if the coordinate is inside the 'main world' (not exiding the date line)
            //by converting the clicked loaction to mercator and back to the map projection and check if it changed
            const merc = new Point(c).transform(vnode.state.map.getView().getProjection(), 'EPSG:4326').getFirstCoordinate();
            const c2 = new Point(merc).transform('EPSG:4326', vnode.state.map.getView().getProjection()).getFirstCoordinate();

            return Math.abs(c[0]-c2[0])<1 && Math.abs(c[1]-c2[1])<1
        }
    }

    vnode.dom.addEventListener("focusout", hideNewLocMarker);
    vnode.dom.addEventListener("click", (e) => {
        //if clicked anywhere outside of the map, hide the newLocMarker
        if (e.target.classList.contains("comp", "map") || e.target.closest("#graph") !== null) {
            hideNewLocMarker(e);
        }
    });

    function hideNewLocMarker(e) {
        //on focusout from the map if clicked on the "#newLocMarker" do nothing, otherwise hide the overlay
        if (e.relatedTarget && e.relatedTarget.closest("#newLocMarker, .locMarker") !== null) {
            return;
        }
        else {
            newLocOverlay.setPosition(undefined);
            var changed = helpers.sessionStorage.selectLocation(undefined);
            if (changed) { m.redraw() };
        }
    }
}

function updateLocations(vnode) {
    //if the map is not yet inited, skip
    if (vnode.state.map === undefined) return;

    //make a shallow copy of the overlays array, because openlayers will live edit the array when removing a overlay.
    [].concat(vnode.state.map.getOverlays().array_).forEach((overlay) => {
        //open layers sometimes keeps overlays that are already removed as 'undefined', skip these.
        if (overlay === undefined) return;

        if (overlay.id.startsWith("location")) {
            let location = vnode.attrs.locations.find((l) => {return l.id === overlay.id.replace("location", "")});

            if (location === undefined || isNaN(location.coord.lat) || isNaN(location.coord.lon)) {
                vnode.state.map.removeOverlay(overlay)
            }
        }
    });

    vnode.attrs.locations.forEach((location, i) => {
        if (isNaN(location.coord.lat) || isNaN(location.coord.lon)) {
            return;
        }

        let overlay = vnode.state.map.getOverlayById("location" + location.id);

        if (overlay === null) {
            var el = document.createElement("div");
            el.id = location.id;
            el.classList.add("locMarker");
            el.addEventListener('click', (e) => {
                vnode.state.map.getOverlayById("newLocMarker").setPosition(undefined);

                var changed = helpers.sessionStorage.selectLocation(location.id);
                if (changed) { m.redraw() };
            });

            overlay = new Overlay({
                id: "location" + location.id,
                element: el,
            });

            vnode.state.map.addOverlay(overlay);
        }

        let moll_coordinate = fromLonLat([location.coord.lon, location.coord.lat], vnode.state.map.getView().getProjection());
        overlay.setPosition(moll_coordinate);

        overlay.element.children[0].innerHTML = `
            <div class='icon ${location.status}' style='color: ${location.color};'>
                ${options.find("locationStatusMarker", location.status).label}
            </div>
            <div class='selectedbox description'>
                <div class='remove'>
                    <a href="javascript:">remove location</a>
                </div>
                ${location.status === "error" ?
                    `<span class='errorMsg'>${location.error}</span>` :
                    ""
                }
            </div>
        `;

        overlay.element.children[0].querySelector(".remove a").addEventListener("click", (e) => {
            helpers.sessionStorage.removeLocation(location.id);
            m.redraw()
        })

        overlay.element.children[0].querySelector(".icon").addEventListener("mouseenter", (e) => {
            if (location.status === "ready") {
                vnode.attrs.setHoverdLocation(location.id);
            }
        })
        overlay.element.children[0].querySelector(".icon").addEventListener("mouseleave", (e) => {
            vnode.attrs.setHoverdLocation(undefined);
        })


        if (location.selected) {
            overlay.element.children[0].classList.add("selected");

            var view = vnode.state.map.getView()
            let extend = view.calculateExtent(vnode.state.map.getSize());
            let coord = fromLonLat([location.coord.lon, location.coord.lat], view.getProjection());

            if (!containsCoordinate(extend, coord)) {
                view.animate({
                  center: coord,
                  duration: 600,
                });
            }

        }
        else { overlay.element.children[0].classList.remove("selected"); }
    })
}



function changeProjection(vnode) {

    vnode.state.map.setView(new View({
        projection: setupProjection(vnode), //take values of the exesiting map!
        center: [0, 0], //take values of the exesiting map!
        zoom: 0, //take values of the exesiting map!
        extent: [-27000000, -12000000, 27000000, 12000000], //take values of the exesiting map!

        enableRotation: false //take values of the exesiting map!
    }))

}
