import { m } from '../../../shared/stdimports.js';


//styling
import './_projects.less';

import IMG_paleomagnetism from '../../assets/projects/paleomagnetism.png';
import IMG_apwponline from '../../assets/projects/apwponline.png';
import IMG_atlasoftheunderworld from '../../assets/projects/atlasoftheunderworld.png';
import IMG_geosports from '../../assets/projects/geosports.png';

export const page = {


    view: function (vnode) {
       
        return (
            <div class="page projects">
                <div class='section content_width_narrow_left'>
                    <h2>Connected projects</h2>
                    <p>
                        The following projects are connected to paleolatitude.org. They are all free to use, backed by published papers and open source where possible.
                    </p>
                </div>

                <div class='section content_width_standard projects'>
                    <div class='project'>
                        <h1><a href='https://paleomagnetism.org/'>Paleomagnetism.org</a></h1>
                        An advanced paleomagnetism toolbox
                        <a href='https://paleomagnetism.org/' target='_blank'>
                            <img src={IMG_paleomagnetism} />
                        </a>
                    </div>

                    <div class='project'>
                        <h1><a href='https://apwp-online.org/'>APWP-online.org</a></h1>
                        Site-level based paleomagnetic analysis for paleogeography
                        <a href='https://apwp-online.org/' target='_blank'>
                            <img src={IMG_apwponline} />
                        </a>
                    </div>

                    <div class='project'>
                        <h1><a href='https://atlas-of-the-underworld.org/'>Atlas-of-the-underworld.org</a></h1>
                        A catalogue of subducted slabs in the mantle and their geological interpretation
                        <a href='https://atlas-of-the-underworld.org/' target='_blank'>
                            <img src={IMG_atlasoftheunderworld} />
                        </a>
                    </div>

                    <div class='project'>
                        <h1><a href='https://geo-sports.org/'>Geo-sports.org</a></h1>
                        Some geological fun for a sports-fan<br /><br />
                        <a href='https://geo-sports.org/' target='_blank'>
                            <img src={IMG_geosports} />
                        </a>
                    </div>
                </div>
            </div>
        )
    }

}
