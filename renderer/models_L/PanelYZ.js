/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Create a flat wireframe checkerboard panel in the yz-plane.
*/
//@ts-check 

import {Model, Vertex, LineSegment} from "../scene/SceneExport.js";
import {format} from "../scene/util/StringFormat.js";

export default class PanelYZ extends Model
{
   /**Create a flat checkerboard panel parallel to the yz-plane with the given dimensions.

      @param {number} [yMin=-1]  location of bottom edge
      @param {number} [yMax=1]  location of top edge
      @param {number} [zMin=-1]  location of back edge
      @param {number} [zMax=1]  location of front edge
      @param {number} [x   =0]  x-plane that holds the panel
   */
   constructor(yMin=-1, yMax=1, zMin=-1, zMax=1, x=0)
   {
      super(undefined, undefined, undefined, "PanelYZ");

      // Create the checkerboard panel's geometry.

      // An array of indexes to be used to create line segments.
      /**@type {number[][]} */
      const index = new Array(yMax-yMin+1);
      for(let i = 0; i < index.length; i += 1)
         index[i] = new Array(zMax-zMin + 1)


      // Create the checkerboard of vertices.
      let i = 0;
      for (let y = yMin; y <= yMax; ++y)
      {
         for (let z = zMin; z <= zMax; ++z)
         {
            this.addVertex(new Vertex(x, y, z));
            index[y-yMin][z-zMin] = i;
            ++i;
         }
      }

      // Create the line segments that run in the z-direction.
      for (let y = 0; y <= yMax - yMin; ++y)
      {
         for (let z = 0; z < zMax - zMin; ++z)
            this.addPrimitive(LineSegment.buildVertex(index[y][z], index[y][z+1]));
      }

      // Create the line segments that run in the y-direction.
      for (let z = 0; z <= zMax - zMin; ++z)
      {
         for (let y = 0; y < yMax - yMin; ++y)
            this.addPrimitive(LineSegment.buildVertex(index[y][z], index[y+1][z]));
      }
   }
}//PanelYZ
