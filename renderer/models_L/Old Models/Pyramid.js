/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import {Model, LineSegment, Vertex} from "../scene/SceneExport.js";
import {format} from "../scene/util/UtilExport.js";

export default class Pyramid extends Model
{
    s;
    h;
    n;
    k;

    constructor(s = 2, h = 1, n = 15, k = 4, grid = false)
    {
        if (typeof s != "number" ||
            typeof h != "number" ||
            typeof n != "number" ||
            typeof k != "number")
                throw new Error("s, h, n, k must be numerical");

        if (typeof grid != "boolean")
            throw new Error("grid must be boolean");

        if (n < 1) throw new Error("N must be greater than 1");
        if (k < 1) throw new Error("k must be greater than 1");

        super(undefined, undefined, undefined, format("Pyramid %.2f, %.2f, %d, %d", s, h, n, k));

        this.s = s;
        this.h = h;
        this.n = n;
        this.k = k;

        this.addVertex(new Vertex(0, h, 0));
        let apexIndex = 0;
        let index = 1;

        s = s/2;
        const delta = (2*s) / k

        for (let j = 0; j < k + 1; ++j)
        {
            const d = j * delta;
            if (grid)
            {
                this.addVertex(new Vertex(-s+d, 0, -s),
                               new Vertex(-s+d, 0,  s));
            }
            else // a fan in the base
            {
                this.addVertex(new Vertex(-s+d, 0, -s), new Vertex( s-d, 0,  s));
            }

           this.addPrimitive(LineSegment.buildVertex(apexIndex, index+0),
                             LineSegment.buildVertex(index+0,   index+1),
                             LineSegment.buildVertex(index+1,   apexIndex));
            index += 2;
        }

        // lines of "longitude" perpendicular to the z-axis
        for (let j = 1; j < k; ++j)
        {
            const d = j * delta;
            if (grid)
            {
                this.addVertex(new Vertex( s, 0, -s+d),
                               new Vertex(-s, 0, -s+d));
            }
            else // a fan in the base
            {
                this.addVertex(new Vertex( s, 0, -s+d),
                               new Vertex(-s, 0,  s-d));
            }

            this.addPrimitive(LineSegment.buildVertex(apexIndex, index+0),
                              LineSegment.buildVertex(index+0,   index+1),
                              LineSegment.buildVertex(index+1,   apexIndex));
            index += 2;
        }

        // Create all the lines of "latitude" around the pyramid, starting
        // from the base and working upwards.
        const deltaH = h / n;
        const deltaS = s / n;
        for(let i = 0; i < n; ++i)
        {
            h = i * deltaH;
            this.addVertex(new Vertex( s, h,  s),
                           new Vertex( s, h, -s),
                           new Vertex(-s, h, -s),
                           new Vertex(-s, h,  s));

            this.addPrimitive(LineSegment.buildVertex(index+0, index+1),
                              LineSegment.buildVertex(index+1, index+2),
                              LineSegment.buildVertex(index+2, index+3),
                              LineSegment.buildVertex(index+3, index+0));
            s -= deltaS;
            index += 4;
        }
    }
}