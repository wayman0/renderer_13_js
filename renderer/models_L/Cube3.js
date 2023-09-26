/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Create a wireframe model of a cube with its center
   at the origin, having edge length 2, and with its
   corners at {@code (�1, �1, �1)}.
<p>
   This version of the cube model has each face of
   the cube cut up by a triangle fan.
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

   @see Cube
   @see Cube2
   @see Cube4
*/
//@ts-check

import {Cube} from "./ModelsExport.js";
import {Vertex, LineSegment} from "../scene/SceneExport.js";
import {format} from "../scene/util/UtilExport.js";

export default class Cube3 extends Cube
{
   /**
      Create a cube with its center at the origin, having edge
      length 2, with its corners at {@code (�1, �1, �1)}, and
      with each of the cube's faces containing a triangle fan
      with the given number of triangles along each of the x,
      y, and z directions.
      <p>
      There must be at least one triangle along each direction.

      @param {number} [xCount=1]  number of triangles along the x-direction
      @param {number} [yCount=1]  number of triangles along the y-direction
      @param {number} [zCount=1]  number of triangles along the z-direction
   */
   constructor(xCount=1, yCount=1, zCount=1)
   {
      // create the basic cube with 8 vertices and 12 edges
      super(format("Cube3(%d,%d,%d)", xCount, yCount, zCount) );

      if (xCount < 1)
         throw new Error("xCount must be greater than or equal to 1");
      if (yCount < 1)
         throw new Error("yCount must be greater than or equal to 1");
      if (zCount < 1)
         throw new Error("zCount must be greater than or equal to 1");

      let index = 8;

      const xStep = 2.0 / xCount,
            yStep = 2.0 / yCount,
            zStep = 2.0 / zCount;

      this.addVertex(new Vertex( 0,  0,  1),   // center front
                     new Vertex( 0,  0, -1),   // center back
                     new Vertex( 0,  1,  0),   // center top
                     new Vertex( 0, -1,  0),   // center bottom
                     new Vertex( 1,  0,  0),   // center right
                     new Vertex(-1,  0,  0));  // center left
      const centerFront  = index,
            centerBack   = index + 1,
            centerTop    = index + 2,
            centerBottom = index + 3,
            centerRight  = index + 4,
            centerLeft   = index + 5;
      index += 6;

      // Triangles along all four edges parallel to the x-axis.
      let x = -1.0;
      for(let i = 0; i <= xCount; ++i)
      {
         this.addVertex(new Vertex(x,  1,  1),
                        new Vertex(x, -1,  1),
                        new Vertex(x,  1, -1),
                        new Vertex(x, -1, -1));
         // front face, top and bottom edges
         this.addPrimitive(LineSegment.buildVertex(index+0, centerFront),
                           LineSegment.buildVertex(index+1, centerFront));
         // back face, top and bottom edges
         this.addPrimitive(LineSegment.buildVertex(index+2, centerBack),
                           LineSegment.buildVertex(index+3, centerBack));
         // top face, front and back edges
         this.addPrimitive(LineSegment.buildVertex(index+0, centerTop),
                           LineSegment.buildVertex(index+2, centerTop));
         // bottom face, front and back edges
         this.addPrimitive(LineSegment.buildVertex(index+1, centerBottom),
                           LineSegment.buildVertex(index+3, centerBottom));
         x += xStep;
         index += 4;
      }

      // Triangles along all four edges parallel to the y-axis.
      let y = -1.0;
      for (let i = 0; i <= yCount; ++i)
      {
         this.addVertex(new Vertex( 1, y,  1),
                        new Vertex(-1, y,  1),
                        new Vertex( 1, y, -1),
                        new Vertex(-1, y, -1));
         // front face, right and left edges
         this.addPrimitive(LineSegment.buildVertex(index+0, centerFront),
                           LineSegment.buildVertex(index+1, centerFront));
         // back face, right and left edges
         this.addPrimitive(LineSegment.buildVertex(index+2, centerBack),
                           LineSegment.buildVertex(index+3, centerBack));
         // right face, front and back edges
         this.addPrimitive(LineSegment.buildVertex(index+0, centerRight),
                           LineSegment.buildVertex(index+2, centerRight));
         // left face, front and back edges
         this.addPrimitive(LineSegment.buildVertex(index+1, centerLeft),
                           LineSegment.buildVertex(index+3, centerLeft));
         y += yStep;
         index += 4;
      }

      // Triangles along all four edges parallel to the z-axis.
      let z = -1.0;
      for(let i = 0; i <= zCount; ++i)
      {
         this.addVertex(new Vertex( 1,  1, z),
                        new Vertex(-1,  1, z),
                        new Vertex( 1, -1, z),
                        new Vertex(-1, -1, z));
         // top face, right and left edges
         this.addPrimitive(LineSegment.buildVertex(index+0, centerTop),
                           LineSegment.buildVertex(index+1, centerTop));
         // bottom face, right and left edges
         this.addPrimitive(LineSegment.buildVertex(index+2, centerBottom),
                           LineSegment.buildVertex(index+3, centerBottom));
         // right face, top and bottom edges
         this.addPrimitive(LineSegment.buildVertex(index+0, centerRight),
                           LineSegment.buildVertex(index+2, centerRight));
         // left face, top and bottom edges
         this.addPrimitive(LineSegment.buildVertex(index+1, centerLeft),
                           LineSegment.buildVertex(index+3, centerLeft));
         z += zStep;
         index += 4;
      }
   }
}//Cube3
