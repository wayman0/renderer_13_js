/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Create a wireframe model of a sector of a disk
   in the xy-plane centered at the origin.
<p>
   See <a href="https://en.wikipedia.org/wiki/Circular_sector" target="_top">
                https://en.wikipedia.org/wiki/Circular_sector</a>

   @see Disk
   @see CircleSector
   @see RingSector
   @see ConeSector
   @see CylinderSector
   @see SphereSector
   @see TorusSector
*/
//@ts-check

import {Model, Vertex, LineSegment} from "../scene/SceneExport.js";
import {format} from "../scene/util/StringFormat.js";

export default class DiskSector extends Model 
{
   /**@type {number} */ #r;
   /**@type {number} */ #theta1;
   /**@type {number} */ #theta2;
   /**@type {number} */ #n;
   /**@type {number} */ #k;

   /**
      Create a sector of a disk in the xy-plane with radius {@code r},
      starting angle {@code theta1}, ending angle {@code theta2},
      with {@code k} spokes coming out of the center, and with
      {@code n} concentric circles around the disk.
   <p>
      If there are {@code k} spokes, then each (partial) circle
      around the center will have {@code k-1} line segments.
      If there are {@code n} concentric circles around the center,
      then each spoke will have {@code n} line segments.
   <p>
      There must be at least four spokes and at least one concentric circle.

      @param {number} [r =1]  radius of the disk
      @param {number} [theta1=0]        beginning angle of the sector (in radians)
      @param {number} [theta2=Math.PI]  ending angle of the sector (in radians)
      @param {number} [n =6]  number of concentric circles
      @param {number} [k =8]  number of spokes in the disk
      @param {string} name name of model used to differentiate between disk and disk sector
   */
   constructor(r=1, theta1=0, theta2=Math.PI, n=6, k=8, name = format("Disk Sector(%.2f,%.2f,%.2f,%d,%d)", r, theta1, theta2, n, k))
   {
      super(undefined, undefined, undefined, name);

      if (n < 1)
         throw new Error("n must be greater than 0");
      if (k < 4)
         throw new Error("k must be greater than 3");

      theta1 = theta1 % (2*Math.PI);
      theta2 = theta2 % (2*Math.PI);
      if (theta1 < 0) theta1 = 2*Math.PI + theta1;
      if (theta2 < 0) theta2 = 2*Math.PI + theta2;
      if (theta2 <= theta1) theta2 = theta2 + 2*Math.PI;

      this.#r = r;
      this.#theta1 = theta1;
      this.#theta2 = theta2;
      this.#n = n;
      this.#k = k;

      // Create the disk's geometry.

      const deltaR = r / n,
            deltaTheta = (theta2 - theta1) / (k - 1);

      // An array of vertices to be used to create line segments.
      /**@type {Vertex[][]} */
      const v = new Array(n);
      for(let i = 0; i < v.length; i += 1)
         v[i] = new Array(k);

      // Create all the vertices.
      for (let j = 0; j < k; ++j) // choose a spoke (an angle)
      {
         const c = Math.cos(theta1 + j * deltaTheta),
               s = Math.sin(theta1 + j * deltaTheta);
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
            //                                 v[i][j]        v[i+1][j]
            this.addPrimitive(LineSegment.buildVertex( (i * k) + j, ((i+1) * k) + j ));
      }

      // Create the line segments around each (partial) concentric circle.
      for (let i = 0; i < n; ++i)  // choose a circle
      {
         for (let j = 0; j < k - 1; ++j)
            //                                v[i][j]        v[i][j+1]
            this.addPrimitive(LineSegment.buildVertex( (i * k) + j, (i * k) + (j + 1) ));
      }
   }
}//DiskSector
