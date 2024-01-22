import { m } from '../../../shared/stdimports.js';


//styling
import './_about.less';

//components
import { comp as Showmore } from '../../components/showmore.js';




export const page = {

    oninit: function(vnode) {

    },

    onremove: function(vnode) {

    },

    view: function(vnode) {
        return (
            <div class="page about">
                {/* <div class='section content_width_standard flexequal'>
                    <div>
                        <h2>About Paleolatitude.org</h2>
                        <span>
                            Lorum Ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget
                        </span>

                    </div>
                    <div class='filler'></div>
                </div> */}


                <div class='section content_width_standard flexequal'>
                    <div>
                        <h3>Code and Data</h3>
                        <span>
                            If you use paleolatitude.org and/or its source code for research purposes, we kindly
                            ask you to cite our work. See <a href='./#!/papers'>the citation page</a> for more
                            information. The code and data licenses are detailed below.
                        </span>
                        <br/><br/>

                        <h4>Source code license</h4>
                        <span>
                            All source code for the model that was developed for paleolatitude.org is available
                            under the LGPL v3 license. This license allows for free use and redistribution of the
                            source code, subject to a number of restrictions:
                        </span>

                        <ul>
                            <li>
                                you are free to use the code in your own software (i.e., dynamically link to it)
                                without any consequences for the choice of license of your application, but any
                                derivative work must be released under the same LGPL license.
                            </li>
                            <li>
                                regardless of how you use the code, you are required to attribute the original authors.
                                Please see the citation page for more information on how to do that.
                            </li>
                        </ul>

                        <b>
                            The source code (C++) of the calculation engine:
                        </b>

                        <a href="http://github.com/sj/paleolatitude" class='unobtrusive' target="_blank">
                            <div class='githubpromo flex'>
                                <i class="fa-brands fa-github fa-5x"></i>
                                <span>
                                    <a href='http://github.com/sj/paleolatitude' target="_blank">github.com/sj/paleolatitude</a><br/>
                                    <small class='txt_default_lesser'>@sj - Bas van Schaik</small>
                                </span>
                            </div>
                        </a>

                        <b>
                            The source code of this webapplication:
                        </b>

                        <a href="https://github.com/oogie/paleolatitude" class='unobtrusive' target="_blank">
                            <div class='githubpromo flex'>
                                <i class="fa-brands fa-github fa-5x"></i>
                                <span>
                                    <a href='https://github.com/oogie/paleolatitude' target="_blank">github.com/oogie/paleolatitude</a><br />
                                    <small class='txt_default_lesser'>@oogie - Joren Paridaens</small>
                                </span>
                            </div>
                        </a>

                        <h4>Data license</h4>
                        <span>
                            All (geophysical) data that is published on this web site is made available to the public domain.
                        </span>

                        <div class='section'></div>
                        <h3>Privacy and data security statement</h3>
                        <span>
                            All data uploaded to our server (single coordinates and bulk coordinate files) is handled with
                            care. We make an effort to not store any contents of the uploaded data. Only a statistical counter
                             is kept i.e how many requests have we handled.
                            <br/><br/>

                            It is not allowed to upload any sensitive or personal data to our servers.
                        </span>
                    </div>



                    <div>
                        <h3>Changelog</h3>
                        <span>
                            We will keep this website up to date with the latest advances in plate kinematic
                            reconstructions and paleomagnetic reference frames. This page will detail which
                            updates have been carried out, and where the current website differs from the original
                            as published in van Hinsbergen et al., 2015, PLOS ONE.
                        </span>

                        <div class='versionheader'>
                            <h4>Version 3.beta.0</h4>
                            <span>&mdash; november 2023</span>
                        </div>
                        <ul>
                            <li>Description coming soon!</li>
                        </ul>

                        <div class='versionheader'>
                            <h4>Version 2.1</h4>
                            <span>&mdash; april 2016</span>
                        </div>
                        <Showmore moreLabel="Show all changes" preview="true">
                            <ul>
                                <li>
                                    Model data corrections: adjustments in location of the Alpine Fault in
                                    New Zealand, the Melanesian Trench, and Western Central America.
                                </li>
                                <li>
                                    Additionally, small discrepancies (plate names and identifiers) between model
                                    data and as listed on plate reconstruction page have been corrected: identifier
                                    of plate 'Tarim' has been updated (now 430, as listed on plate reconstruction page),
                                    plate 'Mendeleyev Ridge' is now part of 'Northeast Siberia' (490), identifier
                                    of North Mozambique corrected to 712, missing plates added to table on plate
                                    reconstruction page.
                                </li>
                            </ul>
                        </Showmore>



                        <div class='versionheader'>
                            <h4>Version 2.0</h4>
                            <span>&mdash; february 2016</span>
                        </div>
                        <Showmore moreLabel="Show all changes" preview="true">
                            The paleolatitude calculator has been updated to cover the entire Phanerozoic (550-0 Ma),
                            where possible. The changes compared to the original calculator as described in Van Hinsbergen
                            et al. (2015) are the following.
                            <ul>
                                <li>
                                    Paleolatitudes and error bars are now available for the full age range covered by
                                    the APWP of Kent and Irving (2010), i.e., 230-50 Ma;
                                </li>
                                <li>
                                    Paleolatitudes and error bars are now available for the full age range covered
                                    by the GAPWaP of Torsvik et al. (2012), i.e., 320-0 Ma.
                                </li>
                                <li>
                                    Paleolatitudes and error bars of the China blocks have been extended beyond 130
                                    Ma using the China APWP of Van der Voo et al. (2015). North China paleolatitudes
                                    are available since 230 Ma, and South China paleolatitudes since 170 Ma, as explained
                                    by those authors.
                                </li>
                                <li>
                                    For times prior to 320 Ma, we have included the spline-fitted APWP’s of Torsvik
                                    et al. (2012) for Gondwana (Africa, India, Madagascar, Australia, Antarctica, South
                                    America), Laurentia (North America and Greenland), Baltica, and Siberia.
                                    The spline fitting methodology used by Torsvik et al. does not allow to quantify
                                    uncertainties, and pre-320 Ma paleolatitudes are therefore included without error bars.
                                </li>
                                <li>
                                    Because some of the major post-200 Ma continents consist of fragments that were on
                                    separate plates prior to 320 Ma, the plate model has been slightly modified. The Eurasian
                                    plate (originally coded 301) is now separated into Baltica (301), Siberia (401), and the
                                    Eurasian Variscides (315) that does not extend back farther than 320 Ma. We added the Alleghanian
                                    orogen of North America (199), which prior to 320 Ma was not part stable Laurentia.
                                    The original polygon 601 for the amalgamated China blocks is now broken down into North
                                    China (601), South China (602) and Amuria (453).
                                </li>
                            </ul>
                        </Showmore>


                        <div class='versionheader'>
                            <h4>Before version 2.0</h4>
                        </div>
                        <ul>
                            <li>
                                <b>Version 1.2</b>, June 2015: corrected inaccuracy in data set Besse & Courtillot (2002)
                                regarding Indian plate (501).
                            </li>
                            <li>
                                <b>Version 1.1</b>, June 2015: corrected minor miscalculation in latitude lower and upper
                                bounds. Minor corrections to data for following plates: Arabia (503), North-East
                                Siberia (409), and North China (601).
                            </li>
                            <li>
                                <b>Version 1.0</b>, April 2015: revised version, as submitted to PLOS ONE. Includes additional
                                paleomagnetic reference frames.
                            </li>
                            <li>
                                <b>Version 0.98</b>, September 2014: original version, as submitted to PLOS ONE
                            </li>
                        </ul>

                    </div>



                </div>


            </div>
        )
    }

}
