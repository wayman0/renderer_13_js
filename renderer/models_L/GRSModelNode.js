//@ts-check
import {createReadStream, createWriteStream} from "node:fs";
import * as ReadLine from "node:readline";

import {Vertex, LineSegment, Model} from "../scene/SceneExport.js";
import { create } from "node:domain";

export default class GRSModelNode extends Model
{
    constructor(fileName)
    {
        super(undefined, undefined, undefined, 
            "GRS Model: " + fileName.substring(0, fileName.indexOf(".")));

        const inputStream = createReadStream(fileName);
        const readLine = ReadLine.createInterface(
            { input: inputStream, 
              crlfDelay: Infinity
            });

        for await(const line of readLine)
        {

        }
    }

    
}
