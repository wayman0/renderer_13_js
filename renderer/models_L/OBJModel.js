//@ts-check

import {Model, LineSegment, Vertex} from './../scene/SceneExport.js';

export default class ObjSimpleModel extends Model 
{
    /**
     * 
     * @param {string} fileName the relative path and filename of the obj file 
     */
    constructor(fileName) 
    {
        super(undefined, undefined, undefined, "Obj Model: " + fileName);
        
        let xhttp = new XMLHttpRequest();
        let data;

        xhttp.onreadystatechange = function() 
        {
            if (this.readyState == 4 && this.status == 200)
                data = xhttp.responseText;
        };

        xhttp.open("GET", fileName, false);
        xhttp.send();

        if(data == undefined)
            throw new Error("Unable to read the file");
        else
        {
            //@ts-ignore
            let lines = data.split('\n');

            for (let line of lines) {
                if (line.startsWith("#")      ||
                    line.startsWith("vt")     ||
                    line.startsWith("vn")     ||
                    line.startsWith("s")      ||
                    line.startsWith("g")      ||
                    line.startsWith("o")      ||
                    line.startsWith("usemtl") ||
                    line.startsWith("mtllib")) 
                {
                    continue;
                }
                else if (line.startsWith("v")) 
                {
                    let vertCoords = line.split(/ +/g);
                    this.addVertex(new Vertex(parseFloat(vertCoords[1]),  //x
                                              parseFloat(vertCoords[2]),  //y
                                              parseFloat(vertCoords[3]))) //z
                }
                else if (line.startsWith("f")) 
                {
                    let verticies = line.split(/ +/);
                    verticies.shift();
                    let vIndex = [];
                    for (let i = 0; i < 3; i++) {
                        let faceGroup = verticies.shift();
                        let m = faceGroup.split("/");
                        vIndex[i] = parseInt(m[0]) - 1;
                    }
                    this.addPrimitive(LineSegment.buildVertex(vIndex[0], vIndex[1]), 
                                      LineSegment.buildVertex(vIndex[1], vIndex[2]));

                    while (verticies.length != 0) 
                    {
                        vIndex[1] = vIndex[2];
                        let faceGroup = verticies.shift();
                        let m = faceGroup.split("/");
                        vIndex[2] = parseInt(m[0]) - 1;

                        this.addPrimitive(LineSegment.buildVertex(vIndex[1], vIndex[2]));
                    }

                    this.addPrimitive(LineSegment.buildVertex(vIndex[2], vIndex[0]));
                }
            }
        }        
    }
}
