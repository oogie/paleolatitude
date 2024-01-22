import { m } from '../../stdimports.js';

import './positionaldialog.css';


export const comp = {

    oninit: function oninit(vnode) {

    },

    // options: {
    //     onClose: function
    //     isOpen: true | false
    //     anchor: "left" | "right"
    //     flow: "left" | "right"
    //     direction: "up" | "middle" | "down"
    // }
    view: function view(vnode) {
        return (
            <div class={`comp positionaldialog ${vnode.attrs.isOpen ? "open" : "closed"} anchor-${vnode.attrs.anchor ?? "left"} flow-${vnode.attrs.flow ?? "right"} direction-${vnode.attrs.direction ?? "down"}`}
                 onclick={(e) => {onclick(e, vnode)}}>
                <div class='content'>
                    {vnode.children}
                </div>
            </div>
        )
    }
}

function onclick(e, vnode) {
    if (e.target.classList.contains("positionaldialog")) {
        if (vnode.attrs.onClose) {
            vnode.attrs.onClose();
        }
    }
}
