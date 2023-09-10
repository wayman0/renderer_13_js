/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Create a wireframe model of a sector of a ring (an annulus)
   in the xy-plane centered at the origin.
<p>
   See <a href="https://en.wikipedia.org/wiki/Annulus_(mathematics)" target="_top">
                https://en.wikipedia.org/wiki/Annulus_(mathematics)</a>
<p>
   See <a href="https://en.wikipedia.org/wiki/Circular_sector" target="_top">
                https://en.wikipedia.org/wiki/Circular_sector</a>

   @see Ring
*/
//@ts-check 

import {Model, Vertex, LineSegment} from "../scene/SceneExport.js";
import {format} from "../scene/util/StringFormat.js";

export default  class RingSector extends Model
{
   /**@type {number} */ #r1;
   /**@type {number} */ #r2;
   /**@type {number} */ #theta1;
   /**@type {number} */ #theta2;
   /**@type {number} */ #n;
   /**@type {number} */ #k;

   /**
      Create a sector of a ring (annulus) in the xy-plane
      with outer radius {@code r1}, inner radius {@code r2},
      starting angle {@code theta1}, ending angle {@code theta2},
      with {@code k} spokes coming out of the center, and
      with {@code n} concentric circles.
   <p>
      If there are {@code k} spokes, then each (partial) circle
      around the center will have {@code k-1} line segments.
      If there are {@code n} concentric circles around the center,
      then each spoke will have {@code n-1} line segments.
   <p>
      There must be at least four spokes and at least two concentric circle.

      @param {number} [r1    =1]  outer radius of the ring
      @param {number} [r2    =.33]  inner radius of the ring
      @param {number} [theta1=0]  beginning angle of the sector (in radians)
      @param {number} [theta2=Math.PI]  ending angle of the sector (in radians)
      @param {number} [n     =5]  number of concentric circles
      @param {number} [k     =7]  number of spokes in the ring
   */
   constructor(r1=1, r2=.33, theta1=0, theta2=Math.PI, n=5, k=7)
   {
      super(undefined, undefined, undefined, format("Ring Sector(%.2f,%.2f,%.2f,%.2f,%d,%d)", r1, r2, theta1, theta2, n, k));

      if (n < 2)
         throw new Error("n must be greater than 1");
      if (k < 4)
         throw new Error("k must be greater than 3");

      theta1 = theta1 % (2*Math.PI);
      theta2 = theta2 % (2*Math.PI);
      if (theta1 < 0) theta1 = 2*Math.PI + theta1;
      if (theta2 < 0) theta2 = 2*Math.PI + theta2;
      if (theta2 <= theta1) theta2 = theta2 + 2*Math.PI;

      this.#r1 = r1;
      this.#r2 = r2;
      this.#theta1 = theta1;
      this.#theta2 = theta2;
      this.#n = n;
      this.#k = k;

      // Create the rings's geometry.

      const deltaR = (r1 - r2) / (n - 1);
      const deltaTheta = (theta2 - theta1) / (k - 1);

      // An array of vertices to be used to create line segments.
      /**@type {Vertex[][]} */
      const v = new Array(n);
      for(let i = 0; i < v.length; i += 1)
         v[i] = new Array(k);

      // Create all the vertices.
      for (let j = 0; j < k; ++j) // choose a spoke (an angle)
      {
         const c = Math.cos(theta1 + j * deltaTheta);
         const s = Math.sin(theta1 + j * deltaTheta);
         for (let i = 0; i < n; ++i) // move along the spoke
         {
            const ri = r2 + i * deltaR;
            v[i][j] = new Vertex(ri * c,
                                 ri * s,
                                 0);
         }
      }

      // this.add all of the vertices to this model.
      for (let i = 0; i < n; ++i)
      {
         for (let j = 0; j < k; ++j)
            this.addVertex( v[i][j] );
      }

      // Create line segments around each concentric ring.
      for (let i = 0; i < n; ++i)  // choose a ring
      {
         for (let j = 0; j < k - 1; ++j)
            //                               v[i][j]       v[i][j+1]
            this.addPrimitive(LineSegment.buildVertex( (i * k) + j, (i * k) + (j+1) ));
      }

      // Create the spokes.connecting the inner circle to the outer circle.
      for (let j = 0; j < k; ++j) // choose a spoke
      {
         for (let i = 0; i < n - 1; ++i)
            //                                v[i][j]      v[i+1][j]
            this.addPrimitive(LineSegment.buildVertex( (i * k) + j, ((i+1) * k) + j ));
      }
   }
}//RingSector
