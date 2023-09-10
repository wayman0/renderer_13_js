/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Create a wireframe model of a frustum of a right circular cone
   with its base in the xz-plane.
<p>
   See <a href="https://en.wikipedia.org/wiki/Frustum" target="_top">
                https://en.wikipedia.org/wiki/Frustum</a>

   @see Cone
   @see ConeSector
*/
//@ts-check

import {Model, Vertex, LineSegment} from "../scene/SceneExport.js";
import {format} from "../scene/util/StringFormat.js";

export default class ConeFrustum extends Model 
{
   /**@type {number} */ #r1;
   /**@type {number} */ #r2;
   /**@type {number} */ #h;
   /**@type {number} */ #n;
   /**@type {number} */ #k;

   /**
      Create a frustum of a right circular cone with its base in the
      xz-plane, a base radius of {@code r1}, top radius of {@code r2},
      and height {@code h}.
   <p>
      This model works with either {@code r1 > r2} or {@code r1 < r2}.
      In other words, the frustum can have its "apex" either above or
      below the xz-plane.
   <p>
      There must be at least three lines of longitude and at least
      two circles of latitude.

      @param {number} [r1=1]  radius of the base of the frustum
      @param {number} [h=.5]   height of the frustum
      @param {number} [r2=.5]  radius of the top of the frustum
      @param {number} [n=7]   number of circles of latitude
      @param {number} [k=16]   number of lines of longitude
   */
   constructor(r1=1, h=.5, r2=.5, n=7, k=16)
   {
      super(undefined, undefined, undefined, format("Cone Frustum(%.2f,%.2f,%.2f,%d,%d)", r1,  h,   r2,  n, k));

      if (n < 2)
         throw new Error("n must be greater than 1");
      if (k < 3)
         throw new Error("k must be greater than 2");

      this.#r1 = r1;
      this.#r2 = r2;
      this.#h = h;
      this.#n = n;
      this.#k = k;

      // Create the frustum's geometry.
      const deltaH = h / (n - 1),
            deltaTheta = (2 * Math.PI) / k;

      // An array of indexes to be used to create line segments.
      const indexes = new Array(n);
      for(let i = 0; i < indexes.length; i += 1)
         indexes[i] = new Array(k);

      // Create all the vertices (from the top down).
      let index = 0;
      for (let j = 0; j < k; ++j) // choose an angle of longitude
      {
         const c = Math.cos(j * deltaTheta),
               s = Math.sin(j * deltaTheta);

         for (let i = 0; i < n; ++i) // choose a circle of latitude
         {
            const slantRadius = (i/(n - 1.0)) * r1 + (1.0 - i/(n - 1.0)) * r2;

            this.addVertex(new Vertex( slantRadius * c,
                                       h - i * deltaH,
                                       slantRadius * s) );
            indexes[i][j] = index;
            ++index;
         }
      }
      this.addVertex( new Vertex(0, h, 0) );  // top center
      const topCenterIndex = index;
      ++index;
      this.addVertex( new Vertex(0, 0, 0) );  // bottom center
      const bottomCenterIndex = index;
      ++index;

      // Create all the horizontal circles of latitude around the frustum wall.
      for (let i = 0; i < n; ++i)
      {
         for (let j = 0; j < k-1; ++j)
            this.addPrimitive(LineSegment.buildVertex(indexes[i][j], indexes[i][j+1]));

         // close the circle
         this.addPrimitive(LineSegment.buildVertex(indexes[i][k-1], indexes[i][0]));
      }

      // Create the vertical half-trapazoids of longitude from north to south pole.
      for (let j = 0; j < k; ++j)
      {
         // Create the triangle fan at the top.
         this.addPrimitive(LineSegment.buildVertex(topCenterIndex, indexes[0][j]));
         // Create the slant lines from the top to the base.
         this.addPrimitive(LineSegment.buildVertex(indexes[0][j], indexes[n-1][j]));
         // Create the triangle fan at the base.
         this.addPrimitive(LineSegment.buildVertex(indexes[n-1][j], bottomCenterIndex));
      }
   }
}//ConeFrustum
