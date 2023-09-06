/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Create a wireframe model of a right circular cone with its base
   parallel to the xz-plane and its apex on the positive y-axis.
<p>
   See <a href="https://en.wikipedia.org/wiki/Cone" target="_top">
                https://en.wikipedia.org/wiki/Cone</a>
<p>
   This model can also be used to create right k-sided polygonal pyramids.
<p>
   See <a href="https://en.wikipedia.org/wiki/Pyramid_(geometry)" target="_top">
                https://en.wikipedia.org/wiki/Pyramid_(geometry)</a>

   @see ConeFrustum
*/
//@ts-check

import {ConeSector} from "./ModelsExport.js";
import {format} from "../scene/util/StringFormat.js";

export default class Cone extends ConeSector
{
  // /**@type {number} */ #r;
  // /**@type {number} */ #h;
  // /**@type {number} */ #n;
  // /**@type {number} */ #k;

  /**
      Create a right circular cone with its base in the xz-plane,
      a base radius of {@code r}, height {@code h}, and apex on
      the y-axis.
   <p>
      The last two parameters determine the number of lines of longitude
      and the number of circles of latitude in the model.
   <p>
      If there are {@code n} circles of latitude in the model (including
      the bottom edge), then each line of longitude will have {@code n+1}
      line segments. If there are {@code k} lines of longitude, then each
      circle of latitude will have {@code k} line segments.
   <p>
      There must be at least three lines of longitude and at least
      one circle of latitude.
   <p>
      By setting {@code k} to be a small integer, this model can also
      be used to create k-sided polygonal pyramids.

      @param {number} [r=1]  radius of the base in the xz-plane
      @param {number} [h=1]  height of the apex on the y-axis
      @param {number} [n=15]  number of circles of latitude around the cone
      @param {number} [k=6]  number of lines of longitude
   */
   constructor(r=1, h=1, n=15, k=6)
   {
      super(r, h, h, 0, 360, n, k, format("Cone(%.2f,%.2f,%d,%d)", r, h, n, k));

      /*
      if (n < 2)
         throw new Error("n must be greater than 1");
      if (k < 4)
         throw new Error("k must be greater than 3");

      this.#r = r;
      this.#h = h;
      this.#n = n;
      this.#k = k;

      // Create the cone's geometry.

      const deltaH = h / (n - 1),
            deltaTheta = (2.0*Math.PI) / (k - 1);

      // An array of indexes to be used to create line segments.
      const indexes = new Array(n);
      for(let i = 0; i < indexes.length; i+= 1)
         indexes[i] = new Array(k);

      // Create all the vertices (from the bottom up).
      let index = 0;
      for(let j = 0; j < k; ++j) // choose an angle of longitude
      {
         const c = Math.cos(j * deltaTheta),
               s = Math.sin(j * deltaTheta);
         for(let i = 0; i < n; ++i) // choose a circle of latitude
         {
            const slantRadius = r * (1 - i * deltaH / h);
            
            this.addVertex(new Vertex(slantRadius * c,
                                      i * deltaH,
                                      slantRadius * s) );
            indexes[i][j] = index++;
         }
      }

      this.addVertex(new Vertex(0, h, 0) ); // apex
      const apexIndex = index;
      ++index;
      
      this.addVertex(new Vertex(0, 0, 0) ); // bottom center
      const bottomCenterIndex = index;
      ++index;

      // Create all the horizontal circles of latitude around the cone.
      for(let i = 0; i < n; ++i)
      {
         for(let j = 0; j < k - 1; ++j)
            this.addPrimitive(LineSegment.buildVertex(indexes[i][j], indexes[i][j+1]));
      }

      // Create the slanted lines of longitude from the base to the
      // apex, and the triangle fan in the base.
      for(let j = 0; j < k; ++j)
      {
         this.addPrimitive(LineSegment.buildVertex(bottomCenterIndex, indexes[0][j]));

         for(let i = 0; i < n - 1; ++i)
            this.addPrimitive(LineSegment.buildVertex(indexes[i][j], indexes[i+1][j]));

         this.addPrimitive(LineSegment.buildVertex(indexes[n-1][j], apexIndex));
      }
      */
   }
}//Cone
