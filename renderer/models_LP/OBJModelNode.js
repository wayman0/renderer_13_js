//@ts-check
import {createReadStream} from "node:fs";
import * as ReadLine from "node:readline";

import {Vertex, LineSegment, Model} from "../scene/SceneExport.js";

/**
 * HAVE TO USE 'await' WHEN CALLING FUNCTION!!!
 * 
 * @param {string} fileName include the path
 * @returns {Promise<Model>} the OBJ model made from the file given, BE SURE TO USE 'await'!!!
 */
export default async function buildOBJModel(fileName)
{
    if(typeof fileName != "string")
        throw new Error("Filename must be a string");

    const inputStream = createReadStream(fileName);
    const readLine = ReadLine.createInterface(
                        { 
                            input: inputStream, 
                            crlfDelay: Infinity
                        });

    const vList = new Array();
    const pList = new Array();

    for await(const line of readLine)
    {
        if( line.startsWith("#")      ||
            line.startsWith("vt")     ||
            line.startsWith("vn")     ||
            line.startsWith("s")      ||
            line.startsWith("g")      ||
            line.startsWith("o")      ||
            line.startsWith("usemtl") ||
            line.startsWith("mtllib")) 
                continue;
        else if (line.startsWith("v")) 
        {
            const vertexLine = line.substring(line.indexOf("v") + 2);
            const nums = vertexLine.split("  ");
            
            const x = +nums[0];
            const y = +nums[1];
            const z = +nums[2];

            vList.push((new Vertex(x, y, z)));
        }
        else if (line.startsWith("f")) 
        {
            let verticies = line.split(/ +/);
            verticies.shift();
            let vIndex = [];
            
            for (let i = 0; i < 3; i++) 
            {
                let faceGroup = verticies.shift();
                let m = faceGroup.split("/");
                vIndex[i] = parseInt(m[0]) - 1;
            }
            
            pList.push(LineSegment.buildVertex(vIndex[0], vIndex[1])); 
            pList.push(LineSegment.buildVertex(vIndex[1], vIndex[2]));
            
            while (verticies.length != 0) 
            {
                vIndex[1] = vIndex[2];
                let faceGroup = verticies.shift();
                let m = faceGroup.split("/");
                vIndex[2] = parseInt(m[0]) - 1;
                pList.push(LineSegment.buildVertex(vIndex[1], vIndex[2]))
            }
            pList.push(LineSegment.buildVertex(vIndex[2], vIndex[0]));        
        }
    } 

    return new Model(vList, pList, undefined, undefined, undefined, "OBJModel: " + fileName);
}

/*
console.log("BEFORE FUNCTION CALLED")
let myModel = buildModel("../../assets/apple.obj");
console.log("BEFORE MODEL.NAME")
console.log(myModel.name);
console.log("AFTER MODEL.NAME")
*/

/*
BEFORE FUNCTION CALLED
BEFORE MODEL.NAME
undefined
AFTER MODEL.NAME
13356
2468
*/

// the output below seems to show that
// if we use await any code underneath the 
// async function doesn't get executed
// until the await is done

/*
console.log("BEFORE FUNCTION CALLED")
let myModel = await buildOBJModel("apple.obj");
console.log("BEFORE MODEL.NAME")
console.log(myModel.name);
console.log("AFTER MODEL.NAME")
*/

/*
output:
BEFORE FUNCTION CALLED
13356
2468
BEFORE MODEL.NAME
OBJModel: ../../assets/apple.obj
AFTER MODEL.NAME
*/

/*
testing purposes

import {FrameBuffer, Color} from "../framebuffer/FramebufferExport.js";
import {Scene, Position, Matrix} from "../scene/SceneExport.js";
import {renderFB} from "../pipeline/PipelineExport.js";
import { setColor } from "../scene/util/ModelShading.js";

const myModel = await buildOBJModel("cow.obj");
setColor(myModel, Color.cyan);
const pos = Position.buildFromModelName(myModel, "Cow Position");
pos.setMatrix(Matrix.translate(0, 0, -5));
const scene = Scene.buildFromName("Cow Scene");
scene.addPosition(pos);

const fb = new FrameBuffer(1000, 1000, Color.BLACK);
renderFB(scene, fb);
fb.dumpFB2File("Cow.ppm");
*/