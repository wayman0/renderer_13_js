/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Create a wireframe model of a cuboid aligned with
   the x, y, and z axes and with one corner at the
   origin.
<p>
   Here is a picture showing how the cuboid's eight
   vertices are labeled.
<pre>{@code
                  y
                  |
                  | v4
                  +---------------------+ v5
                 /|                    /|
                / |                   / |
               /  |                  /  |
              /   |                 /   |
             /    |                /    |
         v7 +---------------------+ v6  |
            |     |               |     |
            |     |               |     |
            |     | v0=(0,0,0)    |     | v1
            |     +---------------|-----+------> x
            |    /                |    /
            |   /                 |   /
            |  /                  |  /
            | /                   | /
            |/                    |/
            +---------------------+
           /v3                    v2
          /
         z
}</pre>
   See <a href="https://en.wikipedia.org/wiki/Cuboid" target="_top">
                https://en.wikipedia.org/wiki/Cuboid</a>

   @see Cube
*/
//@ts-check

import {Model, Vertex, LineSegment} from "../scene/SceneExport.js";
import {format} from "../scene/util/UtilExport.js";

export default class Box extends Model
{
   /**
      Create a {@code Box} with the given side lengths.

      @param {number} [xs=1]  the size of the {@code Box} along the x-axis
      @param {number} [ys=1]  the size of the {@code Box} along the y-axis
      @param {number} [zs=1]  the size of the {@code Box} along the z-axis
   */
   constructor(xs=1, ys=1, zs=1)
   {
      super(undefined, undefined, undefined, undefined, undefined,  format("Box(%.2f,%.2f,%.2f)", xs, ys, zs));

      // Create 8 vertices.
      this.addVertex(new Vertex(0,    0,    0), // 4 vertices around the bottom face
                     new Vertex(0+xs, 0,    0),
                     new Vertex(0+xs, 0,    0+zs),
                     new Vertex(0,    0,    0+zs),
                     new Vertex(0,    0+ys, 0), // 4 vertices around the top face
                     new Vertex(0+xs, 0+ys, 0),
                     new Vertex(0+xs, 0+ys, 0+zs),
                     new Vertex(0,    0+ys, 0+zs));

      // Create 12 line segments.
      this.addPrimitive(LineSegment.buildVertex(0, 1),  // bottom face
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
}//Box
