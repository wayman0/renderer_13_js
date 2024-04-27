/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Create a wireframe model of a parametric curve in space.
<p>
   See <a href="https://en.wikipedia.org/wiki/Parametric_equation" target="_top">
                https://en.wikipedia.org/wiki/Parametric_equation</a>

   @see ParametricSurface
*/
//@ts-check

import {LineSegment, LineStrip, Model, Vertex} from "../scene/SceneExport.js";
import {format} from "../scene/util/UtilExport.js";

export default class ParametricCurve extends Model
{
    /**The default function for calculating the x component*/ static x(t) {return 0.5 * Math.sin(t) + Math.sin(2*t);}
    /**The default function for calculating the y component*/ static y(t) {return 0.5 * Math.cos(t) + Math.cos(2*t);}
    /**The default function for calculating the z component*/ static z(t) {return -.5 * Math.sin(3*t);}
    /**@type {number}   */ #t1;
    /**@type {number}   */ #t2;
    /**@type {number}   */ #n;
    /**@type {Function} */ #xF;
    /**@type {Function} */ #yF;
    /**@type {Function} */ #zF;

    /**
     * 
     * @param {Function} xFunc the function for calculating the x component, must take 1 parameter
     * @param {Function} yFunc the function for calculating the y component, must take 1 parameter
     * @param {Function} zFunc the fucntion for calculating the z component, must take 1 parameter
     * @param {number} t1 beginning value of parameter range
     * @param {number} t2 endeing fvalue of parameter range
     * @param {number} n the number of lines in the parameter range
     */
    constructor(xFunc = ParametricCurve.x, yFunc = ParametricCurve.y, zFunc = ParametricCurve.z, t1 = 0, t2 = 2*Math.PI, n = 60)
    {
        if(typeof t1 != "number" || typeof t2 != "number" || typeof n != "number")
            throw new Error("T1, T2, and N must be numerical");

        if( typeof xFunc != "function" || 
            typeof yFunc != "function" ||
            typeof zFunc != "function" )
                throw new Error("Xfunc, yFunc, and zFunc must be functions and take 1 parameter");

        super(undefined, undefined, undefined, undefined, undefined,  format("Parametric Curve(%d)", n));

        this.#t1 = t1;
        this.#t2 = t2;
        this.#n = n;
        this.#xF = xFunc;
        this.#yF = yFunc;
        this.#zF = zFunc;

        const deltaT = (t2 - t1)/n;
        for(let i = 0; i <= n; i += 1)
        {
            this.addVertex(new Vertex(
                                xFunc(t1 + i*deltaT), 
                                yFunc(t1 + i*deltaT), 
                                zFunc(t1 + i*deltaT)));
        }

        const lineStrip = new LineStrip();
        for(let i = 0; i < n+1; i += 1)
            lineStrip.addIndex(i);

        this.addPrimitive(lineStrip);
    }

    
   getHorizCount()
   {
      return this.#n;
   }

   getVertCount()
   {
      return this.#n;
   }

   /**
    * Build a new Model using the same parameters but the given line counts
    * @param {number} n the new horizontal line count
    * @param {number} k the new vertical line count
    * @returns {ParametricCurve} the new model with the same parameters but different line counts
    */
   remake(n, k)
   {
        let newN = k;
        if(this.#n != n)
            newN = n;

        return new ParametricCurve(this.#xF, this.#yF, this.#zF, this.#t1, this.#t2, newN);
   }
}



