/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Create a wireframe model of a square in the xy-plane centered at the origin.
*/
//@ts-check 

import {Model, Vertex, LineSegment, LineStrip, Lines} from "../scene/SceneExport.js";
import {format} from "../scene/util/UtilExport.js";

export default class SquareGrid extends Model
{
   /**@type {number} */ #r;
   /**@type {number} */ #n;
   /**@type {number} */ #k;

   /**
      Create a square in the xy-plane with corners {@code (�r, �r, 0)} and
      with {@code n} grid lines parallel to the x-axis and
      with {@code k} grid lines parallel to the y-axis.
   <p>
      If there are {@code n} grid lines parallel to the x-axis, then each
      grid line parallel to the y-axis will have {@code n+1} line segments.
      If there are {@code k} grid lines parallel to the y-axis, then each
      grid line parallel to the x-axis will have {@code k+1} line segments.

      @param {number} [r=1]  determines the corners of the square
      @param {number} [n=1]  number of grid lines parallel to the x-axis
      @param {number} [k=1]  number of grid lines parallel to the y-axis
   */
   constructor(r=1,n=1, k=1)
   {
      super(undefined, undefined, undefined, undefined, undefined,  format("Square Grid(%.2f,%d,%d)", r, n, k));

      if (n < 0)
         throw new Error("n must be greater than or equal to 0");
      if (k < 0)
         throw new Error("k must be greater than or equal to 0");
      if (r <= 0)
         throw new Error("r must be greater than 0");

      this.#r = r;
      this.#n = n;
      this.#k = k;

      // Create the square's geometry.

      const xStep = (2 * r) / (1 + k);
      const yStep = (2 * r) / (1 + n);

      // An array of vertices to be used to create the line segments.
      /**@type {Vertex[][]} */
      const v = new Array(n+2);
      for(let i = 0; i < v.length; i += 1)
         v[i] = new Array(k+2);

      // Create all the vertices.
      for (let i = 0; i <= n + 1; ++i)
      {
         for (let j = 0; j <= k + 1; ++j)
            // from top-to-bottom and left-to-right
            v[i][j] = new Vertex(r - j * xStep, -r + i * yStep, 0);
      }

      // this.add all of the vertices to this model.
      for (let i = 0; i < n + 2; ++i)
      {
         for (let j = 0; j < k + 2; ++j)
            this.addVertex( v[i][j] );
      }

      // Create the line segments parallel to the x-axis.
      for (let i = 0; i < n + 2; ++i)
      {
         const lineStrip = new LineStrip();
         for (let j = 0; j < k + 1; ++j)
            lineStrip.addIndex( (i*(k+2)) + j);

         this.addPrimitive(lineStrip);
      }

      // Create the line segments parallel to the y-axis.
      for (let j = 0; j < k + 2; ++j)
      {
         const lineStrip = new LineStrip();
         for (let i = 0; i < n + 1; ++i)
            lineStrip.addIndex((i*(k+2)) + j);

         this.addPrimitive(lineStrip);
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
    * @returns {SquareGrid} the new model with the same parameters but different line counts
    */
   remake(n, k)
   {
      return new SquareGrid(this.#r, n, k);
   }
}//SquareGrid
