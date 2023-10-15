//@ts-check
import {createReadStream} from "node:fs";
import * as ReadLine from "node:readline";

import {Vertex, LineSegment, Model} from "../scene/SceneExport.js";

/**
 * EXPECTS ONLY THE FILENAME NO PATH!!!
 * HAVE TO USE 'await' WHEN CALLING FUNCTION!!!
 * 
 * @param {string} fileName ONLY the name of the file, do not give the path! 
 * @returns {Promise<Model>} the OBJ model made from the file given, BE SURE TO USE 'await'!!!
 */
export async function buildGRSModel(fileName)
{
    if(typeof fileName != "string")
        throw new Error("FILENAME must be a string");

    // check if the filename doesn't contain a path
    if(fileName.includes("/"))
        throw new Error("filename must be just the name of the file, do not include any paths");

    const filePath = "../../assets/grs/" + fileName;
    const inputStream = createReadStream(filePath);
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

    const numVertexes = new Array();

    for await(const line of readLine)
    {
        // determine if we are past comments
        if(line.startsWith("*"))
        {
            pastStars = true;
            continue;
        }   

        // on the line with the left right top and bottom
        if(pastStars && numLinesPastStars == 0)
        {
            numLinesPastStars += 1;

            left   = +line.split("  ")[0];
            top    = +line.split("  ")[1];
            right  = +line.split("  ")[2];
            bottom = +line.split("  ")[3];
        }
        else if(pastStars && numLinesPastStars == 1) // number of chuncks of lines
        {
            numLinesPastStars += 1;
            numLineSegments = +line;
        }
        else if(pastStars && numLinesPastStars > 1) // either number of vertexes in this set of lines or the actual vertexes
        {
            if(!line.startsWith(" ")) // the number of vertexes in this chunck
                numVertexes.push(+line);
            else if(line.startsWith(" ")) // the actual vertexes
            {
                const vertexArr = line.substring(2).split("  ");
                vList.push(new Vertex(+vertexArr[0], +vertexArr[1], 0.0));
            }
        }
    }

    // keep track of how many vertexes we have used
    let numVertexesUsed = 0; 
    for(let x = 0; x < numLineSegments; x += 1)
    {
        // get the number of vertexes in this set
        let numVertexesSet = numVertexes[x];
        
        // loop one less time because we add 1 to the index when making the linesegment
        for(let vIndex = 0; vIndex < numVertexesSet -1; vIndex += 1)
        {
            let startIndex = vIndex + numVertexesUsed;
            pList.push(LineSegment.buildVertex(startIndex, startIndex + 1));
            startIndex += 1;
        }

        // record that we used this set of vertexes
        numVertexesUsed += numVertexesSet;
    }

    return new Model(vList, pList, undefined, "GRS Model: " + fileName);
}

/*
testing purposes

import {FrameBuffer, Color} from "../framebuffer/FramebufferExport.js";
import {Scene, Position, Matrix} from "../scene/SceneExport.js";
import {renderFB} from "../pipeline/PipelineExport.js";
import { setColor } from "../scene/util/ModelShading.js";

const myModel = await buildGRSModel("rex.grs");
setColor(myModel, Color.cyan);
const pos = Position.buildFromModelName(myModel, "Cow Position");
pos.setMatrix(Matrix.translate(0, 0, -2));
const scene = Scene.buildFromName("Cow Scene");
scene.addPosition(pos);

const fb = new FrameBuffer(1000, 1000, Color.BLACK);
renderFB(scene, fb);
fb.dumpFB2File("trex.ppm");
*/