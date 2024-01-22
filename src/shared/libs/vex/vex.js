import vexLib from 'vex-js';
import '../vex/vex.css';
import '../vex/vex-theme.css';

//custom code
vexLib.registerPlugin(require('vex-dialog'))
vexLib.defaultOptions.className = 'vex-theme';
vexLib.dialog.buttons.YES.className = "lang-general-ok_btn";
vexLib.dialog.buttons.NO.className =  "lang-general-cancel_btn";

export const vex = vexLib;
