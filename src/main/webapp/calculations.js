import {getAccurateMatrix, getMatrix, graphSize} from "./graphPrint.js";
import {xMax, xMin, yMax, yMin} from "./constants.js";



function calcValue(x, y) {
    return Math.sinh((2 * x + y) / 100);
}

export function getIntegralSum() {
    return calcIntegralSum(getMatrix());
}

export function getAccurrateIntegralSum() {
    return calcIntegralSum(getAccurateMatrix());
}

function calcIntegralSum(matrix) {
    let dx = xMax - xMin,
        dy = yMax - yMin;
    let s = 0;
    for(let i = 0; i < graphSize; i++) {
        for(let j = 0; j < graphSize; j++) {
            if (matrix[i][j] === 0)
                continue;
            let x = j * dx / graphSize + xMin;
            let y = (graphSize -  i - 1) * dy / graphSize + yMin;
            s += calcValue(x, y) * matrix[i][j];
        }
    }
    return s * (dx * dy / graphSize ** 2) + calcErrorRate(matrix)/3;
}

export function calcErrorRate(matrix) {
    let dx = xMax - xMin,
        dy = yMax - yMin;
    let accuracy = 1 / 10 ** 9;
    let s = 0;
    for(let i = 0; i < graphSize; i++) {
        for(let j = 0; j < graphSize; j++) {
            if (matrix[i][j] - accuracy <= 0 || matrix[i][j] - 1 + accuracy >= 0)
                continue;
            let x = j * dx / graphSize - xMin;
            let y = (graphSize -  i - 1) * dy / graphSize - yMin;
            s += calcValue(x, y);
        }
    }
    return 3 * s * dx * dy / graphSize ** 2;
}