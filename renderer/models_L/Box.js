/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import {LineSegment, Model, Vertex} from "../scene/SceneExport.js";

export default class Box extends Model
{
    /**
     *
     * @param {number} xs
     * @param {number} ys
     * @param {number} zs
     */
    constructor(xs = 1, ys = 1, zs = 1)
    {
        super(undefined, undefined, undefined, "Box(" + xs + ", " + ys + ", " + zs + ")");

        if (typeof xs != "number" ||
            typeof ys != "number" ||
            typeof zs != "number")
               throw new Error("All parameters must be numerical");

        this.addVertex(new Vertex(0,    0,     0),
                       new Vertex(0+xs, 0,     0),
                       new Vertex(0+xs, 0,     0 + zs),
                       new Vertex(0,    0,     0 + zs),
                       new Vertex(0,    0+ys,  0),
                       new Vertex(0+xs, 0+ys,  0),
                       new Vertex(0+xs, 0+ys,  0 + zs),
                       new Vertex(0,    0+ys,  0 + zs));

        this.addPrimitive(LineSegment.buildVertex(0, 1),
                          LineSegment.buildVertex(1, 2),
                          LineSegment.buildVertex(2, 3),
                          LineSegment.buildVertex(3, 0),
                          LineSegment.buildVertex(4, 5),
                          LineSegment.buildVertex(5, 6),
                          LineSegment.buildVertex(6, 7),
                          LineSegment.buildVertex(7, 4),
                          LineSegment.buildVertex(0, 4),
                          LineSegment.buildVertex(1, 5),
                          LineSegment.buildVertex(2, 6),
                          LineSegment.buildVertex(3, 7))
    }
}