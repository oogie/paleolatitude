import { m, config } from '../../../shared/stdimports.js';


//styling
import './_footer.less';

//images
import LOGO_nwo from '../../assets/LOGO_nwo.png';
import LOGO_uu from '../../assets/LOGO_uu.svg';


export const page = {

    view: function(vnode) {
        return (
            <div class="page footer">
                <div class='content content_width_standard'>
                    <div>
                        <h4>More</h4>
                        <a href='./#!/'>Paleolatitude</a><br/>
                        {/* <a href='./#!/paleotemperature'>Paleotemperature</a><br/> */} <br />
                        <a href='./#!/about'>About</a><br/>
                        <a href='./#!/papers' >The papers</a><br/>
                        <a href='./#!/team'>The team</a><br/>
                        <a href='./#!/projects'>Connected projects</a><br/><br/>
                    </div>

                    <div>
                        <h4>Contact</h4>
                        <div class='flex'>
                            <div>
                                <a href="mailto:info@paleolatitude.org">info@paleolatitude.org</a><br/>
                                <a href="mailto:info@paleotemperature.org">info@paleotemperature.org</a>
                            </div>
                            <small>
                                Department of Earth Sciences<br/>
                                Utrecht University,<br/>
                                Vening Meinesz Building A,<br/>
                                Princetonlaan 8A,<br/>
                                3584 CB Utrecht, Netherlands
                            </small>
                        </div>

                    </div>

                    <div>
                        <h4>Supported by</h4>
                        <div class='logos'>
                            <a href="https://www.nwo.nl/"><img src={LOGO_nwo}></img></a>
                            <a href="https://www.uu.nl/"><img src={LOGO_uu}></img></a>
                        </div>
                    </div>
                </div>

                <div class='siteinfo'>
                    <small>&copy; 2014 - {new Date().getFullYear()}, version {config.version}</small>
                </div>
            </div>
        )
    }

}
