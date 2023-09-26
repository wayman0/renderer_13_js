/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//https://docs.oracle.com/javase/8/docs/api/java/util/function/package-summary.html

/**
   Create a wireframe model of a surface of revolution around the y-axis.
<p>
   See <a href="https://en.wikipedia.org/wiki/Surface_of_revolution#Rotating_a_function" target="_top">
                https://en.wikipedia.org/wiki/Surface_of_revolution#Rotating_a_function</a>

   @see ParametricSurface
*/
//@ts-check
import {ParametricSurface} from "./ModelsExport.js";
import {format} from "../scene/util/UtilExport.js";

export default class SurfaceOfRevolution extends ParametricSurface
{
   /**@type {Function} the first component of the parametric curve  */ static x(y, t) {return (0.5 * (1 + Math.cos(Math.PI * y))) * Math.cos(t);}
   /**@type {Function} the second component of the parametric curve */ static y(y, t) {return (0.5 * (1 + Math.cos(Math.PI * y))) * Math.sin(t);}
   /**@type {Function} the second component of the parametric curve */ static z(y, t) {return 0.5 * (1 + Math.cos(Math.PI * y));}

   /**
      Create a surface of revolution around the y-axis
      of the given radial parametric curve and the given
      angular range for the sector of revolution.
 
      @param {Function} [xFunc = SurfaceOfRevolution.x] first component function of the parametric curve
      @param {Function} [yFunc = SurfaceOfRevolution.y] second component function of the parametric curve
      @param {Function} [zFunc = SurfaceOfRevolution.z] third compononet function of the parametric curve
      @param {number}   [s1 =-1]  beginning parameter value
      @param {number}   [s2 =1]  ending parameter value
      @param {number}   [theta1=0]  beginning value of angular parameter range
      @param {number}   [theta2=2*Math.PI]  ending value of angular parameter range
      @param {number}   [n =49]  number of circles of latitude
      @param {number}   [k =49]  number of lines of longitude
   */
   constructor(xFunc=SurfaceOfRevolution.x, yFunc=SurfaceOfRevolution.y, zFunc = SurfaceOfRevolution.z, 
                s1=-1, s2=1, theta1=0, theta2=2*Math.PI, n=49, k=49)
   {
      super( xFunc, yFunc, zFunc, s1, s2, theta1, theta2, n, k);
      this.name = format("SurfaceOfRevolution(%d,%d)", n, k);
   }
}//Surface of Revolution
