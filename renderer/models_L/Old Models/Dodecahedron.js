/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import {LineSegment, Model, Vertex} from "../scene/SceneExport.js";

export default class Dodecahedron extends Model
{
    constructor()
    {
        super(undefined, undefined, undefined, "Dodecahedron");

        const t = (1 + Math.sqrt(5))/2;   // golden ratio
        const r = 1/t;
        const r2 = r * r;

        this.addVertex(new Vertex(-r, -r, -r),
                       new Vertex(-r, -r,  r),
                       new Vertex(-r,  r, -r),
                       new Vertex(-r,  r,  r),
                       new Vertex( r, -r, -r),
                       new Vertex( r, -r,  r),
                       new Vertex( r,  r, -r),
                       new Vertex( r,  r,  r));


        this.addVertex(new Vertex( 0, -r2, -1),
                       new Vertex( 0, -r2,  1),
                       new Vertex( 0,  r2, -1),
                       new Vertex( 0,  r2,  1));


        this.addVertex(new Vertex(-r2, -1,  0),
                       new Vertex(-r2,  1,  0),
                       new Vertex( r2, -1,  0),
                       new Vertex( r2,  1,  0));


        this.addVertex(new Vertex(-1,  0, -r2),
                       new Vertex( 1,  0, -r2),
                       new Vertex(-1,  0,  r2),
                       new Vertex( 1,  0,  r2));

        this.addPrimitive(LineSegment.buildVertex( 3, 11),
                          LineSegment.buildVertex(11,  7),
                          LineSegment.buildVertex( 7, 15),
                          LineSegment.buildVertex(15, 13),
                          LineSegment.buildVertex(13,  3));

        this.addPrimitive(LineSegment.buildVertex( 7, 19),
                          LineSegment.buildVertex(19, 17),
                          LineSegment.buildVertex(17,  6),
                          LineSegment.buildVertex( 6, 15));

        this.addPrimitive(LineSegment.buildVertex(17,  4),
                          LineSegment.buildVertex( 4,  8),
                          LineSegment.buildVertex( 8, 10),
                          LineSegment.buildVertex(10,  6));

        this.addPrimitive(LineSegment.buildVertex( 8,  0),
                          LineSegment.buildVertex( 0, 16),
                          LineSegment.buildVertex(16,  2),
                          LineSegment.buildVertex( 2, 10));

        this.addPrimitive(LineSegment.buildVertex( 0, 12),
                          LineSegment.buildVertex(12,  1),
                          LineSegment.buildVertex( 1, 18),
                          LineSegment.buildVertex(18, 16));

        this.addPrimitive(LineSegment.buildVertex( 2, 13));

        this.addPrimitive(LineSegment.buildVertex(18,  3));

        this.addPrimitive(LineSegment.buildVertex( 1,  9),
                          LineSegment.buildVertex( 9, 11));

        this.addPrimitive(LineSegment.buildVertex( 4, 14),
                          LineSegment.buildVertex(14, 12));

        this.addPrimitive(LineSegment.buildVertex( 9,  5),
                          LineSegment.buildVertex( 5, 19));

        this.addPrimitive(LineSegment.buildVertex( 5, 14));
    }
}