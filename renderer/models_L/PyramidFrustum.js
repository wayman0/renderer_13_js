/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import {Model, LineSegment, Vertex} from "../scene/SceneExport.js";
import {format} from "../scene/util/UtilExport.js";

export default class PyramidFrustum extends Model
{
    s1;
    s2;
    h;
    n;
    k;

    constructor(s1=2, s2=1, h=.5, n=7, k=4)
    {
        if (typeof s1 != "number" ||
            typeof s2 != "number" ||
            typeof h != "number"  ||
            typeof n != "number"  ||
            typeof k != "number")
                throw new Error("All parameters must be numerical");

        if (n < 0) throw new Error("N must be greater than 1");
        if (k < 1) throw new Error("K must be greater than 1");

        super(undefined, undefined, undefined, format("Pyramid Frustum %.2f, %.2f, %.2f, %d, %d", s1, s2, h, n, k));

        this.s1 = s1;
        this.s2 = s2;
        this.h = h;
        this.n = n;
        this.k = k;

        let index = 0;
        const delta1 = s1/k;
        const delta2 = s2/k;

        s1 = s1/2;
        s2 = s2/2;

        // lines of "longitude" perpendicular to the x-axis
        for (let j = 0; j <= k; ++j)
        {
            const d1 = j * delta1;
            const d2 = j * delta2;

            this.addVertex(new Vertex(-s2+d2, h, -s2),
                           new Vertex(-s1+d1, 0, -s1),
                           new Vertex(-s1+d1, 0,  s1),
                           new Vertex(-s2+d2, h,  s2));

            this.addPrimitive(LineSegment.buildVertex(index+0, index+1),
                              LineSegment.buildVertex(index+1, index+2),
                              LineSegment.buildVertex(index+2, index+3),
                              LineSegment.buildVertex(index+3, index+0));
            index += 4;
        }

        // lines of "longitude" perpendicular to the z-axis
        for (let j = 0; j <= k; ++j)
        {
            const d1 = j * delta1;
            const d2 = j * delta2;

            this.addVertex(new Vertex( s2, h, -s2+d2),
                           new Vertex( s1, 0, -s1+d1),
                           new Vertex(-s1, 0, -s1+d1),
                           new Vertex(-s2, h, -s2+d2));

            this.addPrimitive(LineSegment.buildVertex(index+0, index+1),
                              LineSegment.buildVertex(index+1, index+2),
                              LineSegment.buildVertex(index+2, index+3),
                              LineSegment.buildVertex(index+3, index+0));
            index += 4;
        }

        // Create all the lines of "latitude" around the pyramid, starting
        // from the base and working up to the top.
        const deltaH = h / (n + 1);
        const deltaS = (s1 - s2) / (n + 1);
        let s = s1;

        for (let i = 0; i <= n; ++i)
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