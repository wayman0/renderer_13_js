/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import {LineSegment, Model, Vertex} from "../scene/SceneExport.js";

export default class Cube extends Model
{
    constructor(s = 1)
    {
        super(undefined, undefined, undefined, "Cube");

        this.addVertex( new Vertex(-s, -s, -s), // 4 vertices around the bottom face
                        new Vertex( s, -s, -s),
                        new Vertex( s, -s,  s),
                        new Vertex(-s, -s,  s),
                        new Vertex(-s,  s, -s), // 4 vertices around the top face
                        new Vertex( s,  s, -s),
                        new Vertex( s,  s,  s),
                        new Vertex(-s,  s,  s));

        // Create 12 line segments.
        this.addPrimitive( LineSegment.buildVertex(0, 1),  // bottom face
                           LineSegment.buildVertex(1, 2),
                           LineSegment.buildVertex(2, 3),
                           LineSegment.buildVertex(3, 0),
                           LineSegment.buildVertex(4, 5),  // top face
                           LineSegment.buildVertex(5, 6),
                           LineSegment.buildVertex(6, 7),
                           LineSegment.buildVertex(7, 4),
                           LineSegment.buildVertex(0, 4),  // back face
                           LineSegment.buildVertex(1, 5),
                           LineSegment.buildVertex(2, 6),  // front face
                           LineSegment.buildVertex(3, 7));
    }
}