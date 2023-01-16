import {
    backgroundFigColor,
    figColor,
    lineColor,
    textColor,
    cursorColor,
    cursorSize,
    xMin,
    xMax,
    gridColor,
    yMax,
    yMin,
    figOutlineColor
} from "./constants.js"
import {calcErrorRate, getAccurrateIntegralSum, getIntegralSum} from "./calculations.js";

var graph = null;
var ctx = null;
export var graphSize = 0;
var is_mouse_down = false;
var dots = [];
var integralSum = 0;
var matrix = new Array(560);
for(let i = 0; i < 560; i++) {
    matrix[i] = new Array(560);
}
export var errorRate = 0;

export function initGraph() {
    /*
    инициализирует переменные
     */
    graph = document.getElementById("mycanvas");
    ctx = graph.getContext("2d");
    graphSize = (graph.width < graph.height ? graph.width : graph.height);
    graphSize = (graphSize > 560 ? graphSize : 560);
    graph.width = graphSize;
    graph.height = graphSize;
    drawGraph();
    setMouseActions();
}

function convertXtoPixels(l) {
    return l * graphSize/(xMax-xMin);
}
function convertYtoPixels(l) {
    return l * graphSize/(yMax-yMin);
}

function drawGraph() {
    /*
    Заново прорисовывает график canvas
     */
    ctx.clearRect(0, 0, graphSize, graphSize);
    ctx.fillStyle = backgroundFigColor;
    ctx.fillRect(0, 0, graphSize, graphSize);
    ctx.fillStyle = figColor;
    ctx.strokeStyle = lineColor;
    let arrowBoxSize = graphSize / 40;

    for(let i = 0; i < 8; i++) {
        // Grid
        let xGridStep = Math.max(1, Math.floor((xMax - xMin)/8));
        let xGridCount = Math.floor((xMax - xMin) / xGridStep);
        let yGridStep = Math.max(1, Math.floor((yMax - yMin)/8));
        let yGridCount = Math.floor((yMax - yMin) / yGridStep);
        // TODO: расположение сетки в нуле

        ctx.strokeStyle = gridColor;
        ctx.fillStyle = textColor;
        ctx.font = "8pt sans-serif";
        ctx.beginPath();
        ctx.translate(graphSize/2, graphSize/2);
        let xGridOffset = ((xMax-xMin)%xGridStep)/2;
        for (let i = 0; i <= xGridCount; i++) {
            let x = xMin + xGridOffset + i * xGridStep,
                xPix = convertXtoPixels(x - xMin);
            ctx.moveTo(  xPix - graphSize/2, graphSize/2);
            ctx.lineTo(xPix - graphSize/2, -graphSize/2);
            ctx.fillText(x, xPix - graphSize/2 + arrowBoxSize/2, -arrowBoxSize/2);
        }
        let yGridOffset = ((yMax-yMin)%yGridStep)/2;
        for (let i = 0; i <= yGridCount; i++) {
            let y = yMax - yGridOffset - i * yGridStep,
                yPix = convertYtoPixels(y - yMin);
            ctx.moveTo(graphSize/2, yPix - graphSize/2);
            ctx.lineTo(-graphSize/2, yPix - graphSize/2);
            ctx.fillText(y, arrowBoxSize/2, graphSize/2 - yPix + arrowBoxSize);
        }
        // 0
        ctx.moveTo(-graphSize/2, graphSize/2 + graphSize * yMin/(yMax-yMin));
        ctx.lineTo(graphSize/2,  graphSize/2 + graphSize * yMin/(yMax-yMin));
        ctx.moveTo( -graphSize/2 - graphSize * xMin/(xMax-xMin), -graphSize/2);
        ctx.lineTo(  -graphSize/2 - graphSize * xMin/(xMax-xMin),  graphSize/2);
        ctx.fillStyle = gridColor;
        ctx.font = "8pt sans-serif";
        ctx.fillText(0, -graphSize/2 - graphSize * xMin/(xMax-xMin) + arrowBoxSize/2,
            graphSize/2 + graphSize * yMin/(yMax-yMin) - arrowBoxSize/2);



        ctx.stroke();
        ctx.translate(-graphSize/2, -graphSize/2);
        ctx.closePath();


        ctx.strokeStyle = lineColor;

        // Ox
        ctx.beginPath();
        ctx.moveTo(0, graphSize/2);
        ctx.lineTo(graphSize, graphSize/2);
        ctx.lineTo(graphSize - arrowBoxSize, graphSize/2 - arrowBoxSize / 2);
        ctx.moveTo(graphSize, graphSize/2);
        ctx.lineTo(graphSize - arrowBoxSize, graphSize/2 + arrowBoxSize / 2);
        ctx.stroke();
        ctx.closePath();
        //Oy
        ctx.beginPath();
        ctx.moveTo(graphSize/2, graphSize);
        ctx.lineTo(graphSize/2, 0);
        ctx.lineTo(graphSize/2 - arrowBoxSize/2, arrowBoxSize);
        ctx.moveTo(graphSize/2, 0);
        ctx.lineTo(graphSize/2 + arrowBoxSize/2, arrowBoxSize);
        ctx.stroke();
        ctx.closePath();
        // labels
        ctx.beginPath();
        ctx.fillStyle = textColor;
        ctx.font = "bold 10pt sans-serif";
        ctx.fillText("X", graphSize- arrowBoxSize, graphSize/2 + 2*arrowBoxSize);
        ctx.fillText("Y", graphSize/2 - arrowBoxSize * 2, arrowBoxSize);
        ctx.closePath();


        drawPolygon();
    }
}

function setMouseActions() {
    graph.onmousemove = (e) => {
        if(!is_mouse_down)
            drawGraph();
        else {
            addPoint(e.offsetX, e.offsetY);
            drawGraph();
        }
        document.getElementById("result").innerHTML = integralSum;
        ctx.fillStyle = cursorColor;
        ctx.beginPath();
        ctx.arc(e.offsetX, e.offsetY, cursorSize * graphSize/2000, 0, 2*Math.PI);
        ctx.fill();
        ctx.closePath();
    }

    graph.onmouseleave = (e) => {
        drawGraph();
    };

    graph.onmousedown = (e) => {
        addPoint(e.offsetX, e.offsetY);
        drawGraph();
        is_mouse_down = true;
    }

    graph.onmouseup = (e) => {
        integralSum = getAccurrateIntegralSum();
        document.getElementById("error-rate").innerHTML = errorRate;
        is_mouse_down = false;
    }
}


function addPoint(xPixels, yPixels) {
    if (dots.length % 30 == 0)
        integralSum = getIntegralSum();
    dots.push({x: xPixels, y: yPixels});
}

export function clearPoints() {
    while(dots.length > 0) {
        dots.pop();
    }
    drawGraph();
}


function drawPolygon() {
    ctx.strokeStyle = figOutlineColor;
    ctx.fillStyle = figColor;
    if(dots.length > 1){
        ctx.beginPath();
        dots.forEach((p) => {
            ctx.lineTo(p.x, p.y);
        });
        ctx.lineTo(dots[0].x, dots[0].y)
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

    }
}

export function getMatrix() {
    var imgd = ctx.getImageData(0, 0, 560, 560);
    var pix = imgd.data;

    let i = 0, n = pix.length;
    for (; i < n; i += 4) {
        let r = pix[i], g = pix[i + 1], b = pix[i + 2];
        let x = Math.floor(Math.floor(i/4) / 560),
            y = Math.floor(i/4) % 560;

        if (`rgb(${r},${g},${b})` == figColor) {
            matrix[x][y] = 1;
        } else if (`rgb(${r},${g},${b})` == figOutlineColor) {
            matrix[x][y] = 0.5;
        } else {
            matrix[x][y] = 0;
        }
    }
    ctx.putImageData(imgd, 0, 0);
    return matrix;
}

export function getAccurateMatrix() {
    let buffer = document.createElement("canvas");
    let ctx_buffer = buffer.getContext("2d");
    buffer.height = graphSize;
    buffer.width = graphSize;

    ctx_buffer.clearRect(0, 0, graphSize, graphSize);
    ctx_buffer.fillStyle = "rgb(255,255,255)";
    ctx_buffer.fillRect(0, 0, graphSize, graphSize);

    ctx_buffer.fillStyle = "rgb(0,0,0)";
    if(dots.length > 1){
        ctx_buffer.beginPath();
        dots.forEach((p) => {
            ctx_buffer.lineTo(p.x, p.y);
        });
        ctx_buffer.lineTo(dots[0].x, dots[0].y)
        ctx_buffer.fill();
        ctx_buffer.closePath();
    }

    var imgd = ctx_buffer.getImageData(0, 0, 560, 560);
    var pix = imgd.data;

    let i = 0, n = pix.length;
    for (; i < n; i += 4) {
        let r = pix[i], g = pix[i + 1], b = pix[i + 2];
        let x = Math.floor(Math.floor(i/4) / 560),
            y = Math.floor(i/4) % 560;

        matrix[x][y] = (255 - (r + g + b) / 3) / 255;
    }

    errorRate = calcErrorRate(matrix);

    return matrix;
}