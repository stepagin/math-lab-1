import {initGraph} from "./graphPrint.js"
import {bindButtons} from "./buttonsBind.js";

initGraph();
window.onload = function () {
    bindButtons();
}
