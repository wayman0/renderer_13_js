//@ts-check
import {createReadStream} from "node:fs";
import * as ReadLine from "node:readline";

import {Vertex, LineSegment, Model} from "../scene/SceneExport.js";

/**@param {string} fileName the file to be used to build this grs model  */
export async function buildGRSModel(fileName)
{
    const inputStream = createReadStream(fileName);
    const readLine = ReadLine.createInterface(
                        { 
                            input: inputStream, 
                            crlfDelay: Infinity
                        });

    const vList = new Array();
    const pList = new Array();

    let pastStars = false;
    let numLinesPastStars = 0;

    let left, right, top, bottom;
    let numLineSegments = 0; 

    const vertArray = new Array();
    let numVertexes = 0;

    for await(const line of readLine)
    {
        if(line.startsWith("*"))
            pastStars = true;

        if(pastStars && numLinesPastStars == 0)
        {
            numLinesPastStars += 1;

            left   = +line.split("  ")[0];
            top    = +line.split("  ")[1];
            right  = +line.split("  ")[2];
            bottom = +line.split("  ")[3];
        }
        else if(pastStars && numLinesPastStars == 1)
        {
            numLinesPastStars += 1;

            numLineSegments = +line;
        }
        else if(pastStars && numLinesPastStars == 2)
        {
            numVertexes = +line;
        }
    }

    return new Model(vList, pList, undefined, "GRS Model: " + fileName);
}