/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

import { LineFan, LineLoop, Lines } from "../scene/SceneExport";

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

      const xStep = 2.0 / xCount,
            yStep = 2.0 / yCount,
            zStep = 2.0 / zCount;

      let bottomFan = new LineFan();
      let topFan    = new LineFan();
      let backFan   = new LineFan();
      let frontFan  = new LineFan();
      let leftFan   = new LineFan();
      let rightFan  = new LineFan();

      this.addVertex(new Vertex( 0, -1,  0),   // center front
                     new Vertex( 0,  1,  0),   // center back
                     new Vertex( 0,  0, -1),   // center top
                     new Vertex( 0,  0,  1),   // center bottom
                     new Vertex(-1,  0,  0),   // center right
                     new Vertex( 1,  0,  0));  // center left

      bottomFan.addIndex(0);
      topFan.addIndex(1);
      backFan.addIndex(2);
      frontFan.addIndex(3);
      leftFan.addIndex(4);
      rightFan.addIndex(5);
      
      let index = 6;

      // Triangles along all four edges parallel to the x-axis.
      let x = -1.0;
      for(let i = 0; i <= xCount; ++i)
      {
         this.addVertex(new Vertex(x, -1, -1));
         x += xStep;

         bottomFan.addIndex(index);
         backFan.addIndex(index);

         index += 1;
      }

      let z = -1.0;
      for(let i = 0; i < zCount ++i)
      {
         this.addVertex(new Vertex(1, -1, z));
         z += zStep;
         bottomFan.addIndex(index);
         rightFan.addIndex(index);
         index += 1;
      }

      x = 1.0;
      for(let i = 0; i < xCount; ++i)
      {
         this.addVertex(new Vertex(x, -1, 1));
         x -= xStep;
         bottomFan.addIndex(index);
         frontFan.addIndex(index);
         index += 1;
      }

      z = 1.0;
      for(let i = 0; i < zCount; ++i)
      {
         this.addVertex(new Vertex(-1, -1, z));
         z -= zStep;
         bottomFan.addIndex(index);
         leftFan.addIndex(index);
         index += 1;
      }

      x = -1;
      for(let i = 0; i < xCount; ++i)
      {
         this.addVertex(new Vertex(x, 1, -1));
         x += xStep;
         topFan.addIndex(index);
         backFan.addIndex(index);
         index += 1;
      }

      z = -1;
      for(let i = 0; i < zCount; ++i)
      {
         this.addVertex(new Vertex(1, 1, z));
         z += zStep;
         topFan.addIndex(index);
         rightFan.addIndex(index);
         index += 1;
      }

      x = 1.0;
      for (let i = 0; i < xCount; ++i)
      {
         this.addVertex(new Vertex(x, 1, 1));
         x -= xStep;
           topFan.addIndex(index);
         frontFan.addIndex(index);
         index++;
      }
      z = 1.0;
      for (let i = 0; i < zCount; ++i)
      {
         this.addVertex(new Vertex(-1, 1, z));
         z -= zStep;
          topFan.addIndex(index);
         leftFan.addIndex(index);
         index++;
      }

      // The vertices for the four vertical edges.
      let y = -1.0;
      for (let i = 1; i < yCount; ++i)
      {
         y += yStep;
         this.addVertex(new Vertex(-1, y, -1));
         backFan.addIndex(index);
         leftFan.addIndex(index);
         index++;
      }
      y = -1.0;
      for (let i = 1; i < yCount; ++i)
      {
         y += yStep;
         this.addVertex(new Vertex(1, y, -1));
          backFan.addIndex(index);
         rightFan.addIndex(index);
         index++;
      }
      y = -1.0;
      for (let i = 1; i < yCount; ++i)
      {
         y += yStep;
         this.addVertex(new Vertex(1, y, 1));
         frontFan.addIndex(index);
         rightFan.addIndex(index);
         index++;
      }
      y = -1.0;
      for (let i = 1; i < yCount; ++i)
      {
         y += yStep;
         this.addVertex(new Vertex(-1, y, 1));
         frontFan.addIndex(index);
          leftFan.addIndex(index);
         index++;
      }

      // Line loop around the bottom face.
      this.addPrimitive(new LineLoop(6,
                                6 + xCount,
                                6 + xCount+zCount,
                                6 + 2*xCount+zCount));
      // line loop around the top face.
      this.addPrimitive(new LineLoop(6 + 2*xCount+2*zCount,
                                6 + 3*xCount+2*zCount,
                                6 + 3*xCount+3*zCount,
                                6 + 4*xCount+3*zCount));
      // Four vertical edges.
      this.addPrimitive(new Lines(6,                   6 + 2*xCount+2*zCount,
                             6 + xCount,          6 + 3*xCount+2*zCount,
                             6 + xCount+zCount,   6 + 3*xCount+2*zCount,
                             6 + 2*xCount+zCount, 6 + 4*xCount+3*zCount));

      this.addPrimitive(bottomFan,
                      topFan,
                     backFan,
                    frontFan,
                     leftFan,
                    rightFan);
   }
}//Cube3
