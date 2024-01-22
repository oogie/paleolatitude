import { m } from '../../../shared/stdimports.js';


//styling
import './_papers.less';


import IMG_paper from '../../assets/paper.png';


export const page = {

    oninit: function(vnode) {

    },

    onremove: function(vnode) {

    },

    view: function(vnode) {
        return (
            <div class="page papers">
                <div class='section content_width_standard flexequal'>
                    <div>
                        <h2>A Paleolatitude Calculator for Paleoclimate Studies</h2>
                        <span>
                            If you use paleolatitude.org, its source code, and/or its data for research
                            purposes, we ask that you cite our paper:
                        </span>

                        <blockquote cite="http://doi.org/10.1371/journal.pone.0126946">
                            Douwe J.J. van Hinsbergen, Lennart V. de Groot, Sebastiaan J. van Schaik, Wim
                            Spakman, Peter K. Bijl, Appy Sluijs, Cor G. Langereis, and Henk Brinkhuis: A
                            Paleolatitude Calculator for Paleoclimate Studies (model version 3.0), PLOS ONE, 2015.
                        </blockquote>
                        <br/>

                        <span>
                            <a href="https://journals.plos.org/plosone/">PLOS ONE</a> is an open access scientific
                            journal; the paper can be downloaded from <a href="http://doi.org/10.1371/journal.pone.0126946" target="_blank">http://doi.org/10.1371/journal.pone.0126946</a>.
                            <br/><br/>

                            Please make sure to include the version number of the model (currently: 3.0)
                            if you include data computed by Paleolatitude.org. More information about source
                            code and data licenses can be found on the <a href='./#!/about'>About
                            paleolatitude.org page</a>. If you have feedback on our paper or this web site,
                            please contact <a href="mailto:info@paleolatitude.org">info@paleolatitude.org</a>
                        </span>
                    </div>
                    <div>

                        <a href="http://doi.org/10.1371/journal.pone.0126946" target="_blank">
                            <img class='paper_preview' src={IMG_paper} />
                        </a>
                        <center>
                            <a href="http://doi.org/10.1371/journal.pone.0126946" target="_blank">http://doi.org/10.1371/journal.pone.0126946</a>
                        </center>

                    </div>

                </div>
            </div>
        )
    }

}
