//@ts-check
import {createReadStream, createWriteStream} from "node:fs";
import * as ReadLine from "node:readline";

import {Vertex, LineSegment, Model} from "../scene/SceneExport.js";

import {create} from "node:domain";

export default class OBJModelNode extends Model
{
/*
    #promiseFinished = false;

    constructor(fileName)
    {
        super(undefined, undefined, undefined, 
            "OBJ Model: " + fileName.substring(fileName.lastIndexOf("/") + 1, fileName.lastIndexOf(".")));

        let finished = (this.#buildModel(fileName))//.then( this.#waitForPromiseFulfilled());

        Promise.all([finished]);

    }

    #waitForPromiseFulfilled()
    {
        console.log("called: 'waitForPromiseFulfilled' ");

        this.#promiseFinished = true;
    }

    async #buildModel(fileName)
    {        
        const inputStream = createReadStream(fileName);
        const readLine = ReadLine.createInterface(
                            { 
                                input: inputStream, 
                                crlfDelay: Infinity
                                
                            });

readLine.on("close", () => {console.log("file closed");})

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

                this.addVertex(new Vertex(x, y, z));
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

                this.addPrimitive(LineSegment.buildVertex(vIndex[0], vIndex[1]), 
                                  LineSegment.buildVertex(vIndex[1], vIndex[2]));

                while (verticies.length != 0) 
                {
                    vIndex[1] = vIndex[2];
                    let faceGroup = verticies.shift();
                    let m = faceGroup.split("/");
                    vIndex[2] = parseInt(m[0]) - 1;
                    this.addPrimitive(LineSegment.buildVertex(vIndex[1], vIndex[2]))
                }

                this.addPrimitive(LineSegment.buildVertex(vIndex[2], vIndex[0]));        
            }
        } 

        console.log(this.vertexList.length);
        console.log(this.primitiveList.length);       

        //this.#promiseFinished = true;
        
            
    }
*/
    static model;

    static async createOBJModel(fileName)
    {
        const returnVal = await OBJModelNode.#buildModel(fileName);

        return returnVal;
    }

    static async #buildModel(fileName)
    {
        const inputStream = createReadStream(fileName);
        const readLine = ReadLine.createInterface(
                            { 
                                input: inputStream, 
                                crlfDelay: Infinity
                                
                            });

        const vList = new Array();
        const pList = new Array();
        const name =  "OBJ Model: " + fileName.substring(fileName.lastIndexOf("/") + 1, 
                                      fileName.lastIndexOf("."));

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

                vList.push(new Vertex(x, y, z));
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

        console.log(vList.length);
        console.log(pList.length);       

        OBJModelNode.model = new OBJModelNode(vList, pList, undefined, name);

        return new OBJModelNode(vList, pList, undefined, name);
    }
}// end class

//console.log(OBJModelNode.createOBJModel("../../assets/apple.obj").toString());

//await OBJModelNode.createOBJModel("../../assets/apple.obj");
// OBJModelNode.createOBJModel("../../assets/apple.obj");

let myModel = OBJModelNode.model;
console.log(myModel.vertexList.length + "\n" + myModel.primitiveList.length + "\n" + myModel.name);
