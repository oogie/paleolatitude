import { m, helpers, options } from '../../shared/stdimports.js';

import './iplocbtn.less';


export const comp = {

    oninit: function(vnode) {

    },

    view: function(vnode) {
        let iploc = vnode.attrs.locations.find((loc) => { return loc.isiploc });

        return (
            <button class={`comp iplocbtn flex ${iploc === undefined ? "btn_secondary" : (iploc.status !== "ready" || iploc.selected ? "disabled" : "")}`} onclick={() => {
                if (iploc === undefined) {
                    onAddIPLocation(vnode)
                }
                else {
                    if (helpers.sessionStorage.selectLocation(iploc.id)) {
                        m.redraw();
                    }
                }
            }}>
                {iploc === undefined ? (
                    <div key="unloaded" style='display:contents;'>
                        <i class="fa-solid fa-map-location-dot fa-lg"></i>
                        <span style='text-align: left;'>
                            Add your current location<br/>
                            <small><small>estimated based on ip-address</small></small>
                        </span>
                    </div>
                ) : iploc.status !== "ready" ? (
                    <div key="loading" style='display:contents;'>
                        <div class='statusicon' style={'color: ' + iploc.color}>
                            <div key={iploc.status}>{m.trust(options.find("locationStatusMarker", iploc.status).label)}</div>
                        </div>
                        <span style='text-align: left;'>
                            Loading your location...<br/>
                            <small><small>estimated based on ip-address</small></small>
                        </span>
                    </div>
                ) : (
                    <div key="loaded" style='display:contents;'>
                        <div class='statusicon' style={'color: ' + iploc.color}>
                            <div key={iploc.status}>{m.trust(options.find("locationStatusMarker", iploc.status).label)}</div>
                        </div>
                        <span style='text-align: left;'>
                            Your location is added!<br/>
                            <small><small>estimated based on ip-address</small></small>
                        </span>
                    </div>
                )}
            </button>
        )
    }

}
function onAddIPLocation(vnode) {
    helpers.api.getIPLocation().then((resp) => {
        let loc = helpers.sessionStorage.setLocation({coord: resp.coord, isiploc: true});

        var intervalId = window.setInterval(() => {
            if (loc.status === "ready") {
                helpers.sessionStorage.selectLocation(loc.id);
                m.redraw();
                window.clearInterval(intervalId);
            }
        }, 100);

        window.setTimeout(() => {window.clearInterval(intervalId)}, 10_000)
    })
}
