//@ts-check

import {Model, Vertex, LineSegment} from "../scene/SceneExport.js";

export default class GRSModel extends Model 
{
    /**
     * Create a model using the given grs file data
     * @param {string} fileName the name of the grs file to use
     */
    constructor(fileName) 
    {
        super(undefined, undefined, undefined, "GRS Model");

        // Open the GRS Model
        let grsName = fileName;

        // Make an AJAX request to retrieve the GRS file
        let xhttp = new XMLHttpRequest();
        let data;
        xhttp.onreadystatechange = function() 
        {
            if (this.readyState == 4 && this.status == 200)
                data = xhttp.responseText;
        };

        xhttp.open("GET", fileName, false);
        xhttp.send();

        // Get the geometry from the GRS file.
        if(typeof data == "undefined")
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
            this.left = parseFloat(extent[0]);
            this.top = parseFloat(extent[1]);
            this.right = parseFloat(extent[2]);
            this.bottom = parseFloat(extent[3]);
            lineNumber++;

            // read the number of line-strips
            this.numLineStrips = parseInt(dataSplit[lineNumber]);
            lineNumber++;

            let index = -1;

            for(let j = 0; j < this.numLineStrips; j++) 
            {
                let numVerticies = parseInt(dataSplit[lineNumber]);
                lineNumber++;

                // put this line-strip in the Model object
                let vertexSplit = dataSplit[lineNumber].split(/ +/); // read the first vertex in the line-strip
                let x = parseFloat(vertexSplit[1]);
                let y = parseFloat(vertexSplit[2]);

                this.addVertex(new Vertex(x, y, 0));
                index++;
                lineNumber++;

                for (let i = 1; i < numVerticies; i++) 
                {
                    // read the next model coordinate pair
                    vertexSplit = dataSplit[lineNumber].split(/ +/);
                    x = parseFloat(vertexSplit[1]);
                    y = parseFloat(vertexSplit[2]);

                    this.addVertex(new Vertex(x, y, 0));
                    index++;

                    // create a new LineSegment in the Model
                    this.addPrimitive(LineSegment.buildVertex(index - 1, index));
                    lineNumber++;
                }
            }
        }
    }
}
