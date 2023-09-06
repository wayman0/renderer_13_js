/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Create a wireframe model of a circle in
   the xy-plane centered at the origin.
*/
//@ts-check

import {CircleSector} from "./ModelsExport.js";
import {format} from "../scene/util/StringFormat.js";

export default class Circle extends CircleSector
{
   // /**@type {number} */ #r;
   // /**@type {number} */ #n;
   

   /**
      Create a circle in the xy-plane with radius {@code r}
      and with {@code n} line segments around the circumference.

      @param {number} [r=1]  radius of the circle
      @param {number} [n=16]  number of line segments in the circle's circumference
   */
   constructor(r = 1, n = 16)
   {
      super(r, 0, 360, 16, format("Circle(%f.2,%d)", r, n));

      /*
      this.#r = r;
      this.#n = n;

      // Create the circle's geometry.
      const deltaTheta = (2.0 * Math.PI) / n;

      // Create all the vertices.
      for (let i = 0; i < n; ++i)
      {
         const c = Math.cos(i * deltaTheta),
               s = Math.sin(i * deltaTheta);
         this.addVertex( new Vertex(r * c, r * s, 0) );
      }

      // Create the line segments around the circle.
      for (let i = 0; i < n - 1; ++i)
         this.addPrimitive(new LineSegment([i, i+1]));
      
      this.addPrimitive(new LineSegment([n-1, 0]));
      */
   }
}//Circle
