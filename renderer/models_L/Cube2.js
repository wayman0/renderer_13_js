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
   the cube cut up by an n by m grid of lines.
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
   @see Cube3
   @see Cube4
*/
//@ts-check

import {Model, Vertex, LineSegment} from "../scene/SceneExport.js";
import {format} from "../scene/util/StringFormat.js";

export default class Cube2 extends Model
{
   /**
      Create a cube with its center at the origin, having edge
      length 2, with its corners at {@code (�1, �1, �1)}, and
      with each of the cube's faces containing the given number
      of grid lines parallel to the x, y, and z directions.

      @param {number} [xGrid=1]  number of grid lines perpendicular to the x-axis
      @param {number} [yGrid=1]  number of grid lines perpendicular to the y-axis
      @param {number} [zGrid=1]  number of grid lines perpendicular to the z-axis
   */
   constructor(xGrid=1, yGrid=1, zGrid=1)
   {
      super(undefined, undefined, undefined, format("Cube2(%d,%d,%d)", xGrid, yGrid, zGrid));

      if (xGrid < 0)
         throw new Error("xGrid must be greater than or equal to 0");
      if (yGrid < 0)
         throw new Error("yGrid must be greater than or equal to 0");
      if (zGrid < 0)
         throw new Error("zGrid must be greater than or equal to 0");

      const xStep = 2.0 / (1 + xGrid),
            yStep = 2.0 / (1 + yGrid),
            zStep = 2.0 / (1 + zGrid);

      // Grid lines perpendicular to the x-axis.
      let x = -1.0;
      for(let i = 0; i <= xGrid + 1; ++i)
      {
         const start = this.vertexList.length;

         // Start at the top, front edge, go down the front face, and around the cube.
         let y = 1.0;
         for(let j = 0; j <= yGrid; ++j)
         {
            this.addVertex( new Vertex(x, y, 1.0) );
            y -= yStep;
         }

         let z = 1.0;
         for(let j = 0; j <= zGrid; ++j)
         {
            this.addVertex( new Vertex(x, -1.0, z) );
            z -= zStep;
         }

         y = -1.0;
         for(let j = 0; j <= yGrid; ++j)
         {
            this.addVertex( new Vertex(x, y, -1.0) );
            y += yStep;
         }

         z = -1.0;
         for (let j = 0; j <= zGrid + 1; ++j)
         {
            this.addVertex( new Vertex(x, 1.0, z) );
            z += zStep;
         }

         // Note: stop - start =  2*yGrid + 2*zGrid + 5
         const stop = this.vertexList.length;
         for (let j = start; j < stop - 1; ++j)
            this.addPrimitive(LineSegment.buildVertex(j, j+1));

         x += xStep;
      }

      // Grid lines perpendicular to the y-axis.
      let y = -1.0;
      for(let i = 0; i <= yGrid + 1; ++i)
      {
         const start = this.vertexList.length;

         // Start at the front, right edge, go left across the front face, and around the cube.
         let x2 = 1.0;
         for (let j = 0; j <= xGrid; ++j)
         {
            this.addVertex( new Vertex(x2, y, 1.0) );
            x2 -= xStep;
         }

         let z = 1.0;
         for (let j = 0; j <= zGrid; ++j)
         {
            this.addVertex( new Vertex(-1.0, y, z) );
            z -= zStep;
         }

         x2 = -1.0;
         for (let j = 0; j <= xGrid; ++j)
         {
            this.addVertex( new Vertex(x2, y, -1.0) );
            x2 += xStep;
         }

         z = -1.0;
         for (let j = 0; j <= zGrid + 1; ++j)
         {
            this.addVertex( new Vertex(1.0, y, z) );
            z += zStep;
         }

         // Note: stop - start =  2*xGrid + 2*zGrid + 5
         const stop = this.vertexList.length;
         for (let j = start; j < stop - 1; ++j)
            this.addPrimitive(LineSegment.buildVertex(j, j+1));

         y += yStep;
      }

      // Grid lines perpendicular to the z-axis.
      let z = -1.0;
      for (let i = 0; i <= zGrid + 1; ++i)
      {
         const start = this.vertexList.length;

         // Start at the top, right edge, go left across the top face, and around the cube.
         let x2 = 1.0;
         for (let j = 0; j <= xGrid; ++j)
         {
            this.addVertex( new Vertex(x2, 1.0, z) );
            x2 -= xStep;
         }

         let y2 = 1.0;
         for (let j = 0; j <= yGrid; ++j)
         {
            this.addVertex( new Vertex(-1.0, y2, z) );
            y2 -= yStep;
         }

         x2 = -1.0;
         for (let j = 0; j <= xGrid; ++j)
         {
            this.addVertex( new Vertex(x2, -1.0, z) );
            x2 += xStep;
         }
         
         y2 = -1.0;
         for (let j = 0; j <= yGrid + 1; ++j)
         {
            this.addVertex( new Vertex(1.0, y2, z) );
            y2 += yStep;
         }
         
         // Note: stop - start =  2*xGrid + 2*yGrid + 5
         const stop = this.vertexList.length;
         for (let j = start; j < stop - 1; ++j)
            this.addPrimitive(LineSegment.buildVertex(j, j+1));

         z += zStep;
      }
   }
}//Cube2
