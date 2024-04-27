/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//https://docs.oracle.com/javase/8/docs/api/java/util/function/package-summary.html

/**
   Create a wireframe model of a parametric surface in space.
<p>
   See <a href="https://en.wikipedia.org/wiki/Parametric_surface" target="_top">
                https://en.wikipedia.org/wiki/Parametric_surface</a>

   @see ParametricCurve
*/
//@ts-check

import {Model, Vertex, LineSegment, LineStrip, Lines} from "../scene/SceneExport.js";
import {format} from "../scene/util/UtilExport.js";

export default class ParametricSurface extends Model
{
   /**the default function for calculating x component*/ static x(s, t){return Math.sin(Math.PI*s) * Math.sin(Math.PI*t)};
   /**the default function for calculating y component*/ static y(s, t){return Math.sin(Math.PI*s) * Math.sin(Math.PI*t)};
   /**the default function for calculating z component*/ static z(s, t){return Math.sin(Math.PI*s) * Math.sin(Math.PI*t)};

   /**@type {number}   the default start value for the first variable  */ #s1;
   /**@type {number}   the default end value for the first variable    */ #s2;
   /**@type {number}   the default start value for the second variable */ #t1;
   /**@type {number}   the default end value for the second variable   */ #t2;
   /**@type {number}   */ #n;
   /**@type {number}   */ #k;
   /**@type {Function} */ #xF;
   /**@type {Function} */ #yF;
   /**@type {Function} */ #zF;


   /**
      Create a parametric surface in space,
      <pre>{@code
         x = x(s,t)
         y = y(s,t)
         z = z(s,t)
      }</pre>
      with the parameters {@code s} and {@code t} having
      the given parameter ranges and the given number of
      mesh lines in each parametric direction.

      @param {Function} [xFunc=ParametricSurface.x]   component function in the x-direction
      @param {Function} [yFunc=ParametricSurface.y]   component function in the y-direction
      @param {Function} [zFunc=ParametricSurface.z]   component function in the z-direction
      @param {number}   [s1=-1]  beginning value of first parameter range
      @param {number}   [s2=1]  ending value of first parameter range
      @param {number}   [t1=-1]  beginning value of second parameter range
      @param {number}   [t2=1]  ending value of second parameter range
      @param {number}   [n =49]  number of mesh lines in first range
      @param {number}   [k =49]  number of mesh lines in second range
   */
   constructor(xFunc=ParametricSurface.x, yFunc=ParametricSurface.y, zFunc=ParametricSurface.z, s1=-1, s2=1, t1=-1, t2=1, n=49, k=49)
   {

    if(typeof xFunc != "function" ||
        typeof yFunc != "function" ||
        typeof zFunc != "function")
            throw new Error("xfunc, yfunc, zfunc are supposed to be functions");

      if(typeof s1 != "number" || typeof s2 != "number" || 
         typeof t1 != "number" || typeof t2 != "number" ||
         typeof n  != "number" || typeof k  != "number")
            throw new Error("S1, S2, T1, T2, N and K must be numerical");

      super(undefined, undefined, undefined, undefined, undefined,  format("Parametric Surface(%d,%d)", n, k));

      if (n < 2)
         throw new Error("n must be greater than 1");
      if (k < 2)
         throw new Error("k must be greater than 1");

      this.#xF = xFunc;
      this.#yF = yFunc;
      this.#zF = zFunc;
      this.#s1 = s1;
      this.#s2 = s2;
      this.#t1 = t1;
      this.#t2 = t2;
      this.#n = n;
      this.#k = k;


      // Create the surface's geometry.

      const deltaS = (s2 - s1) / (n - 1); // lines of latitude (dy)
      const deltaT = (t2 - t1) / (k - 1); // lines of longitude (dx)

      // An array of vertices to be used to create the line segments.
      /**@type {Vertex[][]} */
      const v = new Array(n);
      for(let i = 0; i < v.length; i += 1)
        v[i] = new Array(k);

      // Create all the vertices.
      for(let i = 0; i < n; ++i) // choose a line of latitude
      {
         for(let j = 0; j < k; ++j) // choose a line of longitude
         {
            v[i][j] = new Vertex(xFunc(s1 + i*deltaS, t1 + j*deltaT),
                                 yFunc(s1 + i*deltaS, t1 + j*deltaT),
                                 zFunc(s1 + i*deltaS, t1 + j*deltaT));
         }
      }

      // Add all of the vertices to this model.
      for(let i = 0; i < n; ++i)
      {
         for(let j = 0; j < k; ++j)
            this.addVertex( v[i][j] );
      }

      // Create the horizontal line segments.
      for(let i = 0; i < n; ++i) // choose a line of latitude
      {
         const lineStrip = new LineStrip();
         for(let j = 0; j < k; ++j) // choose a line of longitude
            //                               v[i][j]        v[i][j+1]
            lineStrip.addIndex((i*k)+j);

         this.addPrimitive(lineStrip);
      }

      // Create the vertical line segments.
      for(let j = 0; j < k; ++j) // choose a line of longitude
      {
         const lineStrip = new LineStrip();
         for(let i = 0; i < n; ++i) // choose a line of latitude
            //                              v[i][j]         v[i+1][j]
            lineStrip.addIndex((i*k)+j);

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
    * @returns {ParametricSurface} the new model with the same parameters but different line counts
    */
   remake(n, k)
   {
      return new ParametricSurface(this.#xF, this.#yF, this.#zF, this.#s1, this.#s2, this.#t1, this.#t2, n, k);
   }
}//ParametricSurface
