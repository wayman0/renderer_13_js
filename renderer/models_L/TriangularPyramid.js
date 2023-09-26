/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Create a wireframe model of a tetrahedron as a
   triangular pyramid with an equilateral triangle
   base (centered at the origin in the xz-plane)
   whose three vertices are connected to a 4th vertex
   on the positive y-axis.

   @see Tetrahedron
*/
//@ts-check
import {Model, Vertex, LineSegment} from "../scene/SceneExport.js";
import {format} from "../scene/util/UtilExport.js";

export default class TriangularPyramid extends Model
{
   /**@type {number} */ #r;
   /**@type {number} */ #h;
   /**@type {number} */ #n;
   /**@type {number} */ #k;

   /**
      Create a tetrahedron with one face being an equilateral triangle
      inscribed in a circle of radius {@code r} centered at the origin
      of the xz-plane and with the 4th vertex on the y-axis at height
      {@code h}.
   <p>
      If {@code h = r * sqrt(2)}, then the tetrahedron is a regular tetrahedron.
      with side length {@code s = r * sqrt(3)}.
   <p>
      Another way to state this is, if an equilateral triangle is inscribed
      in a circle of radius {@code r}, then the edge length of the triangle
      is {@code r*sqrt(3)} and the height of the regular tetrahedron made
      from the triangle is {@code r*sqrt(2)}.

      @param {number} [r=(Math.sqrt(3)/Math.sqrt(2))/Math.sqrt(3)]  radius of circle in xz-plane that the equilateral base is inscribed in
      @param {number} [h=(Math.sqrt(3)/Math.sqrt(2))*(Math.sqrt(2)/Math.sqrt(3))]  coordinate on the y-axis of the apex
      @param {number} [n=1]  number of lines of latitude around the body of the pyramid
      @param {number} [k=1]  number of triangles in the triangle fan at the top of each side
   */
   constructor(r=(Math.sqrt(3)/Math.sqrt(2))/Math.sqrt(3), h=(Math.sqrt(3)/Math.sqrt(2))*(Math.sqrt(2)/Math.sqrt(3)), n=1, k=1)
   {
      super(undefined, undefined, undefined, format("Triangular_Pyramid(%.2f,%.2f,%d,%d)", r,   h,   n, k));

      if (n < 1)
         throw new Error("n must be greater than 0");
      if (k < 1)
         throw new Error("k must be greater than 0");

      this.#r = r;
      this.#h = h;
      this.#n = n;
      this.#k = k;

      // Create the pyramid's geometry.
      const apex = new Vertex(0, h, 0),
            centerVertex = new Vertex(0, 0, 0);
      
      this.addVertex(apex, centerVertex);

      const apexIndex = 0;
      const centerIndex = 1;
      let index = 2;

      // Create all the lines of "longitude" from the apex, down
      // to the base, and then to the center of the base.
      const sqrt3 = Math.sqrt(3.0);
      // Three vertices around the bottom face.
      const v0 = new Vertex( r,   0,    0);
      const v1 = new Vertex(-r/2, 0,  r*0.5*sqrt3);
      const v2 = new Vertex(-r/2, 0, -r*0.5*sqrt3);
      
      for(let j = 0; j < k; ++j)
      {
         const t = j * (1.0 / k);
         // use linear interpolation (lerp)
         this.addVertex( new Vertex(
         //         (1-t)*v0  +  t*v1
                    (1-t)*v0.x + t*v1.x,
                    (1-t)*v0.y + t*v1.y,
                    (1-t)*v0.z + t*v1.z ));
         this.addVertex( new Vertex(
         //         (1-t)*v1  +  t*v2
                    (1-t)*v1.x + t*v2.x,
                    (1-t)*v1.y + t*v2.y,
                    (1-t)*v1.z + t*v2.z ));
         this.addVertex( new Vertex(
         //         (1-t)*v2  +  t*v0
                    (1-t)*v2.x + t*v0.x,
                    (1-t)*v2.y + t*v0.y,
                    (1-t)*v2.z + t*v0.z ));

         // first side
         this.addPrimitive(LineSegment.buildVertex(apexIndex, index+0),
                           LineSegment.buildVertex(index+0, centerIndex));
         // second side
         this.addPrimitive(LineSegment.buildVertex(apexIndex, index+1),
                           LineSegment.buildVertex(index+1, centerIndex));
         // third side
         this.addPrimitive(LineSegment.buildVertex(apexIndex, index+2),
                           LineSegment.buildVertex(index+2, centerIndex));

         index += 3;
      }

      // Create all the lines of "latitude" around the pyramid, starting
      // from the base and working upwards.
      for(let i = 0; i < n; ++i)
      {
         const t = i * (1.0 / n);
         // Use linear interpolation (lerp).
         this.addVertex( new Vertex(
         //         (1-t)*v0   + t*apex
                    (1-t)*v0.x + t*apex.x,
                    (1-t)*v0.y + t*apex.y,
                    (1-t)*v0.z + t*apex.z ));
         this.addVertex( new Vertex(
         //         (1-t)*v1   + t*apex
                    (1-t)*v1.x + t*apex.x,
                    (1-t)*v1.y + t*apex.y,
                    (1-t)*v1.z + t*apex.z ));
         this.addVertex( new Vertex(
         //         (1-t)*v2   + t*apex
                    (1-t)*v2.x + t*apex.x,
                    (1-t)*v2.y + t*apex.y,
                    (1-t)*v2.z + t*apex.z ));

         this.addPrimitive(LineSegment.buildVertex(index+0, index+1),
                           LineSegment.buildVertex(index+1, index+2),
                           LineSegment.buildVertex(index+2, index+0));

         index += 3;
      }
   }
}//TriangularPyramid
