import { m } from '../../shared/stdimports.js';

import './showmore.less';


export const comp = {

    oninit: function(vnode) {
        vnode.state.expanded = vnode.attrs.expanded || false;
    },

    view: function(vnode) {
        var msg = vnode.state.expanded ? (vnode.attrs.lessLabel || "Show less") : (vnode.attrs.moreLabel || "Show more");
        var button = <button class={'comp showmore ' + (vnode.state.expanded ? "expanded" : "")} onclick={() => {vnode.state.expanded = !vnode.state.expanded}}>{msg}</button>

        if (vnode.state.expanded) {
            return m.fragment(vnode.children, button);
        }
        else if (vnode.attrs.preview) {
            return m.fragment(<div class='showmore_preview'><span>{vnode.children}</span></div>, button);
        }
        else {
            return button;
        }
    }

}
