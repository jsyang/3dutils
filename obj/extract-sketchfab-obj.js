/**
 * Usage: insert a breakpoint into the osg.Geometry.drawImplementation() func
 * at the closing bracket and then copy and paste the contents of this file into
 * the DevTools console. It will chunk and download the osgjs object instance as a set of
 * partial OBJ files: vertices*.obj and faces*.obj
 */

/**
 * Return an array of OBJ vertex definitions
 * @param v
 * @returns {Array}
 */
function getOBJVertices(v) {
    var objLines = [];

    for (var i = 0, l = v.length; i < l; i += 3) {
        objLines.push([
            'v',
            v[i],
            v[i + 1],
            v[i + 2]
        ].join(' '));
    }

    return objLines;
}

/**
 * Returns an array of OBJ face definitions
 * @param f
 * @returns {Array}
 */
function getOBJFaces(f) {
    var objLines = [];

    var flipTriangleStrip = 1;

    for (var i = 0, l = f.length; i + 2 < l; i++) {
        if (f[i] !== f[i + 1] && f[i] !== f[i + 2] && f[i + 1] !== f[i + 2]) {
            if (flipTriangleStrip % 2 === 0) {
                objLines.push([
                    'f',
                    f[i + 0] + 1,
                    f[i + 1] + 1,
                    f[i + 2] + 1
                ].join(' '));
            } else {
                objLines.push([
                    'f', // starts with 1 instead of 0 for index
                    f[i + 1] + 1,
                    f[i + 0] + 1,
                    f[i + 2] + 1
                ].join(' '));
            }
            flipTriangleStrip++;
        }

    }

    return objLines;
}

/** @constant **/
var OBJHEADER  = "data:text/plain;charset=utf-8,";

/** @constant **/
var CHUNK_SIZE = 20000;

/**
 * @param {UInt16Array|Float16Array} skfbObj
 * @param {"v"|"f"} type
 */
function downloadOBJ(skfbObj, type) {
    var filename;
    var data;
    var a;

    if (type === "f") {
        filename = "faces.obj";
        data     = getOBJFaces(skfbObj);
    } else {
        filename = "vertices.obj";
        data     = getOBJVertices(skfbObj);
    }

    if (data.length > CHUNK_SIZE) {
        console.log('data.length > CHUNK_SIZE');
        for (var i = 0; i < data.length; i += CHUNK_SIZE) {
            a          = document.createElement('a');
            a.href     = encodeURI(OBJHEADER + data.slice(i, i + CHUNK_SIZE).join('\n') + '\n');
            a.download = filename;
            a.click();
        }
    } else {
        console.log('else', data.length);
        a          = document.createElement('a');
        a.href     = encodeURI(OBJHEADER + data.join('\n') + '\n');
        a.download = filename;
        a.click();
    }

}

window.savedInstanceIDs = {};

function saveAsOBJ() {
    if (!(this._instanceID.toString() in savedInstanceIDs)) {
        downloadOBJ(this.attributes.Vertex._elements, 'v');
        downloadOBJ(this.primitives[0].indices._elements, 'f');
        savedInstanceIDs[this._instanceID.toString()] = true;
        console.log('Saved', this._instanceID.toString());
    }
}

saveAsOBJ.call(this);