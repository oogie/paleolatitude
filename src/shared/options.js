
export const options = {

    find: function(type, value) {
        return options[type].find((option) => {return option.value == value})
    },

    findLabel: function(type, value) {
        return (options.find(type, value) || {}).label
    },

    findDefault: function(type) {
        if (options[type] === undefined) {
            return {
                value: undefined,
                label: undefined
            };
        }
        else {
            return options[type].find((option) => {return option.default}) || options[type][0]
        }
    },


    bool: [
        {value: "true", label: "True", default: true},
        {value: "false", label: "False"}
    ],

    paleomagneticReferenceFrame: [
        {value: "vaes", label: "Vaes et al. (2023, default)", default: true},
        {value: "torsvik", label: "Torsvik et al. (2012)"},
        {value: "besse-courtillot", label: "Besse & Courtillot (2002)"},
        {value: "kent-irving", label: "Kent & Irving (2010)"},

    ],

    chartXAxisModus: [
        {value: "fixed",  label: "Fixed"},
        {value: "flexible",  label: "Flexible", default: true},
    ],

    chartYAxisModus: [
        {value: "fixed",  label: "Fixed", default: true},
        {value: "flexible",  label: "Flexible"},
    ],

    chartXAxisMin: [
        {value: "0", label: "chartXAxisMin", default: true},
    ],

    chartXAxisMax: [
        {value: "550", label: "chartXAxisMax", default: true},
    ],

    chartYAxisMin: [
        {value: "-90", label: "chartYAxisMin", default: true},
    ],

    chartYAxisMax: [
        {value: "90", label: "chartYAxisMax", default: true},
    ],



    locationStatusMarker: [
        {value: "loading", label: `<i class="fa-solid fa-rotate fa-spin fa-2x fa-fw"></i>`, default: true},
        {value: "error", label: `<i class="fa-solid fa-triangle-exclamation fa-2x fa-fw"></i>`},
        {value: "ready", label: `<i class="fa-solid fa-location-dot fa-2x fa-fw"></i>`},
    ],

    locationColor: [
        {value: 0,  label: "#0652DD", name: "Blue" },
        {value: 1,  label: "#EA2027", name: "Red" },
        {value: 2,  label: "#009432", name: "Green" },
        {value: 3,  label: "#FFC312", name: "Yellow" },
        {value: 4,  label: "#1B1464", name: "Dark Blue" },
        {value: 5,  label: "#ED4C67", name: "Salmon" },
        {value: 6,  label: "#C4E538", name: "Lime" },
        {value: 7,  label: "#12CBC4", name: "Teal" },
        {value: 8,  label: "#FDA7DF", name: "Pink" },
        {value: 9,  label: "#F79F1F", name: "Orange" },
        
        {value: 10, label: "#A3CB38", name: "Light Green" },
        {value: 11, label: "#1289A7", name: "Dark Teal" },
        {value: 12, label: "#D980FA", name: "Light Purple" },
        {value: 13, label: "#B53471", name: "Dark Pink" },
        {value: 14, label: "#EE5A24", name: "Dark Orange" },
        {value: 15, label: "#9980FA", name: "Purple" },
        {value: 16, label: "#833471", name: "Olive" },
        {value: 17, label: "#006266", name: "Dark Green" },
        {value: 18, label: "#6F1E51", name: "Dark Olive"},
        {value: 19, label: "#5758BB", name: "Alternative blue"},
        {value: 20, label: "#000000", default: true, name: "Black"}
    ],


    mapProjection: [
        {
            value: "ESRI:54009",
            label: "World Mollweide",
            default: true,

            name: "ESRI:54009",
            params: "+proj=moll +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 units=m +no_defs",
            extent: [-18019909.21177587, -9009954.605703328, 18019909.21177587, 9009954.605703328],
            worldextent: [-180.0, -90.0, 180.0, 90.0],
            basemapsrc: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            attributions: [
                `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>`
            ]
        },
        {
            value: "EPSG:3857",
            label: "WGS 84 / Pseudo-Mercator",

            name: "EPSG:3857",
            params: "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs",
            extent: [-20037508.34, -20048966.1, 20037508.34, 20048966.1],
            worldextent: [-180.0, -85.06, 180.0, 85.06],
            basemapsrc: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            attributions: [
                `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>`
            ]
        }
    ]

};
