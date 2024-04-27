/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Create a wireframe model of a sphere centered at the origin
   by recursively subdividing the faces of a tetrahedron.
<p>
   Also use this subdivision process to draw Sierpinski triangles
   on the surface of the sphere.
*/
//@ts-check 

import {Model, Vertex, LineSegment, LineStrip} from "../scene/SceneExport.js";
import {format} from "../scene/util/UtilExport.js";

export default class SphereSubdivided extends Model
{
   /**
      Create a sphere centered at the origin by recursively
      subdividing the faces of a tetrahedron {@code n} times.
   <p>
      The {@code hole} parameter leaves out one of the original
      four triangle faces of the tetrahedron. This creates a hole
      in the final sphere that is useful for looking at the back
      side of the sphere.
   <p>
      The {@code sierpinski} parameter creates Sierpinski triangles
      on the sphere.

      @param {number} [n=4]           number of recursive subdivisions
      @param {boolean} [hole=false]        do not render one of the four triangles of the tetrahedron
      @param {boolean} [sierpinski=false]  create Sierpinski triangles
   */
   constructor(n=4, hole=false, sierpinski=false)
   {
      super(undefined, undefined, undefined, undefined, undefined,  format("Sphere Subdivided(%d)", n));

      if (n < 0)
         throw new Error("n must be greater than or equal to 0");

      // Start with the tetrahedron's geometry.
      const sqr3inv = 1.0/Math.sqrt(3);
      const v0 = new Vertex( sqr3inv,  sqr3inv,  sqr3inv),
            v1 = new Vertex(-sqr3inv,  sqr3inv, -sqr3inv),
            v2 = new Vertex( sqr3inv, -sqr3inv, -sqr3inv),
            v3 = new Vertex(-sqr3inv, -sqr3inv,  sqr3inv);

      // Subdivide each of the tetrahedron's four triangles.
      this.#sub(n, v0, v1, v2, sierpinski);
      this.#sub(n, v1, v3, v2, sierpinski);
      this.#sub(n, v2, v3, v0, sierpinski);
      
      if (! hole) 
         this.#sub(n, v3, v1, v0, sierpinski);
   }

   /**
      Recursive helper function.

      @param {number} n           number of recursive subdivisions
      @param {Vertex} v0          vertex of a triangle on the sphere
      @param {Vertex} v1          vertex of a triangle on the sphere
      @param {Vertex} v2          vertex of a triangle on the sphere
      @param {boolean} sierpinski  create Sierpinski triangles
   */
   #sub(n, v0, v1, v2, sierpinski)
   {
      if(!(n >= 0))
         throw new Error();

      if (0 == n)
      {
         const index = this.vertexList.length;
         this.addVertex(v0, v1, v2);
         this.addPrimitive(new LineStrip(index+0, index+1, index+2, index+0);
      }
      else
      {
         // Subdivide each of the three edges.
         const v3 = new Vertex(0.5*(v0.x + v1.x),
                              0.5*(v0.y + v1.y),
                              0.5*(v0.z + v1.z));
         const v4 = new Vertex(0.5*(v1.x + v2.x),
                              0.5*(v1.y + v2.y),
                              0.5*(v1.z + v2.z));
         const v5 = new Vertex(0.5*(v2.x + v0.x),
                               0.5*(v2.y + v0.y),
                               0.5*(v2.z + v0.z));

         // Normalize the subdivision points.
         const L3 = Math.sqrt(v3.x * v3.x + v3.y * v3.y + v3.z * v3.z);
         const L4 = Math.sqrt(v4.x * v4.x + v4.y * v4.y + v4.z * v4.z);
         const L5 = Math.sqrt(v5.x * v5.x + v5.y * v5.y + v5.z * v5.z);

         const v3n = new Vertex(v3.x / L3, v3.y / L3, v3.z / L3);
         const v4n = new Vertex(v4.x / L4, v4.y / L4, v4.z / L4);
         const v5n = new Vertex(v5.x / L5, v5.y / L5, v5.z / L5);

         // Recursively do another subdivision.
         this.#sub(n-1, v0,  v3n, v5n, sierpinski);
         this.#sub(n-1, v5n, v4n, v2,  sierpinski);
         this.#sub(n-1, v3n, v1,  v4n, sierpinski);

         if (! sierpinski) 
            this.#sub(n-1, v3n, v4n, v5n, sierpinski);
      }
   }
}//SphereSubdivided
