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
        //const returnVal = await OBJModelNode.#buildModel(fileName);
        //console.log("ObjModelNode using await instanceof model: " + (returnVal instanceof Model))
        
        /*
        const returnPromise = OBJModelNode.#buildModel(fileName);
        let asyncFinished = false;

        returnPromise.then(() => {asyncFinished = true;})

        // this while loop executes forever, never returns

        // cpu usage is around 30 to 40 percent
        // disk usage is around 90 to 100 %, but that is to be expected
        // because we are asynchronously reading the obj files

        // since disk usage is running around its max, why 
        // doesn't the async code ever finish when the while loop is running?
        // shouldn't it finish, set asyncFinished to be true and exit the forever
        // while loop?  especially because the program should be split between all cpus?
        while(asyncFinished == false)
        {}

        return returnPromise
        */

        
        const returnPromise = OBJModelNode.#buildModel(fileName);
        let asyncFinished = false;

        returnPromise.then(() => {asyncFinished = true;})

        if(!asyncFinished)
        {
            // do some busy work 
            // why does this stop the program from running?
            // i looked at cpu usage in task manager, only 30 to 40 %
            // disk is only around 0 to 10 percent jumped to 25% once
            // why does this and the while loop use the disk differently?
            let y = 0;
            for(let x = 0; x < 10000000000000000000; x += .01)
                y += x;
        }        
        else
        {
            console.log(asyncFinished);
        }
        

        //return returnVal;
        //return await OBJModelNode.#buildModel(fileName);
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

        return new OBJModelNode(vList, pList, undefined, name);
    }
}// end class

//console.log(OBJModelNode.createOBJModel("../../assets/apple.obj").toString());

//await OBJModelNode.createOBJModel("../../assets/apple.obj");
// OBJModelNode.createOBJModel("../../assets/apple.obj");

//let myModel = OBJModelNode.model;
//console.log(myModel.vertexList.length + "\n" + myModel.primitiveList.length + "\n" + myModel.name);

let myModel = OBJModelNode.createOBJModel("../../assets/apple.obj");
console.log("What objModelNode returns: " + myModel);

//console.log(myModel.vertexList.length + "\n" + myModel.primitiveList.length + "\n" + myModel.name);
