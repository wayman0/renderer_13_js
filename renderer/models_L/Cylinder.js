/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Create a wireframe model of a right circular cylinder
   with its axis along the y-axis.
<p>
   See <a href="https://en.wikipedia.org/wiki/Cylinder" target="_top">
                https://en.wikipedia.org/wiki/Cylinder</a>
<p>
   This model can also be used to create right k-sided polygonal prisms.
<p>
   See <a href="https://en.wikipedia.org/wiki/Prism_(geometry)" target="_top">
                https://en.wikipedia.org/wiki/Prism_(geometry)</a>

   @see CylinderSector
*/
//@ts-check

import {CylinderSector} from "./ModelsExport.js";
import {format} from "../scene/util/StringFormat.js";
//import { LineSegment, Vertex } from "../scene/SceneExport.js";

export default class Cylinder extends CylinderSector
{
   // /**@type {number} */ #r;
   // /**@type {number} */ #h;
   // /**@type {number} */ #n;
   // /**@type {number} */ #k;

   /**
      Create a right circular cylinder with radius {@code r} and
      its axis along the y-axis from {@code y = h} to {@code y = -h}.
   <p>
      The last two parameters determine the number of lines of longitude
      and the number of circles of latitude in the model.
   <p>
      If there are {@code n} circles of latitude in the model (including
      the top and bottom edges), then each line of longitude will have
      {@code n+1} line segments. If there are {@code k} lines of longitude,
      then each circle of latitude will have {@code k} line segments.
   <p>
      There must be at least three lines of longitude and at least
      two circles of latitude.
   <p>
      By setting {@code k} to be a small integer, this model can also be
      used to create k-sided polygonal prisms.

      @param {number} [r=1]  radius of the cylinder
      @param {number} [h=1]  height of the cylinder (from h to -h along the y-axis)
      @param {number} [n=15]  number of circles of latitude around the cylinder
      @param {number} [k=16]  number of lines of longitude
   */
   constructor(r=1, h=1, n=15, k=16)
   {
      super(r, h, 0, 2*Math.PI, n, k, format("Cylinder(%.2f,%.2f,%d,%d)", r, h, n, k));

      /*
      if (n < 2)
         throw new Error("n must be greater than 1");
      if (k < 4)
         throw new Error("k must be greater than 3");

      this.#r = r;
      this.#h = h;
      this.#n = n;
      this.#k = k;

      // Create the cylinder's geometry.

      const deltaH = (2.0 * h) / (n - 1),
            deltaTheta = (2.0 * Math.PI) / (k - 1);
      */

      // An array of vertices to be used to create line segments.
      //final Vertex[][] v = new Vertex[n][k];
      // /**@type {Vertex[][]} */
      // const v = new Array(n);
      // for(let i = 0; i < v.length; i += 1)
         // v[i] = new Array(k);

      /*
      // Create all the vertices (from the top down).
      for (let j = 0; j < k; ++j) // choose an angle of longitude
      {
         const c = Math.cos(j * deltaTheta),
               s = Math.sin(j * deltaTheta);
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

      // Create all the horizontal circles of latitude around the cylinder.
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
      */
   }
}//Cylinder
