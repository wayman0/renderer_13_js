/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Create a flat wireframe checkerboard panel in the xz-plane.
*/
//@ts-check 

import {Model, Vertex, LineSegment} from "../scene/SceneExport.js";
import {format} from "../scene/util/UtilExport.js";

export default class PanelXZ extends Model
{
   /**
      Create a flat checkerboard panel parallel to the xz-plane with the given dimensions.

      @param {number} [xMin=-1]  location of left edge
      @param {number} [xMax=1]  location of right edge
      @param {number} [zMin=-1]  location of back edge
      @param {number} [zMax=1]  location of front edge
      @param {number} [y   =0]  y-plane that holds the panel
   */
   constructor(xMin = -1, xMax =1, zMin=-1, zMax=1, y=0)
   {
      super(undefined, undefined, undefined, "PanelXZ");

      // Create the checkerboard panel's geometry.

      // An array of indexes to be used to create line segments.
      /**@type {number[][]} */
      const index = new Array(xMax-xMin+1);
      for(let i = 0; i < index.length; i += 1)
         index[i] = new Array(zMax-zMin + 1)

      // Create the checkerboard of vertices.
      let i = 0;
      for (let x = xMin; x <= xMax; ++x)
      {
         for (let z = zMin; z <= zMax; ++z)
         {
            this.addVertex(new Vertex(x, y, z));
            index[x-xMin][z-zMin] = i;
            ++i;
         }
      }

      // Create the line segments that run in the z-direction.
      for (let x = 0; x <= xMax - xMin; ++x)
      {
         for (let z = 0; z < zMax - zMin; ++z)
            this.addPrimitive(LineSegment.buildVertex(index[x][z], index[x][z+1]));
      }

      // Create the line segments that run in the x-direction.
      for (let z = 0; z <= zMax - zMin; ++z)
      {
         for (let x = 0; x < xMax - xMin; ++x)
            this.addPrimitive(LineSegment.buildVertex(index[x][z], index[x+1][z]));
      }
   }
}//PanelXZ
