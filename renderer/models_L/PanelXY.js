/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Create a flat wireframe checkerboard panel in the xy-plane.
*/
//@ts-check 

import {Model, Vertex, LineSegment} from "../scene/SceneExport.js";
import {format} from "../scene/util/StringFormat.js";

export default class PanelXY extends Model
{
   /**
      Create a flat checkerboard panel parallel to the xy-plane with the given dimensions.

      @param {number} [xMin=-1]  location of left edge
      @param {number} [xMax=1]  location of right edge
      @param {number} [yMin=-1]  location of bottom edge
      @param {number} [yMax=1]  location of top edge
      @param {number} [z   =0]  z-plane that holds the panel
   */
   constructor(xMin=-1, xMax=1, yMin=-1, yMax=1, z=0)
   {
      super(undefined, undefined, undefined, "PanelXY");

      // Create the checkerboard panel's geometry.

      // An array of indexes to be used to create line segments.
      /**@type {number[][]} */
      const index = new Array(xMax - xMin + 1);
      for(let i = 0; i < index.length; i += 1)
         index[i] = new Array(yMax-yMin + 1);

      // Create the checkerboard of vertices.
      let i = 0;
      for (let x = xMin; x <= xMax; ++x)
      {
         for (let y = yMin; y <= yMax; ++y)
         {
            this.addVertex(new Vertex(x, y, z));
            index[x-xMin][y-yMin] = i;
            ++i;
         }
      }

      // Create the line segments that run in the y-direction.
      for (let x = 0; x <= xMax - xMin; ++x)
      {
         for (let y = 0; y < yMax - yMin; ++y)
            this.addPrimitive(LineSegment.buildVertex(index[x][y], index[x][y+1]));
      }

      // Create the line segments that run in the x-direction.
      for (let y = 0; y <= yMax - yMin; ++y)
      {
         for (let x = 0; x < xMax - xMin; ++x)
            this.addPrimitive(LineSegment.buildVertex(index[x][y], index[x+1][y]));
      }
   }
}//PanelXY
