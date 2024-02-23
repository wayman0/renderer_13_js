/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Create a wireframe model of a frustum of a right square pyramid
   with its base in the xz-plane.
<p>
   See <a href="https://en.wikipedia.org/wiki/Frustum" target="_top">
                https://en.wikipedia.org/wiki/Frustum</a>

   @see Pyramid
*/
//@ts-check 

import {Model, Vertex, LineSegment} from "../scene/SceneExport.js";
import {format} from "../scene/util/UtilExport.js";

export default class PyramidFrustum extends Model
{
   /**@type {number} */ #s1;
   /**@type {number} */ #s2;
   /**@type {number} */ #h;
   /**@type {number} */ #n;
   /**@type {number} */ #k;

   /**
      Create a frustum of a right square pyramid with its base in the
      xz-plane, a base side length of {@code s1}, top side length of
      {@code s2}, and height {@code h}.
   <p>
      This model works with either {@code s1 > s2} or {@code s1 < s2}.
      In other words, the frustum can have its "apex" either above or
      below the xz-plane.

      @param {number} [s1=2]  side length of the base of the frustum
      @param {number} [s2=1]  side length of the top of the frustum
      @param {number} [h =.5]  height of the frustum
      @param {number} [n =7]  number of lines of latitude
      @param {number} [k =4]  number of lines of longitude
   */
   constructor(s1=2, s2=1, h=.5, n=7, k=4)
   {
      super(undefined, undefined, undefined, undefined, undefined,  format("Pyramid Frustum(%.2f,%.2f,%.2f,%d,%d)", s1,  s2,  h,   n, k));

      if (n < 0)
         throw new Error("n must be greater than or equal to 0");
      if (k < 1)
         throw new Error("k must be greater than 0");

      this.#s1 = s1;
      this.#s2 = s2;
      this.#h = h;
      this.#n = n;
      this.#k = k;

      // Create the frustum's geometry.
      let index = 0;

      // Create all the lines of longitude from the top, down to the base,
      // across the base, then back up to the top, and across the top.
      s1 = s1/2;
      s2 = s2/2;
      const delta1 = (2 * s1) / k;
      const delta2 = (2 * s2) / k;
      
      // lines of "longitude" perpendicular to the x-axis
      for (let j = 0; j <= k; ++j)
      {
         const  d1 = j * delta1;
         const  d2 = j * delta2;

         this.addVertex(new Vertex(-s2+d2, h, -s2),
                        new Vertex(-s1+d1, 0, -s1),
                        new Vertex(-s1+d1, 0,  s1),
                        new Vertex(-s2+d2, h,  s2));

         this.addPrimitive(LineSegment.buildVertex(index+0, index+1),
                           LineSegment.buildVertex(index+1, index+2),
                           LineSegment.buildVertex(index+2, index+3),
                           LineSegment.buildVertex(index+3, index+0));
         index += 4;
      }

      // lines of "longitude" perpendicular to the z-axis
      for (let j = 0; j <= k; ++j)
      {
         const d1 = j * delta1;
         const d2 = j * delta2;

         this.addVertex(new Vertex( s2, h, -s2+d2),
                        new Vertex( s1, 0, -s1+d1),
                        new Vertex(-s1, 0, -s1+d1),
                        new Vertex(-s2, h, -s2+d2));

         this.addPrimitive(LineSegment.buildVertex(index+0, index+1),
                           LineSegment.buildVertex(index+1, index+2),
                           LineSegment.buildVertex(index+2, index+3),
                           LineSegment.buildVertex(index+3, index+0));
         index += 4;
      }

      // Create all the lines of "latitude" around the pyramid, starting
      // from the base and working up to the top.
      const deltaH = h / (n + 1);
      const deltaS = (s1 - s2) / (n + 1);

      let s = s1;
      for (let i = 0; i <= n; ++i)
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

   
   getHorizCount()
   {
      return this.#n;
   }

   getVertCount()
   {
      return this.#k;
   }

   /**
    * Build a new Model using the same parameters but the given line counts
    * @param {number} n the new horizontal line count
    * @param {number} k the new vertical line count
    * @returns {PyramidFrustum} the new model with the same parameters but different line counts
    */
   remake(n, k)
   {
      return new PyramidFrustum(this.#s1, this.#s2, this.#h, n, k);
   }
}//PyramidFrustum
