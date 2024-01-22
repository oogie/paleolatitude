import { m, options, helpers } from '../../../shared/stdimports.js';


//styling
import './locationDetails.less';
import { comp as Input_text } from '../../../shared/components/input_text.js';


export const comp = {

    view: function(vnode) {
        let location = vnode.attrs.location;

        let latval = isNaN(location.coord.lat) ? "" : location.coord.lat;
        let lonval = isNaN(location.coord.lon) ? "" : location.coord.lon;

        return (
            <div key={location.id} class={`comp locationDetails ${location.status}`}>
                <div class='statusicon' style={'color: ' + location.color} onclick={(e) => {
                    vnode.attrs.selectLocation(location.id)
                }}>
                    <div key={location.status}>{m.trust(options.find("locationStatusMarker", location.status).label)}</div>
                </div>
                {location.status === "loading" ? m.fragment([
                    <small>{latval}</small>,
                    <small>{lonval}</small>
                ]) : (
                    <div style='display: contents;'>
                        <Input_text key={location.id + "lat"} placeholder="Latitude (not set)"  value={latval} onblur={(val) => {location.coord.lat = val; onLocationChanged(vnode.attrs.location)}} />
                        <Input_text key={location.id + "lon"} placeholder="Longitude (not set)" value={lonval} onblur={(val) => {location.coord.lon = val; onLocationChanged(vnode.attrs.location)}} />
                    </div>
                )}
                <div class='location'>
                    {location.calc && location.calc.plate.name && location.calc.plate.name !== "" ? <small>on: {location.calc.plate.name}</small> : "-"}
                </div>
                <div style='display: contents;'>
                    <Input_text key={location.id + "age"}    placeholder="Age (Ma)"      value={location.age} onblur={(val) => {location.age = val; onLocationChanged(vnode.attrs.location)}} />
                    <Input_text key={location.id + "ageMin"} placeholder="Min age (Ma)"  value={location.minAge} onblur={(val) => {location.minAge = val; onLocationChanged(vnode.attrs.location)}} />
                    <Input_text key={location.id + "ageMax"} placeholder="Max age (Ma)"  value={location.maxAge} onblur={(val) => {location.maxAge = val; onLocationChanged(vnode.attrs.location)}} />
                </div>
                <a class='removeloc' href="javascript:" onclick={(e) => {helpers.sessionStorage.removeLocation(location.id)}}>remove location</a>
                {location.status === "error" ? (
                    <small class='errormsg'>{location.error}</small>
                ) : ""}
            </div>
        )
    }

}

function onLocationChanged(location) {
    helpers.sessionStorage.setLocation(location);
}
