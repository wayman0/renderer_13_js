/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Create a wireframe model of a partial right circular cylinder
   with its axis along the y-axis.
<p>
   By a partial cylinder we mean a cylinder over a circular sector
   of the cylinder's base.
<p>
   See <a href="https://en.wikipedia.org/wiki/Circular_sector" target="_top">
                https://en.wikipedia.org/wiki/Circular_sector</a>

   @see Cylinder
   @see CircleSector
   @see DiskSector
   @see RingSector
   @see ConeSector
   @see SphereSector
   @see TorusSector
*/
//@ts-check

import {Model, Vertex, LineSegment} from "../scene/SceneExport.js";
import {format} from "../scene/util/UtilExport.js";

export default class CylinderSector extends Model
{
   /**@type {number} */ #r;
   /**@type {number} */ #h;
   /**@type {number} */ #theta1;
   /**@type {number} */ #theta2;
   /**@type {number} */ #n;
   /**@type {number} */ #k;

   /**
      Create a part of the cylinder with radius {@code r} and its
      axis along the y-axis from {@code y = h} to {@code y = -h}.
   <p>
      The partial cylinder is a cylinder over the circular sector
      from angle {@code theta1} to angle {@code theta2} (in the
      counterclockwise direction).
   <p>
      The last two parameters determine the number of lines of longitude
      and the number of (partial) circles of latitude in the model.
   <p>
      If there are {@code n} circles of latitude in the model, then
      each line of longitude will have {@code n-1} line segments.
      If there are {@code k} lines of longitude, then each (partial)
      circle of latitude will have {@code k-1} line segments.
   <p>
      There must be at least four lines of longitude and at least
      two circles of latitude.

      @param {number} [r =1]  radius of the cylinder
      @param {number} [h =1]  height of the cylinder (from h to -h along the y-axis)
      @param {number} [theta1=Math.PI/2]    beginning longitude angle of the sector (in radians)
      @param {number} [theta2=3*Math.PI/2]  ending longitude angle of the sector (in radians)
      @param {number} [n =15]  number of circles of latitude around the cylinder
      @param {number} [k =8]   number of lines of longitude
      @param {string} name the name of the model used to seperate between sector and cylinder
   */
   constructor(r=1, h=1, theta1=Math.PI/2, theta2=3*Math.PI/2, n=15, k=8, name = format("Cylinder Sector(%.2f,%.2f,%.2f,%.2f,%d,%d)", r, h, theta1, theta2, n, k))
   {
      super(undefined, undefined, undefined, name);

      if (n < 2)
         throw new Error("n must be greater than 1");
      if (k < 4)
         throw new Error("k must be greater than 3");

      theta1 = theta1 % (2*Math.PI);
      theta2 = theta2 % (2*Math.PI);
      if (theta1 < 0) theta1 = 2*Math.PI + theta1;
      if (theta2 < 0) theta2 = 2*Math.PI + theta2;
      if (theta2 <= theta1) theta2 = theta2 + 2*Math.PI;

      this.#r = r;
      this.#h = h;
      this.#theta1 = theta1;
      this.#theta2 = theta2;
      this.#n = n;
      this.#k = k;

      // Create the cylinder's geometry.

      const deltaH = (2.0 * h) / (n - 1),
            deltaTheta = (theta2 - theta1)/ (k - 1);

      // An array of vertices to be used to create line segments.
      /**@type {Vertex[][]} */
      const v = new Array(n);
      for(let i = 0; i < v.length; i += 1)
         v[i] = new Array(k);

      // Create all the vertices (from the top down).
      for (let j = 0; j < k; ++j) // choose an angle of longitude
      {
         const c = Math.cos(theta1 + j*deltaTheta),
               s = Math.sin(theta1 + j*deltaTheta);
         for (let i = 0; i < n; ++i) // choose a circle of latitude
         {
            v[i][j] = new Vertex( r * c,
                                  h - i * deltaH,
                                 -r * s );
         }
      }
      const topCenter    = new Vertex(0,  h, 0),
            bottomCenter = new Vertex(0, -h, 0);

      // Add all of the vertices to this model.
      for (let i = 0; i < n; ++i)
      {
         for (let j = 0; j < k; ++j)
            this.addVertex( v[i][j] );
      }

      this.addVertex(topCenter, bottomCenter);
      const topCenterIndex    = n * k,
            bottomCenterIndex = n * k + 1;

      // Create all the horizontal (partial) circles of latitude around the cylinder.
      for (let i = 0; i < n; ++i) // choose a circle of latitude
      {
         for (let j = 0; j < k - 1; ++j)
            //                                v[i][j]      v[i][j+1]
            this.addPrimitive(LineSegment.buildVertex( (i * k) + j, (i * k) + (j+1) ));
      }

      // Create the lines of longitude from the top to the bottom.
      for (let j = 0; j < k; ++j) // choose a line of longitude
      {  //                                              v[0][j]
         this.addPrimitive(LineSegment.buildVertex( topCenterIndex, (0 * k) + j ));
         
         for (let i = 0; i < n - 1; ++i)
            //                                v[i][j]       v[i+1][j]
            this.addPrimitive(LineSegment.buildVertex( (i * k) + j, ((i+1) * k) + j ));

         this.addPrimitive(LineSegment.buildVertex( ((n-1) * k) + j, bottomCenterIndex ));
         //                                v[n-1][j]
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
    * @returns {CylinderSector} the new model with the same parameters but different line counts
    */
   remake(n, k)
   {
      return new CylinderSector(this.#r, this.#h, this.#theta1, this.#theta2, n, k);
   }
}//CylinderSector
