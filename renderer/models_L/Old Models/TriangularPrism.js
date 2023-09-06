/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import {LineSegment, Model, Vertex} from "../scene/SceneExport.js";

export default class TriangluarPrism extends Model
{
    /**
     *
     * @param {number} r
     * @param {number} h
     * @param {number} h2
     * @param {number} n
     * @param {boolean} bothHalves
     */
    constructor(r = .5/Math.sqrt(3), h = .6, h2 = Math.atan(Math.sqrt(2)), n = 0, bothHalves = true)
    {
        if (typeof r != "number"  ||
            typeof h != "number"  ||
            typeof h2 != "number" ||
            typeof n != "number")
                throw new Error("r, h, h2, and n must be numerical");

        if (typeof bothHalves != "boolean")
            throw new Error("bothHalves must be boolean");

        super(undefined, undefined, undefined, "Triangular prism r = " + r + "h = " + h + "h2 = " + h2 + "n = " + n);

        const sqrt3 = Math.sqrt(3);

        const v0 = new Vertex(r,    h,  0);
        const v1 = new Vertex(-r/2, h,  r*.5*sqrt3);
        const v2 = new Vertex(-r/2, h, -r*.5*sqrt3);
        let v3, v4, v5, v7;

        if (bothHalves)
        {
            v3 = new Vertex( r,   -h,     0);
            v4 = new Vertex(-r/2, -h,     r*.5*sqrt3);
            v5 = new Vertex(-r/2, -h,    -r*.5*sqrt3);
            v7 = new Vertex(0,    -h-h2,  0);
        }
        else
        {
            v3 = new Vertex(r,    0,  0);
            v4 = new Vertex(-r/2, 0,  r*.5*sqrt3);
            v5 = new Vertex(-r/2, 0, -r*.5*sqrt3);
            v7 = new Vertex(0,    0,  0);
        }

        const v6 = new Vertex(0, h+h2, 0);

        this.addVertex(v0, v1, v2, v3, v4, v5, v6, v7);
        let index = 8;

        this.addPrimitive(LineSegment.buildVertex(6, 0),
                          LineSegment.buildVertex(6, 1),
                          LineSegment.buildVertex(6, 2));
        // the top edge
        this.addPrimitive(LineSegment.buildVertex(0, 1),
                          LineSegment.buildVertex(1, 2),
                          LineSegment.buildVertex(2, 0));
        // three vertical edges
        this.addPrimitive(LineSegment.buildVertex(0, 3),
                          LineSegment.buildVertex(1, 4),
                          LineSegment.buildVertex(2, 5));
        // the bottom edge
        this.addPrimitive(LineSegment.buildVertex(3, 4),
                          LineSegment.buildVertex(4, 5),
                          LineSegment.buildVertex(5, 3));
        // 3 bottom faces
        this.addPrimitive(LineSegment.buildVertex(7, 3),
                          LineSegment.buildVertex(7, 4),
                          LineSegment.buildVertex(7, 5));

        if (n>0)
        {
            let dY = 2*h/(n+1);
            if (!bothHalves)
            {
                dY = h/(n+1);
            }

            for (let x = 0; x < n; x += 1)
            {
                let y = -h + (x+1) * dY;
                if (!bothHalves)
                {
                    y = (x+1) * dY;
                }

                this.addVertex(new Vertex( r,    y,    0),
                               new Vertex(-r/2,  y,  r*0.5*sqrt3),
                               new Vertex(-r/2,  y, -r*0.5*sqrt3));

                this.addPrimitive(LineSegment.buildVertex(index+0, index+1),
                                  LineSegment.buildVertex(index+1, index+2),
                                  LineSegment.buildVertex(index+2, index+0));
                index += 3;
            }
        }
    }
}