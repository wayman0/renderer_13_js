/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import {Model, Vertex, LineSegment} from "../scene/SceneExport.js";
import {format} from "../scene/util/UtilExport.js";

export default class TriangularPyramid extends Model
{
    r;
    h;
    n;
    k;

    constructor(r = 1/Math.sqrt(2), h = 1, n = 5, k = 5)
    {
        if (typeof r != "number" ||
            typeof h != "number" ||
            typeof n != "number" ||
            typeof k != "number")
                throw new Error("All parameters must be numerical");

        super(undefined, undefined, undefined, format("Triangular Pyramid %.2f, %.2f, %d, %d", r, h, n, k));

        if (n < 1) throw new Error("N must be greater than 1");
        if (k < 1) throw new Error("K must be greater than 1");

        this.r = r;
        this.h = h;
        this.n = n;
        this.k = k;

        const apex = new Vertex(0, h, 0);
        const centerVertex = new Vertex(0, 0, 0);
        const apexIndex = 0;
        const centerIndex = 1;
        this.addVertex(apex, centerVertex);

        let index = 2;
        const sqrt3 = Math.sqrt(3);

        const v0 = new Vertex( r,   0,    0);
        const v1 = new Vertex(-r/2, 0,  r*0.5*sqrt3);
        const v2 = new Vertex(-r/2, 0, -r*0.5*sqrt3);

        for (let j = 0; j < k; ++j)
        {
            const t = j * (1.0 / k);
            // use linear interpolation (lerp)
            this.addVertex( new Vertex(
            //        (1-t)*v0  +  t*v1
                     (1-t)*v0.x + t*v1.x,
                     (1-t)*v0.y + t*v1.y,
                     (1-t)*v0.z + t*v1.z ));
            this.addVertex( new Vertex(
            //        (1-t)*v1  +  t*v2
                     (1-t)*v1.x + t*v2.x,
                     (1-t)*v1.y + t*v2.y,
                     (1-t)*v1.z + t*v2.z ));
            this.addVertex( new Vertex(
            //        (1-t)*v2  +  t*v0
                     (1-t)*v2.x + t*v0.x,
                     (1-t)*v2.y + t*v0.y,
                     (1-t)*v2.z + t*v0.z ));

            // first side
            this.addPrimitive(LineSegment.buildVertex(apexIndex, index+0),
                              LineSegment.buildVertex(index+0, centerIndex));
            // second side
            this.addPrimitive(LineSegment.buildVertex(apexIndex, index+1),
                              LineSegment.buildVertex(index+1, centerIndex));
            // third side
            this.addPrimitive(LineSegment.buildVertex(apexIndex, index+2),
                              LineSegment.buildVertex(index+2, centerIndex));
            index += 3;
        }

        // Create all the lines of "latitude" around the pyramid, starting
        // from the base and working upwards.
        for(let i = 0; i < n; ++i)
        {
            const t = i * (1.0 / n);
            // Use linear interpolation (lerp).
            this.addVertex( new Vertex(
            //       (1-t)*v0   + t*apex
                     (1-t)*v0.x + t*apex.x,
                     (1-t)*v0.y + t*apex.y,
                     (1-t)*v0.z + t*apex.z ));
            this.addVertex( new Vertex(
            //       (1-t)*v1   + t*apex
                     (1-t)*v1.x + t*apex.x,
                     (1-t)*v1.y + t*apex.y,
                     (1-t)*v1.z + t*apex.z ));
            this.addVertex( new Vertex(
            //       (1-t)*v2   + t*apex
                     (1-t)*v2.x + t*apex.x,
                     (1-t)*v2.y + t*apex.y,
                     (1-t)*v2.z + t*apex.z ));

            this.addPrimitive(LineSegment.buildVertex(index+0, index+1),
                              LineSegment.buildVertex(index+1, index+2),
                              LineSegment.buildVertex(index+2, index+0));
            index += 3;
        }
    }
}
