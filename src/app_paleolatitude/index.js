import { m } from '../shared/stdimports.js';


//styling
import '../shared/styling/paleo.less';
import './index.less';

//pages
import {page as Header} from "./pages/header/_header.js"
import {page as Footer} from "./pages/footer/_footer.js"

import {page as Home} from "./pages/home/_home.js"
import {page as Temperature} from "./pages/temperature/_temperature.js"
import {page as Advanced} from "./pages/advanced/_advanced.js"
import {page as About} from "./pages/about/_about.js"
import {page as Papers} from "./pages/papers/_papers.js"
import {page as Team} from "./pages/team/_team.js"
import {page as Projects } from "./pages/projects/_projects.js"

import {page as Polygonanalysis} from "./pages/polygonanalysis/_polygonanalysis.js"


// Load the exporting module.
import Highcharts from "highcharts";
import Exporting from 'highcharts/modules/exporting';
import OfflineExporting from 'highcharts/modules/offline-exporting';
import FullScreen from 'highcharts/modules/full-screen.js';
Exporting(Highcharts);
OfflineExporting(Highcharts);
FullScreen(Highcharts);

window.envconfig = {
    domain: "https://paleolatitude.org/",
}

initApp();


function initApp() {
    mountUI();
}

function mountUI() {
    var abc = {};

    m.mount(document.getElementById("header"), Header);
    m.mount(document.getElementById("footer"), Footer);


    m.route(document.getElementById("app"), "/", {
        "/": {onmatch: () => {onRouting(); return Home}},
        "/advanced": {onmatch: () => {onRouting(); return Advanced}},
        "/about": {onmatch: () => {onRouting(); return About}},
        "/papers": {onmatch: () => {onRouting(); return Papers}},
        "/team": {onmatch: () => {onRouting(); return Team}},
        "/projects": {onmatch: () => {onRouting(); return Projects}},
        
        // "/paleotemperature": {onmatch: () => {onRouting(); return Temperature}},
        "/polygonanalysis": {onmatch: () => {onRouting(); return Polygonanalysis}},
    });

    function onRouting(route) {
        window.scroll(0, 0);


        window.setTimeout(() => {
            let route = m.route.get();
            let root = document.querySelector(':root');

            //todo, find a better way of doing this an a better place of configuring it. (with a css variable for both versions?
            if (route.startsWith("/paleotemperature")) {
                root.style.setProperty("--txt_primary", "#E63946");
                root.style.setProperty("--elm_primary", "#E63946");
                root.style.setProperty("--elm_secondary", "#293971");
            }
            else {
                root.style.setProperty("--txt_primary", "#293971");
                root.style.setProperty("--elm_primary", "#293971");
                root.style.setProperty("--elm_secondary", "#E63946");
            }

        })

    }
}
