/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Create a wireframe model of a regular octahedron
   with its center at the origin, having side length
   {@code  sqrt(2) = 1.4142},with its center plane given
   by the four vertices {@code  (�1, 0, �1)}. and with
   the top and bottom vertices being {@code  (0, �1, 0)}.
<p>
   See <a href="https://en.wikipedia.org/wiki/Octahedron" target="_top">
                https://en.wikipedia.org/wiki/Octahedron</a>

   @see Tetrahedron
   @see Cube
   @see Icosahedron
   @see Dodecahedron
*/
//@ts-check 

import {Model, Vertex, LineSegment, LineLoop, LineFan} from "../scene/SceneExport.js";
import {format} from "../scene/util/UtilExport.js";

export default class Octahedron extends Model 
{
   /**@type {number} */ #n1;
   /**@type {number} */ #n2;
   /**@type {number} */ #n3;

//   /**
//      Create a regular octahedron with its center at the
//      origin, having side length {@code  sqrt(2) = 1.4142},
//      with its center plane given by the four vertices
//      {@code  (�1, 0, �1)}. and with the top and bottom
//      vertices being {@code  (0, �1, 0)}.
//   */
//   public Octahedron()
//   {
//      super("Octahedron");
//
//      this.n1 = 0;
//      this.n2 = 0;
//      this.n3 = 0;
//
//      // Create the octahedron's geometry.
//      // It has 6 vertices and 12 edges.
//      this.addVertex(new Vertex( 1,  0,  0),  // 4 vertices around the center plane
//                new Vertex( 0,  0, -1),
//                new Vertex(-1,  0,  0),
//                new Vertex( 0,  0,  1),
//                new Vertex( 0,  1,  0),  // vertex at the top
//                new Vertex( 0, -1,  0)); // vertex at the bottom
///*
//      // These vertices create an Octahedron with side length 1.
//      final double sqrt3 = Math.sqrt(3.0);
//      final double sqrt2 = Math.sqrt(2.0);
//      this.addVertex(new Vertex( 0.5, 0,  0.5), // 4 vertices around the center plane
//                new Vertex(-0.5, 0,  0.5),
//                new Vertex(-0.5, 0, -0.5),
//                new Vertex( 0.5, 0, -0.5),
//                new Vertex( 0,  1/sqrt2, 0),  // vertex at the top
//                new Vertex( 0, -1/sqrt2, 0)); // vertex at the bottom
//*/
//      // Create 12 line segments.
//      // Four line segments around the center plane.
//      this.addPrimitive(LineSegment.buildVertex(0, 1),
//                   LineSegment.buildVertex(1, 2),
//                   LineSegment.buildVertex(2, 3),
//                   LineSegment.buildVertex(3, 0));
//      // Edges going to the top vertex.
//      this.addPrimitive(LineSegment.buildVertex(0, 4),
//                   LineSegment.buildVertex(1, 4),
//                   LineSegment.buildVertex(2, 4),
//                   LineSegment.buildVertex(3, 4));
//      // Edges going to the bottom vertex.
//      this.addPrimitive(LineSegment.buildVertex(0, 5),
//                   LineSegment.buildVertex(1, 5),
//                   LineSegment.buildVertex(2, 5),
//                   LineSegment.buildVertex(3, 5));
//   }
//
//
//   /**
//      Create a regular octahedron with its center at the
//      origin, having side length {@code  sqrt(2) = 1.4142},
//      with its center plane given by the four vertices
//      {@code  (�1, 0, �1)}. and with the top and bottom
//      vertices being {@code  (0, �1, 0)}.
//      <p>
//      this.add line segments fanning out from the top and bottom
//      vertices to the sides around the center plane.
//
//      @param n number of lines fanning out from the top and bottom on each side of the octahedron
//      @throws IllegalArgumentException if {@code n1} is less than 0
//      @throws IllegalArgumentException if {@code n2} is less than 0
//   */
//   public Octahedron(final let n)
//   {
//      this(n, 0, 0);
//   }
//
//
//   /**
//      Create a regular octahedron with its center at the
//      origin, having side length {@code  sqrt(2) = 1.4142},
//      with its center plane given by the four vertices
//      {@code  (�1, 0, �1)}. and with the top and bottom
//      vertices being {@code  (0, �1, 0)}.
//      <p>
//      this.add line segments fanning out from each vertex to
//      its opposite sides.
//
//      @param n1 number of lines fanning out from the top and bottom on each side of the octahedron
//      @param n2 number of lines fanning out from v0 and v2 on each side of the octahedron
//      @param n3 number of lines fanning out from v1 and v3 on each side of the octahedron
//      @throws IllegalArgumentException if {@code n1} is less than 0
//      @throws IllegalArgumentException if {@code n2} is less than 0
//      @throws IllegalArgumentException if {@code n3} is less than 0
//   */
//   public Octahedron(final let n1, final let n2, final let n3)
//   {
//      this(n1, n1, n2, n2, n3, n3);
//   }
//

   /**
      Create a regular octahedron with its center at the
      origin, having side length {@code  sqrt(2) = 1.4142},
      with its center plane given by the four vertices
      {@code  (�1, 0, �1)}. and with the top and bottom
      vertices being {@code  (0, �1, 0)}.
      <p>
      this.add line segments fanning out from each vertex to
      its opposite sides.

      @param {number} [n1a=0] number of lines fanning out from the top on each side of the octahedron
      @param {number} [n1b=n1a] number of lines fanning out from the bottom on each side of the octahedron
      @param {number} [n2a=0] number of lines fanning out from v0 on each side of the octahedron
      @param {number} [n2b=0] number of lines fanning out from v1 on each side of the octahedron
      @param {number} [n3a=0] number of lines fanning out from v2 on each side of the octahedron
      @param {number} [n3b=0] number of lines fanning out from v3 on each side of the octahedron
   */
   constructor(n1a = 0, n1b=n1a, n2a=0, n2b=0, n3a=0, n3b=0)
   {
      super(undefined, undefined, undefined, undefined, undefined,  format("Octahedron(%d,%d,%d,%d,%d,%d)",n1a,n1b,n2a,n2b,n3a,n3b));

      if (n1a < 0)
         throw new Error("n1 must be greater than or equal to 0");
      if (n1b < 0)
         throw new Error("n1 must be greater than or equal to 0");
      if (n2a < 0)
         throw new Error("n2 must be greater than or equal to 0");
      if (n2b < 0)
         throw new Error("n2 must be greater than or equal to 0");
      if (n3a < 0)
         throw new Error("n3 must be greater than or equal to 0");
      if (n3b < 0)
         throw new Error("n3 must be greater than or equal to 0");

      this.#n1 = n1a;
      this.#n2 = n2a;
      this.#n3 = n3a;

      // Create the octahedron's geometry.
      // It has 6 vertices and 12 edges.
      const v0 = new Vertex( 1,  0,  0); // 4 vertices around the center plane
      const v1 = new Vertex( 0,  0, -1);
      const v2 = new Vertex(-1,  0,  0);
      const v3 = new Vertex( 0,  0,  1);
      const v4 = new Vertex( 0,  1,  0); // vertex at the top
      const v5 = new Vertex( 0, -1,  0); // vertex at the bottom
      
      this.addVertex(v0, v1, v2, v3, v4, v5);
/*
      // These vertices create an Octahedron with side length 1.
      final double sqrt3 = Math.sqrt(3.0);
      final double sqrt2 = Math.sqrt(2.0);
      final Vertex v0 = new Vertex( 0.5, 0,  0.5); // 4 vertices around the center plane
      final Vertex v1 = new Vertex(-0.5, 0,  0.5);
      final Vertex v2 = new Vertex(-0.5, 0, -0.5);
      final Vertex v3 = new Vertex( 0.5, 0, -0.5);
      final Vertex v4 = new Vertex( 0,  1/sqrt2, 0); // vertex at the top
      final Vertex v5 = new Vertex( 0, -1/sqrt2, 0); // vertex at the bottom
      this.addVertex(v0, v1, v2, v3, v4, v5);
*/
      // Create 12 line segments.
      // four line segments around the center plane
      this.addPrimitive(new LineLoop(0, 1, 2, 3), 
                        new LineFan(4, 0, 1, 2, 3), 
                        new LineFan(5, 0, 1, 2, 3));
      
      this.#fan(n1a, 4, v0, v1, v2, v3); // fan out from v4 (top)
      this.#fan(n1b, 5, v0, v1, v2, v3); // fan out from v5 (bottom)
      this.#fan(n2a, 0, v3, v4, v1, v5); // fan out from v0
      this.#fan(n3a, 1, v0, v4, v2, v5); // fan out from v1
      this.#fan(n2b, 2, v1, v4, v3, v5); // fan out from v2
      this.#fan(n3b, 3, v2, v4, v0, v5); // fan out from v3
   }


   /**
      Create {@code n} line segments fanning out from {@link Vertex}
      {@code v0} towards the four edges spanned by the other four
      vertices.

      @param {number} n   number of lines fanning out from {@link Vertex} {@code v0}
      @param {number} v0  index in the {@link Vertex} list of the vertex to fan out from
      @param {Vertex} v1  a {@link Vertex} opposite to {@code v0}
      @param {Vertex} v2  a {@link Vertex} opposite to {@code v0}
      @param {Vertex} v3  a {@link Vertex} opposite to {@code v0}
      @param {Vertex} v4  a {@link Vertex} opposite to {@code v0}
   */
   #fan(n, v0, v1, v2, v3, v4)
   {
      const lineFan1 = new LineFan();
      lineFan1.addIndex(v0);

      for (let i = 0; i < n; ++i)
      {
         // Use linear interpolation (lerp).
         const t = (i+1) / (n+1);
         const x = (1-t) * v1.x + t * v2.x;
         const y = (1-t) * v1.y + t * v2.y;
         const z = (1-t) * v1.z + t * v2.z;
         const v = new Vertex(x, y, z);
         const index = this.vertexList.length;

         this.addVertex(v);
         lineFan1.addIndex(index);
      }
      this.addPrimitive(lineFan1);

      const lineFan2 = new LineFan();
      lineFan2.addIndex(v0);
      for (let i = 0; i < n; ++i)
      {
         // Use linear interpolation (lerp).
         const t = (i+1) / (n+1);
         const x = (1-t) * v2.x + t * v3.x;
         const y = (1-t) * v2.y + t * v3.y;
         const z = (1-t) * v2.z + t * v3.z;
         const v = new Vertex(x, y, z);
         const index = this.vertexList.length;

         this.addVertex(v);
         lineFan2.addIndex(index);
      }
      this.addPrimitive(lineFan2);

      const lineFan3 = new LineFan();
      lineFan3.addIndex(v0);
      for (let i = 0; i < n; ++i)
      {
         // Use linear interpolation (lerp).
         const t = (i+1) / (n+1);
         const x = (1-t) * v3.x + t * v4.x;
         const y = (1-t) * v3.y + t * v4.y;
         const z = (1-t) * v3.z + t * v4.z;
         const v = new Vertex(x, y, z);
         const index = this.vertexList.length;

         this.addVertex(v);
         lineFan3.addIndex(index);
      }
      this.addPrimitive(lineFan3);

      const lineFan4 = new LineFan();
      lineFan4.addIndex(v0);
      for (let i = 0; i < n; ++i)
      {
         // Use linear interpolation (lerp).
         const t = (i+1) / (n+1);
         const x = (1-t) * v4.x + t * v1.x;
         const y = (1-t) * v4.y + t * v1.y;
         const z = (1-t) * v4.z + t * v1.z;
         const v = new Vertex(x, y, z);
         const index = this.vertexList.length;

         this.addVertex(v);
         lineFan4.addIndex(index);
      }
      this.addPrimitive(lineFan4);
   }

   
   getHorizCount()
   {
      return this.#n1;
   }

   getVertCount()
   {
      return this.#n2;
   }

   /**
    * Build a new Model using the same parameters but the given line counts
    * @param {number} n the new horizontal line count
    * @param {number} k the new vertical line count
    * @returns {Octahedron} the new model with the same parameters but different line counts
    */
   remake(n, k)
   {
      return new Octahedron(n, n, k, k, this.#n3, this.#n3);
   }
}//Octahedron
