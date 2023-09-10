/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Create a wireframe model of a ring (an annulus)
   in the xy-plane centered at the origin.
<p>
   See <a href="https://en.wikipedia.org/wiki/Annulus_(mathematics)" target="_top">
                https://en.wikipedia.org/wiki/Annulus_(mathematics)</a>

   @see RingSector
*/
//@ts-check 

import {format} from "../scene/util/StringFormat.js";
import {RingSector} from "./ModelsExport.js";

export default class Ring extends RingSector
{
   // /**@type {number} */ #r1;
   // /**@type {number} */ #r2;
   // /**@type {number} */ #n;
   // /**@type {number} */ #k;

   /**
      Create a ring (annulus) in the xy-plane with outer
      radius {@code r1} and with inner radius {@code r2},
      with {@code k} spokes coming out of the center, and
      with {@code n} concentric circles (not counting the
      inner most circle).
   <p>
      If there are {@code k} spokes, then each circle around
      the center will have {@code k} line segments. If there
      are {@code n} concentric circles around the center (not
      counting the inner most circle), then each spoke will
      have {@code n} line segments.
   <p>
      There must be at least three spokes and at least one concentric circle.

      @param {number} [r1=1]  outer radius of the ring
      @param {number} [r2=.33]  inner radius of the ring
      @param {number} [n =4]  number of concentric circles
      @param {number} [k =12]  number of spokes in the ring
   */
   constructor(r1=1, r2=.33, n=4, k=12)
   {
      super(r1, r2, 0, 2*Math.PI, n, k);
      this.name = format("Ring(%.2f,%.2f,%d,%d)", r1, r2, n, k);

      /*
      if (n < 1)
         throw new Error("n must be greater than 0");
      if (k < 3)
         throw new Error("k must be greater than 2");

      this.#r1 = r1;
      this.#r2 = r2;
      this.#n = n;
      this.#k = k;

      // Create the rings's geometry.

      const deltaR = (r1 - r2) / n;
      const deltaTheta = (2 * Math.PI) / k;

      */
      // An array of vertices to be used to create line segments.
      // /**@type {Vertex[][]} */
      // const v = new Array(n);
      // for(let i = 0; i < v.length; i += 1)
      //    v[i] = new Array(k);

      /*
      // Create all the vertices.
      for (let j = 0; j < k; ++j) // choose a spoke (an angle)
      {
         const c = Math.cos(j * deltaTheta);
         const s = Math.sin(j * deltaTheta);
         for (let i = 0; i < n + 1; ++i) // move along the spoke
         {
            final double ri = r2 + i * deltaR;
            v[i][j] = new Vertex(ri * c,
                                 ri * s,
                                 0);
         }
      }

      // this.add all of the vertices to this model.
      for (let i = 0; i < n + 1; ++i)
      {
         for (let j = 0; j < k; ++j)
            this.addVertex( v[i][j] );
      }

      // Create line segments around each concentric ring.
      for (let i = 0; i < n + 1; ++i)  // choose a ring
      {
         for (let j = 0; j < k - 1; ++j)
            //                                v[i][[j]     v[i][j+1]
            this.addPrimitive(LineSegment.buildVertex( (i * k) + j, (i * k) + (j+1) ));
            
         // close the circle
         this.addPrimitive(LineSegment.buildVertex( (i * k) + (k-1), (i * k) + 0 ));
      }  //                                v[i][k-1]         v[i][0]

      // Create the spokes.connecting the inner circle to the outer circle.
      for (let j = 0; j < k; ++j) // choose a spoke
      {
         for (let i = 0; i < n; ++i)
            //                                v[i][j]       v[i+1][j]
            this.addPrimitive(LineSegment.buildVertex( (i * k) + j, ((i+1) * k) + j ));
      }
      */
   }
}//Ring
