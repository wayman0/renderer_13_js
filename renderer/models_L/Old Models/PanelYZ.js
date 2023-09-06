/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import {Model, Vertex, LineSegment} from "../scene/SceneExport.js";

export default class PanelYZ extends Model
{
    constructor(yMin=-1, yMax=1, zMin=1, zMax=-1, x = 0)
    {
        super(undefined, undefined, undefined, "Panel XZ");

        if (typeof yMin != "number" ||
            typeof yMax != "number" ||
            typeof zMin != "number" ||
            typeof zMax != "number" ||
            typeof x != "number")
                throw new Error("All parameters must be numerical");

        // An array of indexes to be used to create line segments.
        //const index = new Array(new Array());
        const index = new Array(yMax-yMin +1);
        for (let i = 0; i < index.length; i += 1)
        {
            index[i] = new Array(zMax-zMin+1);
        }

        // Create the checkerboard of vertices.
        let i = 0;
        for (let y = yMin; y <= yMax; ++y)
        {
            for (let z = zMin; z <= zMax; ++z)
            {
                this.addVertex(new Vertex(x, y, z));
                index[y-yMin][z-zMin] = i;
                ++i;
            }
        }

        // Create the line segments that run in the z-direction.
        for (let y = 0; y <= yMax - yMin; ++y)
        {
            for (let z = 0; z < zMax - zMin; ++z)
            {
                this.addPrimitive(LineSegment.buildVertex(index[y][z], index[y][z+1]));
            }
        }

        // Create the line segments that run in the y-direction.
        for (let z = 0; z <= zMax - zMin; ++z)
        {
            for (let y = 0; y < yMax - yMin; ++y)
            {
                this.addPrimitive(LineSegment.buildVertex(index[y][z], index[y+1][z]));
            }
        }
    }
}