import {clearPoints} from "./graphPrint.js";

export function bindButtons() {
    var clear_btn = document.getElementById("clear");
    $("#clear").click(function () {
        clearPoints();
    });
}