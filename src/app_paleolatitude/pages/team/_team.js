import { m } from '../../../shared/stdimports.js';


//styling
import './_team.less';

//Team member photos
import PHOTO_Hinsbergen from '../../assets/team/Hinsbergen.jpg';
import PHOTO_Vaes from '../../assets/team/Vaes.jpg';
import PHOTO_Boschman from '../../assets/team/Boschman.jpg';
import PHOTO_Lagemaat from '../../assets/team/Lagemaat.jpg';
import PHOTO_Advokaat from '../../assets/team/Advokaat.jpg';
import PHOTO_Lom from '../../assets/team/Lom.jpg';
import PHOTO_Schaik from '../../assets/team/Schaik.jpg';
import PHOTO_Paridaens from '../../assets/team/Paridaens.jpg';
import PHOTO_Groot from '../../assets/team/Groot.jpg';
import PHOTO_Spakman from '../../assets/team/Spakman.jpg';
import PHOTO_Bijl from '../../assets/team/Bijl.jpg';
import PHOTO_Sluijs from '../../assets/team/Sluijs.jpg';
import PHOTO_Langereis from '../../assets/team/Langereis.jpg';
import PHOTO_Brinkhuis from '../../assets/team/Brinkhuis.jpg';


export const page = {

    oninit: function(vnode) {

    },

    onremove: function(vnode) {

    },

    view: function(vnode) {
        return (
            <div class="page team">
                <div class='section content_width_narrow'>
                    <h2>Team</h2>
                    <span>
                        The following people were involved in building paleolatitude.org and in
                        writing the paper <a href='./#!/papers'>A Paleolatitude Calculator
                        for Paleoclimate Studies</a>.
                    </span>
                </div>

                <div class='section content_width_narrow'>
                    <h4 style='text-align: right;'>Version 3.x</h4>
                    {TEAM_Hinsbergen}
                    {TEAM_Vaes}
                    {TEAM_Boschman}
                    {TEAM_Lagemaat}
                    {TEAM_Advokaat}
                    {TEAM_Lom}
                    {TEAM_Schaik}
                    {TEAM_Paridaens}
                </div>

                <div class='section content_width_narrow'>
                    <h4 style='text-align: right;'>Version 2.x</h4>
                    {TEAM_Hinsbergen}
                    {TEAM_Schaik}
                </div>

                <div class='section content_width_narrow'>
                    <h4 style='text-align: right;'>Version 1.x</h4>
                    {TEAM_Hinsbergen}
                    {TEAM_Groot}
                    {TEAM_Schaik}
                    {TEAM_Spakman}
                    {TEAM_Bijl}
                    {TEAM_Sluijs}
                    {TEAM_Langereis}
                    {TEAM_Brinkhuis}
                </div>
            </div>
        )
    }

}


const TEAM_Hinsbergen = (
    <div class='teammember'>
        <img src={PHOTO_Hinsbergen} />
        <h3>Douwe J.J. van Hinsbergen</h3>
        <span>
            Douwe received his PhD degree in Geology from Utrecht University in 2004,
            subsequently worked at universities in the UK and Norway, and is currently
            Associate Professor of Tectonics in Utrecht. He specializes in plate reconstructions
            of convergent margins of the Tethyan and Caribbean regions.
        </span>
    </div>
)

const TEAM_Vaes = (
    <div class='teammember'>
        <img src={PHOTO_Vaes} />
        <h3>Bram Vaes</h3>
        <span>
            Bram currently works as a postdoctoral researcher in the Coupled Earth Systems Group at the University of Milano-Bicocca, studying the interactions between tectonics and climate in the Cenozoic. Bram obtained his PhD in June 2023 at Utrecht University, during which he developed a new approach to using paleomagnetism for tectonic and paleogeographic applications. The main result of his project is a global apparent polar wander path that serves as a paleomagnetic reference frame for paleogeograpy, paleoclimate and tectonic studies. 
        </span>
    </div>
)

const TEAM_Boschman = (
    <div class='teammember'>
        <img src={PHOTO_Boschman} />
        <h3>Lydian Boschman</h3>
        <span>
            I study the role of the evolution of the solid earth (plate tectonics and paleogeography) and
            paleoclimate in shaping modern biodiveristy. To do so, I first develop regional reconstructions
            of paleogeography and paleoclimate. I use paleomagnetic tools, biomarker analyses, and palynology.
            Second, I correlated these reconstruction of paleoenvironment with biological evolution using
            phylogenetic datasets.
        </span>

    </div>
)

const TEAM_Lagemaat = (
    <div class='teammember'>
        <img src={PHOTO_Lagemaat} />
        <h3>Suzanna van de Lagemaat</h3>
        <span>
            is working on plate-kinematic reconstructions, with a focus on the west and south (paleo-)Pacific realms.
            The main aim of my project is to understand the evolution and destruction of the Phoenix Plate, a conceptual
            plate that once occupied large regions of the southern Panthalassa Ocean.
        </span>
    </div>
)

const TEAM_Advokaat = (
    <div class='teammember'>
        <img src={PHOTO_Advokaat} />
        <h3>Eldert Advokaat</h3>
        <span>
            
        </span>
    </div>
)

const TEAM_Lom = (
    <div class='teammember'>
        <img src={PHOTO_Lom} />
        <h3>Nalan Lom</h3>
        <span>
           
        </span>
    </div>
)

const TEAM_Schaik = (
    <div class='teammember'>
        <img src={PHOTO_Schaik} />
        <h3>Sebastiaan J. van Schaik</h3>
        <span>
            Sebastiaan van Schaik received his BSc. and MSc. degrees in Computer Science from Utrecht University.
            He subsequently obtained his D.Phil. (PhD) from the University of Oxford, and was a Rearch Associate at
            the Oxford e-Research Centre. He specialises in mining and analysis of probabilistic data, as well as graph
            algorithms.
        </span>
    </div>
)

const TEAM_Paridaens = (
    <div class='teammember'>
        <img src={PHOTO_Paridaens} />
        <h3>Joren Paridaens</h3>
        <span>
            Since 2015 Joren is working with various companies and academic institutions to develop large or specialised 
            webapplications as a freelancer. With a wide range of experience in webdevelopment, design and project management 
            he is always up for a conversations about your interesting problem.
        </span>
    </div>
)

const TEAM_Groot = (
    <div class='teammember'>
        <img src={PHOTO_Groot} />
        <h3>Lennart V. de Groot</h3>
        <span>
            Lennart de Groot obtained his BSc, MSc, and PhD degrees at paleomagnetic laboratory Fort
            Hoofddijk and is now a post-doctoral research fellow there. His current research focusses on
            rock-magnetic processes that govern the recording and storage of the intensity of the Earths
            magnetic field in igneous rocks and ways to derive those paleointensities from well dated samples.
        </span>
    </div>
)

const TEAM_Spakman = (
    <div class='teammember'>
        <img src={PHOTO_Spakman} />
        <h3>Wim Spakman</h3>
        <span>
            Wim Spakman obtained his PhD in 1988 at Utrecht University and was appointed full professor of
            Mantle Dynamics in 2001. His research interests comprise mantle structure and dynamics and the
            coupling and interaction of mantle dynamics with crust- and surface evolution.
        </span>
    </div>
)

const TEAM_Bijl = (
    <div class='teammember'>
        <img src={PHOTO_Bijl} />
        <h3>Peter K. Bijl</h3>
        <span>
            Peter Bijl received his PhD in 2011 on the paleoclimatic an paleoceanographic evolution of the
            early Paleogene Southern Ocean. Since then he is a postdoctoral fellow in Utrecht University. He
            is particularly interested in the effects of tectonic-induced oceanographic reorganisations in the
            Paleogene Southern Ocean on regional and global paleoclimatic trends, oceanography, ice buildup
            and dynamics and sea level.
        </span>
    </div>
)

const TEAM_Sluijs = (
    <div class='teammember'>
        <img src={PHOTO_Sluijs} />
        <h3>Appy Sluijs</h3>
        <span>
            Appy Sluijs is a full professor of Paleoceanography at Utrecht University. He obtained his PhD
            cum laude at Utrecht University in 2006. His research is focused on dinoflagellate biogeosciences
            and Cenozoic paleoclimatology and paleoceanography.
        </span>
    </div>
)

const TEAM_Langereis = (
    <div class='teammember'>
        <img src={PHOTO_Langereis} />
        <h3>Cor G. Langereis</h3>
        <span>
            Cor Langereis obtained his PhD in 1984 at Utrecht University and has been an ardent paleomagnetist
            ever since, from 1995 as head of the Paleomagnetic Laboratory Fort Hoofddijk, and from 1999 as full
            professor. He is fascinated by the Earth's magnetic field as recorded in the geological archive,
            and all its applications in dating, tectonics and geomagnetic field behaviour.
        </span>
    </div>
)

const TEAM_Brinkhuis = (
    <div class='teammember'>
        <img src={PHOTO_Brinkhuis} />
        <h3>Henk Brinkhuis</h3>
        <span>
            Henk Brinkhuis obtained his PhD in 1992 at Utrecht University and was appointed full professor
            in Marine Palynology and Paleoecology in 2014. Henk has a strong taste for Phanerozoic extreme
            climate change, (paleo)oceanography and (paleo)ecology. In addition his is general director of the
            NIOZ Royal Netherlands Institute for Sea Research since 2011.
        </span>
    </div>
)
