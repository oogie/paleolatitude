import { m, helpers, options } from "../stdimports.js";


export const sessionStorageHelpers = {

    getAllLocations: function getAllLocations() {
        return helpers.general.deserialize(window.sessionStorage.getItem("locations") || "[]");
    },

    getLocation: function getLocation(id) {
        return sessionStorageHelpers.getAllLocations().find((l) => {return l.id === id});
    },

    setLocation: function setLocation(locationPartial, skipCalculation) {
        let allLocations = sessionStorageHelpers.getAllLocations();
        let location = helpers.general.makeLocation(locationPartial, allLocations);

        //start the API call to calculate the paleolatitude
        if (skipCalculation !== true) {
            location = recalculateLocation(location);
        }

        //place location in the allLocations array at the correct index
        let locationIndex = allLocations.findIndex((l) => {return l.id === location.id});
        if (locationIndex === -1) { allLocations.push(location) }
        else { allLocations[locationIndex] = location; }

        //store the new information
        setAllLocations(allLocations);

        m.redraw();

        return location;
    },

    removeLocation: function removeLocation(id) {
        let allLocations = sessionStorageHelpers.getAllLocations();
        allLocations = allLocations.filter((l) => {return l.id !== id});
        setAllLocations(allLocations);
    },

    removeAllLocations: function removeAllLocations() {
        setAllLocations([]);
    },

    selectLocation: function selectLocation(id) {
        let allLocations = sessionStorageHelpers.getAllLocations();

        let changed = false;
        allLocations = allLocations.map((loc) => {
            let oldVal = loc.selected

            if (loc.id === id) { loc.selected = true; }
            else { loc.selected = false; }

            if (oldVal !== loc.selected) {
                changed = true;
            }

            return loc;
        })

        if (changed) { setAllLocations(allLocations) }
        return changed
    },

    getOption: function getOption(name) {
        return helpers.general.deserialize(window.sessionStorage.getItem("option_" + name.toString())) || options.findDefault(name).value;
    },

    setOption: function getOption(name, value) {
        if (value === undefined) {
            value = options.findDefault(name).value
        }
        return window.sessionStorage.setItem("option_" + name.toString(), helpers.general.serialize(value));
    },




}

function setAllLocations(allLocations) {
    window.sessionStorage.setItem("locations", helpers.general.serialize(allLocations));
}

function recalculateLocation(location) {
    location.status = "loading";
    location.calc = undefined;
    location.error = undefined;

    helpers.api.getPaleolatitude(location)
        .then((calculations) => {
            location.status = "ready";
            location.calc = calculations;
        })
        .catch((error) => {
            location.status = "error";
            location.error = error;
        })
        .finally(() => {
            sessionStorageHelpers.setLocation(location, true);

            if (location.status === "error") {
                sessionStorageHelpers.selectLocation(location.id);
            }
        })

    return location;
}
