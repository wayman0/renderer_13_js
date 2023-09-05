/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import {LineSegment, Model, Vertex} from "../scene/SceneExport.js";

export default class Icosahedron extends Model
{
    constructor()
    {
        super(undefined, undefined, undefined, "Icosahedron");

        const t = (1 + Math.sqrt(5))/2;
        const r = 1/t;

        this.addVertex(new Vertex(-r,  1,  0),
                       new Vertex( r,  1,  0),
                       new Vertex(-r, -1,  0),
                       new Vertex( r, -1,  0),
                       new Vertex( 0, -r,  1),
                       new Vertex( 0,  r,  1),
                       new Vertex( 0, -r, -1),
                       new Vertex( 0,  r, -1),
                       new Vertex( 1,  0, -r),
                       new Vertex( 1,  0,  r),
                       new Vertex(-1,  0, -r),
                       new Vertex(-1,  0,  r));

        this.addPrimitive(LineSegment.buildVertex( 0,  1),
                          LineSegment.buildVertex( 0,  5),
                          LineSegment.buildVertex( 0,  7),
                          LineSegment.buildVertex( 0, 11),
                          LineSegment.buildVertex( 0, 10),
                          LineSegment.buildVertex( 1,  5),
                          LineSegment.buildVertex( 1,  7),
                          LineSegment.buildVertex( 1,  9),
                          LineSegment.buildVertex( 1,  8),
                          LineSegment.buildVertex( 5, 11),
                          LineSegment.buildVertex( 5,  9),
                          LineSegment.buildVertex( 5,  4),
                          LineSegment.buildVertex( 7, 10),
                          LineSegment.buildVertex( 7,  8),
                          LineSegment.buildVertex( 7,  6),
                          LineSegment.buildVertex(11, 10),
                          LineSegment.buildVertex(11,  4),
                          LineSegment.buildVertex(11,  2),
                          LineSegment.buildVertex( 9,  8),
                          LineSegment.buildVertex( 9,  4),
                          LineSegment.buildVertex( 9,  3),
                          LineSegment.buildVertex(10,  6),
                          LineSegment.buildVertex(10,  2),
                          LineSegment.buildVertex( 8,  6),
                          LineSegment.buildVertex( 8,  3),
                          LineSegment.buildVertex( 4,  2),
                          LineSegment.buildVertex( 4,  3),
                          LineSegment.buildVertex( 6,  2),
                          LineSegment.buildVertex( 6,  3),
                          LineSegment.buildVertex( 2,  3));
    }
}