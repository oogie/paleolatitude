import { m } from '../../../shared/stdimports.js';


//styling
import './_header.less';

import { comp as Positionaldialog } from '../../../shared/components/dialog/positionaldialog.js';
import { comp as Dialog } from '../../../shared/components/dialog/dialog.js';



export const page = {

    oninit: function oninit(vnode) {
        vnode.state.isOpen = {
            menu: false,
            whatsnew: false,
            tempaturesoon: false,
        }
    },

    view: function(vnode) {
        return (
            <div class="page header">
                <div class='menu content_width_standard'>
                    {m.route.get() === "/paleotemperature" ? (
                        <a href='./#!/paleotemperature' class='unobtrusive'>
                            <h1>
                                <span class='txt_default'>Paleo</span>
                                <span class='txt_primary'>temperature</span>
                                <span class='txt_default_lesser' style='font-size: 1.3rem'>.org</span>
                            </h1>
                        </a>
                    ) : (
                        <a href='./#!/' class='unobtrusive'>
                            <h1>
                                <span class='txt_default'>Paleo</span>
                                <span class='txt_primary'>latitude</span>
                                <span class='txt_default_lesser' style='font-size: 1.3rem'>.org</span>
                            </h1>
                        </a>
                    )}

                    <a class='mobile_hidden' href='./#!/'>Paleolatitude</a>
                    <a class='mobile_hidden popup_box' onclick={() => { vnode.state.isOpen.tempaturesoon = true;}} href='javascript:'>
                        Paleotemperature
                        <small class='popup_content'>
                            coming in 2024
                        </small>
                    </a>


                    <div style='flex-grow:1;'></div>

                    {/* <a class='mobile_sm_hidden' href='./#!/papers'>Cite the papers</a> */}
                    <button class='btn_secondary' onclick={() => {vnode.state.isOpen.whatsnew = true}}>
                        What's new?
                    </button>
                    <button class='btn_icon' onclick={() => { vnode.state.isOpen.menu = !vnode.state.isOpen.menu}}>
                        <i class="fa-solid fa-bars"></i>
                    </button>

                    <Positionaldialog isOpen={vnode.state.isOpen.menu} anchor='right' flow='left'  onClose={() => {vnode.state.isOpen.menu = false}}>
                        <a onclick={() => {vnode.state.isOpen.menu = false}} href='./#!/'>Paleolatitude</a>
                        <a onclick={() => { vnode.state.isOpen.menu = false; vnode.state.isOpen.tempaturesoon = true; }} href='javascript:' class='popup_box'>
                            Paleotemperature
                            <small class='popup_content'>
                                coming in 2024
                            </small>
                        </a><br/>
                        <a onclick={() => {vnode.state.isOpen.menu = false}} href='./#!/about'>About</a>
                        <a onclick={() => {vnode.state.isOpen.menu = false}} href='./#!/papers' >The papers</a>
                        <a onclick={() => {vnode.state.isOpen.menu = false}} href='./#!/team'>The team</a>
                        <a onclick={() => {vnode.state.isOpen.menu = false}} href='./#!/projects'>Connected projects</a>
                    </Positionaldialog>
                </div>

                <Dialog isOpen={vnode.state.isOpen.tempaturesoon} onAnswer={() => { vnode.state.isOpen.tempaturesoon = false}} isAlert='true'>
                    <h3>Coming soon</h3>
                    The first global paleotemperature reference frame, which we expect to go live in 2024.
                </Dialog>

                <Dialog topmargin={"5vh"} isOpen={vnode.state.isOpen.whatsnew} onAnswer={() => { vnode.state.isOpen.whatsnew = false}} isAlert='true'>
                    <h1>Whats new in version 3.beta.0</h1>
                    <br />
                    The new version has a new interface with similar functionality as Paleolatitude.org 2.0. New elements include:
                    <br /><br />

                    <h4>New default paleomagnetic reference frame</h4>
                    The site-level based global APWP of <a target="_blank" href=' https://www.sciencedirect.com/science/article/pii/S0012825223002362'>
                    Vaes et al, Earth-Science Reviews 2023</a> for the last 320 Ma. Select previous APWPs under the ‘Advanced’ tab. 
                    For pre-320 Ma Paleozoic paleolatitudes, select the Torsvik et al. (2012) APWP.
                    <br /><br />

                    <h4>Advanced <i class="fa-solid fa-arrow-right-long"></i> batch option</h4>
                    Compute paleolatitudes of a large number of locations at the same time.
                    <br /><br />

                    <h4>Upgrades to watch out for in 2024</h4>
                    We are working on adding reconstructions of the Alpine-Himalayan and 
                    circum-Pacific orogens. This upgrade will be accompanied by a new publication that explains the novel reconstructions.
                    <br /><br />

                    We are developing a paleotemperature reference frame, which will also be associated with a peer-reviewed
                    publication to explain the details.
                </Dialog>


            </div>
        )
    }

}
