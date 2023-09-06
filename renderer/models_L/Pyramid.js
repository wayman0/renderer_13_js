/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Create a wireframe model of a right square pyramid with its
   base in the xz-plane and its apex on the positive y-axis.
<p>
   See <a href="https://en.wikipedia.org/wiki/Pyramid_(geometry)" target="_top">
                https://en.wikipedia.org/wiki/Pyramid_(geometry)</a>

   @see PyramidFrustum
*/
//@ts-check 

import {Model, Vertex, LineSegment} from "../scene/SceneExport.js";
import format from "../StringFormat";

export default  class Pyramid extends Model 
{
   /**@type {number} */ #s;
   /**@type {number} */ #h;
   /**@type {number} */ #n;
   /**@type {number} */ #k;

   /**
      Create a right square pyramid with its base in the xz-plane,
      a base length of {@code s}, height {@code h}, and apex on the
      positive y-axis.
   <p>
      The last parameter provides a choice between having a square
      grid of lines or a line fan in the base of the pyramid.

      @param {number} [s=2]  side length of the base in the xz-plane
      @param {number} [h=1]  height of the apex on the y-axis
      @param {number} [n=15]  number of lines of latitude around the body of the pyramid
      @param {number} [k=4]  number of triangles in the triangle fan at the top of each side
      @param {boolean} [grid=false]  choose either a square grid or a line fan in the base
   */
   constructor(s=2, h=1, n=15, k=4, grid=false)
   {
      super(undefined, undefined, format("Pyramid(%.2f,%.2f,%d,%d)", s, h, n, k));

      if (n < 1)
         throw new Error("n must be greater than 0");
      if (k < 1)
         throw new Error("k must be greater than 0");

      this.#s = s;
      this.#h = h;
      this.#n = n;
      this.#k = k;

      // Create the pyramid's geometry.
      this.addVertex(new Vertex(0, h, 0));
      const apexIndex = 0;
      let index = 1;

      // Create all the lines of "longitude" from the apex, down
      // to the base, across the base, and then back up to the apex.
      s = s/2;
      const delta = (2 * s) / k;
      // lines of "longitude" perpendicular to the x-axis
      for (let j = 0; j < k + 1; ++j)
      {
         const d = j * delta;
         if (grid)
         {
            this.addVertex(new Vertex(-s+d, 0, -s),
                           new Vertex(-s+d, 0,  s));
         }
         else // a fan in the base
         {
            this.addVertex(new Vertex(-s+d, 0, -s),
                           new Vertex( s-d, 0,  s));
         }
         
         this.addPrimitive(LineSegment.buildVertex(apexIndex, index+0),
                           LineSegment.buildVertex(index+0, index+1),
                           LineSegment.buildVertex(index+1, apexIndex));
         index += 2;
      }

      // lines of "longitude" perpendicular to the z-axis
      for (let j = 1; j < k; ++j)
      {
         const d = j * delta;
         if (grid)
         {
            this.addVertex(new Vertex( s, 0, -s+d),
                           new Vertex(-s, 0, -s+d));
         }
         else // a fan in the base
         {
            this.addVertex(new Vertex( s, 0, -s+d),
                           new Vertex(-s, 0,  s-d));
         }

         this.addPrimitive(LineSegment.buildVertex(apexIndex, index+0),
                           LineSegment.buildVertex(index+0, index+1),
                           LineSegment.buildVertex(index+1, apexIndex));
         index += 2;
      }

      // Create all the lines of "latitude" around the pyramid, starting
      // from the base and working upwards.
      const deltaH = h / n;
      const deltaS = s / n;

      for (let i = 0; i < n; ++i)
      {
         h = i * deltaH;
         this.addVertex(new Vertex( s, h,  s),
                        new Vertex( s, h, -s),
                        new Vertex(-s, h, -s),
                        new Vertex(-s, h,  s));
                        
         this.addPrimitive(LineSegment.buildVertex(index+0, index+1),
                           LineSegment.buildVertex(index+1, index+2),
                           LineSegment.buildVertex(index+2, index+3),
                           LineSegment.buildVertex(index+3, index+0));
         s -= deltaS;
         index += 4;
      }
   }
}//Pyramid
