/**
 * Renderer Models. The MIT Licens.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
 */

import {Model, Vertex} from "../scene/SceneExport.js";
import { LineFan, LineLoop } from "../scene/primitives/PrimitiveExport";
import { format } from "../scene/util/StringFormat.js";

/**
   Create a wireframe model of a barycentricly subdivided
   equilateral triangle.

   See <a href="https://en.wikipedia.org/wiki/Barycentric_subdivision" target="_top">
                https://en.wikipedia.org/wiki/Barycentric_subdivision</a>
*/
export default class BarycentricTriangle extends Model
{
    /**@type {number} */ #theta;
    /**@type {number} */ #n;

    /**
      Create a barycentricly subdivided equilateral triangle
      in the xy-plane with corners on the unit circle and
      rotated by angle {@code theta} degrees.
      <p>
      The value of {@code n} should be less than 8.

      @param {number} theta  rotation (in degrees) of the equilateral triangle
      @param {number} n      number of barycentric subdivisions of this triangle
      @throws IllegalArgumentException if {@code n} is less than 0
   */
    constructor(theta = 0, n = 8)
    {
        super(undefined, undefined, undefined, undefined, undefined, 
                format("Barycentric Triangle(%0.2f, %2d)", theta, n));

        if(n < 0)
            throw new Error("N must be greater than 0");

        this.#theta = theta;
        this.#n = n;

        const theta1 = theta * Math.PI/180;
        const theta2 = 2*Math.PI/3;

        this.addVertex( new Vertex( Math.cos(theta1), 
                                    Math.sin(theta1), 0.0), 

                        new Vertex( Math.cos(theta1 + theta2), 
                                    Math.sin(theta1 + theta2), 0), 

                        new Vertex( Math.cos(theta1 + 2*theta2), 
                                    Math.sin(theta1 + 2*theta2), 0));

        this.addPrimitive(new LineLoop(0, 1, 2));

        if(n>0)
            this.#barycentric(0, 1, 2, n);
    }
   
    #barycentric(vIndex0, vIndex1, vIndex2, n)
    {
        const v0 = this.vertexList[vIndex0], 
              v1 = this.vertexList[vIndex1],
              v2 = this.vertexList[vIndex2];
        const index = this.vertexList.length;
        
        if (n > 0)
        {
            // Barycentric subdivision.
            // https://en.wikipedia.org/wiki/Barycentric_subdivision

            // Add four vertices to the model.
            this.addVertex(new Vertex(
            //         (1/3)*v0 + (1/3)*v1 + (1/3)*v2
                        (v0.x + v1.x + v2.x)/3.0,
                        (v0.y + v1.y + v2.y)/3.0,
                        (v0.z + v1.z + v2.z)/3.0));
            this.addVertex(new Vertex(
            //         (1/2)*v0 + (1/2)*v1
                       (v0.x + v1.x)/2.0,
                       (v0.y + v1.y)/2.0,
                       (v0.z + v1.z)/2.0));
            this.addVertex(new Vertex(
            //         (1/2)*v1 + (1/2)*v2
                       (v1.x + v2.x)/2.0,
                       (v1.y + v2.y)/2.0,
                       (v1.z + v2.z)/2.0));
            this.addVertex(new Vertex(
            //         (1/2)*v2 + (1/2)*v0
                       (v2.x + v0.x)/2.0,
                       (v2.y + v0.y)/2.0,
                       (v2.z + v0.z)/2.0));
            // Give a name to the index of each of the four new vertices.
            const vIndexCenter = index,
                  vIndex01     = index + 1,
                  vIndex12     = index + 2,
                  vIndex20     = index + 3;
            // 6 new line segments
            this.addPrimitive(new LineFan(vIndexCenter,
                                     vIndex0,
                                     vIndex1,
                                     vIndex2,
                                     vIndex01,
                                     vIndex12,
                                     vIndex20));

            this.#barycentric(vIndex0, vIndex01, vIndexCenter, n-1);
            this.#barycentric(vIndex0, vIndex20, vIndexCenter, n-1);
            this.#barycentric(vIndex1, vIndex01, vIndexCenter, n-1);
            this.#barycentric(vIndex1, vIndex12, vIndexCenter, n-1);
            this.#barycentric(vIndex2, vIndex12, vIndexCenter, n-1);
            this.#barycentric(vIndex2, vIndex20, vIndexCenter, n-1);
        }
    }
}