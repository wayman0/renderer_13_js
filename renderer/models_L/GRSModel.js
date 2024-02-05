//@ts-check

import {Model, Vertex, LineSegment} from "../scene/SceneExport.js";

/**
 * Returns the GRS Model described by the given grs file.
 * MUST USE AWAIT this is ASYNC CODE!!!!
 * 
 * @param {string} fileName the file to use including the path
 * 
 * @returns {Promise<Model>} the GRS Model 
 */
export default async function buildGRSModel(fileName)
{
    if(typeof fileName != "string")
        throw new Error("Filename must be a string and include the path");

    const model = new Model(undefined, undefined, undefined, 
        "GRS Model: " + fileName.substring(fileName.lastIndexOf("/") + 1, fileName.length));

    // Make an AJAX request to retrieve the GRS file
    let xhttp = new XMLHttpRequest();
    let data = undefined;

    xhttp.onreadystatechange = function() 
    {
        if (this.readyState == 4 && this.status == 200)
            data = xhttp.responseText;
    };

    xhttp.open("GET", fileName, false);
    xhttp.send();

    // Get the geometry from the GRS file.
    if(data == undefined)
        throw new Error("Unable to access file")
    else
    {
        //@ts-ignore
        let dataSplit = data.split("\n"); // Split the contents of the file into an array
        let lineNumber = 0; // Keep track of the line number

        // skip over the comment lines
        while (!dataSplit[lineNumber].startsWith("*")) 
            lineNumber++;
        lineNumber++;

        // read the figure extents
        let extent = dataSplit[lineNumber].split(/ +/);
        const left = parseFloat(extent[0]);
        const top = parseFloat(extent[1]);
        const right = parseFloat(extent[2]);
        const bottom = parseFloat(extent[3]);

        lineNumber++;
        // read the number of line-strips
        const numLineStrips = parseInt(dataSplit[lineNumber]);
        lineNumber++;

        let index = -1;
        for(let j = 0; j < numLineStrips; j++) 
        {
            let numVerticies = parseInt(dataSplit[lineNumber]);
            lineNumber++;

            // put this line-strip in the Model object
            let vertexSplit = dataSplit[lineNumber].split(/ +/); // read the first vertex in the line-strip
            let x = parseFloat(vertexSplit[1]);
            let y = parseFloat(vertexSplit[2]);

            model.addVertex(new Vertex(x, y, 0));

            index++;
            lineNumber++;
            for (let i = 1; i < numVerticies; i++) 
            {
                // read the next model coordinate pair
                vertexSplit = dataSplit[lineNumber].split(/ +/);

                x = parseFloat(vertexSplit[1]);
                y = parseFloat(vertexSplit[2]);

                model.addVertex(new Vertex(x, y, 0));
                index++;

                // create a new LineSegment in the Model
                model.addPrimitive(LineSegment.buildVertex(index - 1, index));
                lineNumber++;
            }
        }
    }

    return model;
}
