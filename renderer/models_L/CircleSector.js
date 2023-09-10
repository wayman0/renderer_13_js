/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Create a wireframe model of an arc from a circle in
   the xy-plane centered at the origin.

   @see DiskSector
   @see RingSector
   @see ConeSector
   @see CylinderSector
   @see SphereSector
   @see TorusSector
*/
//@ts-check

import {Model, Vertex, LineSegment} from "../scene/SceneExport.js";
import {format} from "../scene/util/StringFormat.js";

export default class CircleSector extends Model
{
   /**@type {number} */ #r;
   /**@type {number} */ #theta1;
   /**@type {number} */ #theta2;
   /**@type {number} */ #n;

   /**
      Create an arc (a sector) of a circle in the xy-plane with
      radius {@code r}, starting angle {@code theta1}, ending
      angle {@code theta2}, and with {@code n} line segments
      around the circumference.
   <p>
      The arc is drawn counterclockwise starting at angle
      {@code theta1} and ending at angle {@code theta2}. Notice
      that this means that if {@code theta1 <= theta2}, then we are
      drawing the arc between the angles, but if {@code theta1 > theta2},
      then we are removing the arc between the angles.
   <p>
      Notice that any two angles define two arcs from a circle.
      We want a definition for this method that unambiguously
      determines, for any two angles, which of the two arcs to
      draw.

      @param {number} [r=1]         radius of the circle
      @param {number} [theta1=0]    beginning angle of the sector (in radians)
      @param {number} [theta2=180]  ending angle of the sector (in radians)
      @param {number} [n=8]         number of line segments in the circle's circumference
      @param {string} name          name of the model, used for specifying between sector and circle
   */
   constructor(r =1, theta1=0, theta2=Math.PI, n=8, name = format("CircleSector(%.2f,%.2f,%.2f,%d)", r, theta1, theta2, n))
   {
      super(undefined, undefined, undefined, name);

      if (n < 4)
         throw new Error("n must be greater than 3");

      theta1 = theta1 % (2*Math.PI);
      theta2 = theta2 % (2*Math.PI);
      if (theta1 < 0) theta1 = 2*Math.PI + theta1;
      if (theta2 < 0) theta2 = 2*Math.PI + theta2;
      if (theta2 <= theta1) theta2 = theta2 + 2*Math.PI;

      this.#r = r;
      this.#theta1 = theta1;
      this.#theta2 = theta2;
      this.#n = n;

      // Create the arc's geometry.
      const deltaTheta = (theta2 - theta1) / (n - 1);

      // Create all the vertices.
      for (let i = 0; i < n; ++i)
      {
         const c = Math.cos(theta1 + i * deltaTheta),
               s = Math.sin(theta1 + i * deltaTheta);
         this.addVertex( new Vertex(r * c, r * s, 0) );
      }

      // Create the line segments around the arc.
      for (let i = 0; i < n - 1; ++i)
      {
         this.addPrimitive(new LineSegment([i, i+1]));
      }
   }
}//CircleSector
