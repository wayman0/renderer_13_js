/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Create a wireframe model of a cube with its center
   at the origin, having edge length 2, and with its
   vertices at {@code (�1, �1, �1)}.
<p>
   Here is a picture showing how the cube's eight
   corners are labeled.
<pre>{@code
                  v4=(-1,1,-1)
                  +---------------------+ v5=(1,1,-1)
                 /|                    /|
                / |                   / |
               /  |                  /  |
              /   |                 /   |
             /    |                /    |
         v7 +---------------------+ v6  |
            |     |               |     |
            |     |               |     |
            |     | v0=(-1,-1,-1) |     |
            |     +---------------|-----+ v1=(1,-1,-1)
            |    /                |    /
            |   /                 |   /
            |  /                  |  /
            | /                   | /
            |/                    |/
            +---------------------+
            v3=(-1,-1,1)          v2=(1,-1,1)
}</pre>
   See <a href="https://en.wikipedia.org/wiki/Cube" target="_top">
                https://en.wikipedia.org/wiki/Cube</a>

   @see Tetrahedron
   @see Octahedron
   @see Icosahedron
   @see Dodecahedron
*/
//@ts-check

import {Model, Vertex, LineSegment} from "../scene/SceneExport.js";

export default class Cube extends Model
{
   /**
      Create a cube with its center at the origin, having edge
      length 2, and with its vertices at {@code (�1, �1, �1)}.

      @param {string} name  a {link String} that is a name for this {@code Cube}
   */
   constructor(name = "Cube")
   {
      super(undefined, undefined, undefined, name);

      // Create 8 vertices.
      this.addVertex(new Vertex(-1, -1, -1), // 4 vertices around the bottom face
                     new Vertex( 1, -1, -1),
                     new Vertex( 1, -1,  1),
                     new Vertex(-1, -1,  1),
                     new Vertex(-1,  1, -1), // 4 vertices around the top face
                     new Vertex( 1,  1, -1),
                     new Vertex( 1,  1,  1),
                     new Vertex(-1,  1,  1));

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
}//Cube
