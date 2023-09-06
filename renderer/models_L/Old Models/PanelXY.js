/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import {Model, Vertex, LineSegment} from "../scene/SceneExport.js";

export default class PanelXZ extends Model
{
    constructor(xMin=-1, xMax=1, yMin=1, yMax=-1, z = 0)
    {
        super(undefined, undefined, undefined, "Panel XZ");

        if (typeof xMin != "number" ||
            typeof xMax != "number" ||
            typeof yMin != "number" ||
            typeof yMax != "number" ||
            typeof z != "number")
                throw new Error("All parameters must be numerical");

        // An array of indexes to be used to create line segments.
        //const index = new Array(new Array());
        const index = new Array(xMax-xMin +1);
        for (let x = 0; x < index.length; x += 1)
        {
            index[x] = new Array(yMax-yMin+1);
        }

        // Create the checkerboard of vertices.
        let i = 0;
        for (let x = xMin; x <= xMax; ++x)
        {
            for (let y = yMin; y <= yMax; ++y)
            {
                this.addVertex(new Vertex(x, y, z));
                index[x-xMin][y-yMin] = i;
                ++i;
            }
        }

        // Create the line segments that run in the z-direction.
        for (let x = 0; x <= xMax - xMin; ++x)
        {
            for (let y = 0; y < yMax - yMin; ++y)
            {
                this.addPrimitive(LineSegment.buildVertex(index[x][y], index[x][y+1]));
            }
        }

        // Create the line segments that run in the x-direction.
        for (let y = 0; y <= yMax - yMin; ++y)
        {
            for (let x = 0; x < xMax - xMin; ++x)
            {
                this.addPrimitive(LineSegment.buildVertex(index[x][y], index[x+1][y]));
            }
        }
    }
}