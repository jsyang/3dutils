/**
 * Run this script to prune all faces that have an edge which is longer than the threshold.
 */
var fs      = require('fs');
var objFile = fs.readFileSync('./thing.obj', 'utf-8').split('\n').filter(Boolean);

var newOBJ;

var DISTANCE_THRESHOLD = 40;
DISTANCE_THRESHOLD *= DISTANCE_THRESHOLD;

/**
 * @param {number} v1
 * @param {number} v2
 * @returns {number}
 */
function distance_squared(v1, v2) {
    var xdiff = v2[0] - v1[0];
    var ydiff = v2[1] - v1[1];
    var zdiff = v2[2] - v1[2];
    return xdiff * xdiff + ydiff * ydiff + zdiff * zdiff;
}

var vertices =[];

// Store all vertices for reference.
for(var i= 0, l = objFile.length; i<l; i++){
    if(objFile[i][0] === 'v'){
        var coords = objFile[i].split(' ').slice(1).map(parseFloat);
        vertices.push(coords);
    } else {
        break;
    }
}

// Save vertices to new OBJ file
newOBJ = objFile.slice(0,i);

function parseIntMapping(v){
    return parseInt(v, 10);
}

for(; i<l; i++){
    var indices = objFile[i].split(' ').slice(1).map(parseIntMapping);

    var distAB = distance_squared(vertices[indices[0]-1],vertices[indices[1]-1]);
    var distAC = distance_squared(vertices[indices[0]-1],vertices[indices[2]-1]);
    var distBC = distance_squared(vertices[indices[1]-1],vertices[indices[2]-1]);

    if(
        distAB < DISTANCE_THRESHOLD &&
        distAC < DISTANCE_THRESHOLD &&
        distBC < DISTANCE_THRESHOLD
    ) {
        newOBJ.push(objFile[i]);
    }
}

fs.writeFileSync('./thing.filtered.obj', newOBJ.join('\n'), 'utf-8');