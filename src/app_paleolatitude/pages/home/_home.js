import { m, helpers, options } from '../../../shared/stdimports.js';


//styling
import './_home.less';


//components
import { comp as Map } from '../../components/map.js';
import { comp as Graph } from '../../components/graph.js';
import { comp as Iplocbtn } from '../../components/iplocbtn.js';


export const page = {

    oninit: function(vnode) {

    },

    onremove: function(vnode) {

    },

    view: function(vnode) {
        let locations = helpers.sessionStorage.getAllLocations();

        return (
            <div class="page home">
                <div class='contentbar'>
                    <Graph
                        locations={locations}
                        series={["paleolatitude", "paleolatitudeCI"]}
                    />
                    <Map
                        locations={locations}
                        setHoverdLocation={(locId) => {Graph.setHoverdLocation(locId)}}
                    />
                </div>

                <div class={`content_width_standard actionbar flex`}>
                    <Iplocbtn
                        locations={locations}
                    />

                    <span class='txt_default_lesser'>
                        or click anywhere <i class="fa-solid fa-arrow-right-long fa-rotate-by" style="--fa-rotate-angle: -45deg;"></i>
                    </span>

                    <div style="flex-grow: 1;"></div>

                    <button onclick={() => {m.route.set("/advanced")}}>Advanced</button>
                </div>

                <div class="section flex features content_width_standard">
                    <div class='feature'>
                        <i class="fa-duotone fa-map-location-dot fa-8x"></i>
                        <h4>1. Choose  a location</h4>
                        <div>
                            Click anywhere on the world map, or see the paleolatitude for your current location.
                        </div>
                    </div>

                    <div class='feature'>
                        <i class="fa-duotone fa-flip-horizontal fa-chart-line fa-8x"></i>
                        <h4>2. View paleolatitude</h4>
                        <div>
                            Find out how the latitude of your location has changed over the eras.
                        </div>
                    </div>

                    <div class='feature'>
                        <svg class='svg-inline--fa fa-chart-line fa-flip-horizontal fa-8x' viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_236_354)">
                                <path class='fa-primary' d="M470.6 105.4C483.1 117.9 483.1 138.1 470.6 150.6L342.6 278.6C330.1 291.1 309.9 291.1 297.4 278.6L239.1 221.3L150.6 310.6C138.1 323.1 117.9 323.1 105.4 310.6C92.8798 298.1 92.8798 277.9 105.4 265.4L217.4 153.4C229.9 140.9 250.1 140.9 262.6 153.4L320 210.7L425.4 105.4C437.9 92.88 458.1 92.88 470.6 105.4Z" fill="currentColor"/>
                                <path class='fa-secondary' d="M107.841 101.146C112.416 84.0708 129.91 73.9708 146.985 78.5462L321.836 125.397C338.912 129.973 349.012 147.466 344.436 164.542L323.963 243.681L445.549 275.674C462.625 280.25 472.725 297.743 468.149 314.819C463.584 331.911 446.09 342.011 429.005 337.419L276.01 296.424C258.935 291.848 248.835 274.355 253.41 257.279L274.333 178.92L130.441 140.291C113.348 135.725 103.248 118.231 107.841 101.146Z" fill="currentColor"/>
                                <path class='fa-secondary' d="M32 32C49.67 32 64 46.33 64 64V400C64 408.8 71.16 416 80 416H480C497.7 416 512 430.3 512 448C512 465.7 497.7 480 480 480H80C35.82 480 0 444.2 0 400V64C0 46.33 14.33 32 32 32Z" fill="currentColor"/>
                            </g>
                            <defs>
                                <clipPath id="clip0_236_354">
                                    <rect width="512" height="512" fill="white"/>
                                </clipPath>
                            </defs>
                        </svg>
                        <h4>3. add  more locations</h4>
                        <div>
                            Compare the paleolatitude of multiple geologic plates. Up to 10 locations at a time can be compared by clicking on the world map.
                        </div>
                    </div>

                    <div class='feature'>
                        <i class="fa-duotone fa-lightbulb-on fa-8x"></i>
                        <h4>4. Advanced options</h4>
                        <div>
                            Want to input a specific coordinate, or maybe 10.000 coordinates at the same time? See the Advanced section for all the options.
                        </div>
                    </div>

                </div>


                <div class='section explainer content_width_narrow'>
                    <h2>What is paleolatitude</h2>
                    Paleolatitude is the latitude of a place at some time in the past, measured relative to the earth's
                    magnetic poles in the same period. Differences between this and the present latitude are caused by
                    continental drift and movement of the earth's magnetic poles.
                    <br/><br/><br/>

                    <h4>Scientific uses</h4>
                    If you use paleolatitude.org for research purposes, we ask that you cite our paper. We will keep this website
                    up to date with the latest advances in plate kinematic reconstructions and paleomagnetic reference frames.
                    <br/><br/>

                    See the ‘Advanced’ section to input specific coordinates, do bulk calculations for thousands of coordinates
                    and set the specific confidence interval for the age of your sample.
                </div>


            </div>
        )
    }

}
