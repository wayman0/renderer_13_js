/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Create a wireframe model of a disk
   in the xy-plane centered at the origin.
<p>
   See <a href="https://en.wikipedia.org/wiki/Disk_(mathematics)" target="_top">
                https://en.wikipedia.org/wiki/Disk_(mathematics)</a>

   @see DiskSector
*/
//@ts-check

import {DiskSector} from "./ModelsExport.js";
import {format} from "../scene/util/UtilExport.js";
import {LineSegment, Vertex} from "../scene/SceneExport.js";

export default class Disk extends DiskSector
{
   // /**@type {number} */ #r;
   // /**@type {number} */ #n;
   // /**@type {number} */ #k;

   /**
      Create a disk in the xy-plane with radius
      {@code r}, with {@code k} spokes coming out
      of the center, and with {@code n} concentric
      circles around the disk.
   <p>
      If there are {@code k} spokes, then each circle around
      the center will have {@code k} line segments.
      If there are {@code n} concentric circles around the
      center, then each spoke will have {@code n} line segments.
   <p>
      There must be at least three spokes and at least
      one concentric circle.

      @param {number} [r=1]  radius of the disk
      @param {number} [n=6]  number of concentric circles
      @param {number} [k=12]  number of spokes in the disk
   */
   constructor(r=1, n=6, k=12)
   {
      super(r, 0, 2*Math.PI, n, k, format("Disk(%.2f,%d,%d)", r, n, k));

      /*
      if (n < 1)
         throw new Error("n must be greater than 0");
      if (k < 3)
         throw new Error("k must be greater than 2");

      this.#r = r;
      this.#n = n;
      this.#k = k;

      // Create the disk's geometry.

      const deltaR = r / n,
            deltaTheta = 2 * Math.PI / k;
      */
      // An array of vertices to be used to create line segments.
      // /**@type {Vertex[][]} */
      // const v = new Array(n);
      // for(let i = 0; i < v.length; i += 1)
      //      v[i] = new Array(k);

      /*
      // Create all the vertices.
      for (let j = 0; j < k; ++j) // choose a spoke (an angle)
      {
         const c = Math.cos(j * deltaTheta),
               s = Math.sin(j * deltaTheta);
         for (let i = 0; i < n; ++i) // move along the spoke
         {
            const ri = (i + 1) * deltaR;
            v[i][j] = new Vertex( ri * c,
                                  ri * s,
                                  0 );
         }
      }
      const center = new Vertex(0,0,0);

      // Add all of the vertices to this model.
      for (let i = 0; i < n; ++i)
      {
         for (let j = 0; j < k; ++j)
            this.addVertex( v[i][j] );
      }

      this.addVertex( center );
      const centerIndex = n * k;

      // Create the spokes connecting the center to the outer circle.
      for (let j = 0; j < k; ++j) // choose a spoke
      {  //                                             v[0][j]
         this.addPrimitive(LineSegment.buildVertex( centerIndex, (0 * k) + j ));
         for (let i = 0; i < n - 1; ++i)
         {  //                                v[i][j]         v[i+1][j]
            this.addPrimitive(LineSegment.buildVertex( (i * k) + j, ((i+1) * k) + j ));
         }
      }

      // Create the line segments around each concentric circle.
      for (let i = 0; i < n; ++i)  // choose a circle
      {
         for (let j = 0; j < k - 1; ++j)
            //                               v[i][j]         v[i][j+1]
            this.addPrimitive(LineSegment.buildVertex( (i * k) + j, (i * k) + (j + 1) ));
         
         // close the circle
         this.addPrimitive(LineSegment.buildVertex( (i * k) + (k-1), (i * k) + 0 ));
      }  //                                v[i][k-1]        v[i][0]
      */
   }
}//Disk
