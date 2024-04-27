//@ts-check

import {Model, LineSegment, Vertex} from './../scene/SceneExport.js';

/**
 * Returns the OBJ Model described by the given OBJ file.
 * MUST USE AWAIT this is ASYNC CODE!!!!
 * 
 * @param {string} fileName the file to use including the path
 * 
 * @returns {Promise<Model>} the OBJ Model 
 */
export default async function buildOBJModel(fileName)
{
    if(typeof fileName != "string")
        throw new Error("Filename must be a string including the path");

    const model = new Model(undefined, undefined, undefined, undefined, undefined, 
        "OBJ Model: " + fileName.substring(fileName.lastIndexOf("/") + 1, fileName.length));

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
        for (let line of lines) 
        {
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
                model.addVertex(new Vertex(parseFloat(vertCoords[1]),  //x
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

                model.addPrimitive(LineSegment.buildVertex(vIndex[0], vIndex[1]), 
                                  LineSegment.buildVertex(vIndex[1], vIndex[2]));

                while (verticies.length != 0) 
                {
                    vIndex[1] = vIndex[2];
                    let faceGroup = verticies.shift();
                    let m = faceGroup.split("/");
                    vIndex[2] = parseInt(m[0]) - 1;

                    model.addPrimitive(LineSegment.buildVertex(vIndex[1], vIndex[2]));
                }
                model.addPrimitive(LineSegment.buildVertex(vIndex[2], vIndex[0]));
            }
        }
    }        

    return model;
}
