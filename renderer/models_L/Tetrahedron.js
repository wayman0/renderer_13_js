/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Create a wireframe model of a regular tetrahedron
   with its center at the origin, having edge length
   {@code 2*sqrt(2)}, and with its vertices at corners
   of the cube with vertices {@code (�1, �1, �1)}.
<p>
   See <a href="https://en.wikipedia.org/wiki/Tetrahedron" target="_top">
                https://en.wikipedia.org/wiki/Tetrahedron</a>

   @see Cube
   @see Octahedron
   @see Icosahedron
   @see Dodecahedron
*/
//@ts-check 

import {Model, Vertex, LineSegment} from "../scene/SceneExport.js";
import {format} from "../scene/util/UtilExport.js";

export default class Tetrahedron extends Model 
{
   /**@type {number} */ #n1;
   /**@type {number} */ #n2;
   /**@type {boolean}*/ #useTwoParameterConstructor;

   /**
      Create a regular tetrahedron with its center at
      the origin, having edge length {@code 2*sqrt(2)},
      and with its vertices at corners of the cube with
      vertices {@code (�1, �1, �1)}.
   */
   // public Tetrahedron()
   // {
   //    this(false);
   // }


   /**
      Create a regular tetrahedron or its dual tetrahedron
      (the dual of a tetrahedron is another tetrahedron).
   <p>
      <a href="https://en.wikipedia.org/wiki/Tetrahedron#Regular_tetrahedron" target="_top">
               https://en.wikipedia.org/wiki/Tetrahedron#Regular_tetrahedron</a>
   <p>
      The combination of these two dual tetrahedrons is a stellated octahedron.
   <p>
      <a href="https://en.wikipedia.org/wiki/Stellated_octahedron" target="_top">
               https://en.wikipedia.org/wiki/Stellated_octahedron</a>

      @param dual  choose between the two dual tetrahedrons
   */
   // public Tetrahedron(final boolean dual)
   // {
   //    super("Tetrahedron");
   // 
   //    this.n1 = 0;
   //    this.n2 = 0;
   //    useTwoParameterConstructor = true;
   // 
   //    // Create the tetrahedron's geometry.
   //    // It has 4 vertices and 6 edges.
   //    if (! dual)
   //    {
   //       this.addVertex(new Vertex( 1,  1,  1),
   //                 new Vertex(-1,  1, -1),
   //                 new Vertex( 1, -1, -1),
   //                 new Vertex(-1, -1,  1));
   //    }
   //    else // Create the dual tetrahedron by
   //    {    // inverting the coordinates given above.
   //       this.addVertex(new Vertex(-1, -1, -1),
   //                 new Vertex( 1, -1,  1),
   //                 new Vertex(-1,  1,  1),
   //                 new Vertex( 1,  1, -1));
   //    }
   // 
   //    this.addPrimitive(LineSegment.buildVertex(0, 1),  //top (bottom) edge
   //                 LineSegment.buildVertex(2, 3),  //bottom (top) edge
   //                 LineSegment.buildVertex(0, 2),
   //                 LineSegment.buildVertex(0, 3),
   //                 LineSegment.buildVertex(1, 2),
   //                 LineSegment.buildVertex(1, 3));
   // }


   /**
      Create a regular tetrahedron with its center at
      the origin, having edge length {@code 2*sqrt(2)},
      and with its vertices at corners of the cube with
      vertices {@code (�1, �1, �1)}.
      <p>
      this.add line segments fanning out from each vertex to
      its opposite edge.

      @param n1 number of lines fanning out from v0 and v1 towards the edge (v2, v3)
      @param n2 number of lines fanning out from v2 and v3 towards the edge (v0, v1)
      @throws IllegalArgumentException if {@code n1} is less than 0
      @throws IllegalArgumentException if {@code n2} is less than 0
   */
   // public Tetrahedron(final let n1, final let n2)
   // {
   //    super(String.format("Tetrahedron(%d,%d)", n1, n2));

   //    if (n1 < 0)
   //       throw new IllegalArgumentException("n1 must be greater than or equal to 0");
   //    if (n2 < 0)
   //       throw new IllegalArgumentException("n2 must be greater than or equal to 0");

   //    this.n1 = n1;
   //    this.n2 = n2;
   //    useTwoParameterConstructor = true;

   //    // Create the tetrahedron's geometry.
   //    // It has 4 vertices and 6 edges.
   //    final Vertex v0 = new Vertex( 1,  1,  1),
   //                 v1 = new Vertex(-1,  1, -1),
   //                 v2 = new Vertex( 1, -1, -1),
   //                 v3 = new Vertex(-1, -1,  1);

   //    this.addVertex(v0, v1, v2, v3);

   //    this.addPrimitive(LineSegment.buildVertex(0, 1),  //top (bottom) edge
   //                 LineSegment.buildVertex(2, 3),  //bottom (top) edge
   //                 LineSegment.buildVertex(0, 2),
   //                 LineSegment.buildVertex(0, 3),
   //                 LineSegment.buildVertex(1, 2),
   //                 LineSegment.buildVertex(1, 3));

   //    fan(n1, 0, v2, v3); // fan out from v0
   //    fan(n1, 1, v2, v3); // fan out from v1
   //    fan(n2, 2, v0, v1); // fan out from v2
   //    fan(n2, 3, v0, v1); // fan out from v3
   // }


   /**
      Create a regular tetrahedron with its center at
      the origin, having edge length {@code 2*sqrt(2)},
      and with its vertices at corners of the cube with
      vertices {@code (�1, �1, �1)}.
      <p>
      this.add line segments fanning out from each vertex onto
      its three adjacent sides.

      @param {number} [m0=1] number of lines fanning out from v0 onto each adjacent side of the tetrahedron
      @param {number} [m1=1] number of lines fanning out from v1 onto each adjacent side of the tetrahedron
      @param {number} [m2=1] number of lines fanning out from v2 onto each adjacent side of the tetrahedron
      @param {number} [m3=1] number of lines fanning out from v3 onto each adjacent side of the tetrahedron
   */
   constructor(m0=1, m1=1, m2=1, m3=1)
   {
      super(undefined, undefined, undefined, undefined, undefined,  format("Tetrahedron(%d,%d,%d,%d)", m0, m1, m2, m3));

      if (m0 < 0)
         throw new Error("m0 must be greater than or equal to 0");
      if (m1 < 0)
         throw new Error("m1 must be greater than or equal to 0");
      if (m2 < 0)
         throw new Error("m2 must be greater than or equal to 0");
      if (m3 < 0)
         throw new Error("m3 must be greater than or equal to 0");

      this.#n1 = m0;
      this.#n2 = m1;
      this.#useTwoParameterConstructor = false;

      // Create the tetrahedron's geometry.
      // It has 4 vertices and 6 edges.
      const v0 = new Vertex( 1,  1,  1);
      const v1 = new Vertex(-1,  1, -1);
      const v2 = new Vertex( 1, -1, -1);
      const v3 = new Vertex(-1, -1,  1);

      this.addVertex(v0, v1, v2, v3);

      this.addPrimitive(LineSegment.buildVertex(0, 1),  //top (bottom) edge
                        LineSegment.buildVertex(2, 3),  //bottom (top) edge
                        LineSegment.buildVertex(0, 2),
                        LineSegment.buildVertex(0, 3),
                        LineSegment.buildVertex(1, 2),
                        LineSegment.buildVertex(1, 3));

      this.#fan1(m0, 0, v1, v2, v3); // fan out from v0
      this.#fan1(m1, 1, v0, v2, v3); // fan out from v1
      this.#fan1(m2, 2, v0, v1, v3); // fan out from v2
      this.#fan1(m3, 3, v0, v1, v2); // fan out from v3
   }


   /**
      Create {@code n} line segments fanning out from {@link Vertex}
      {@code v0} towards the three edges spanned by the other three
      vertices.

      @param {number} n   number of lines fanning out from {@link Vertex} {@code v0}
      @param {number} v0  index in the {@link Vertex} list of the vertex to fan out from
      @param {Vertex} v1  a {@link Vertex} opposite to {@code v0}
      @param {Vertex} v2  a {@link Vertex} opposite to {@code v0}
      @param {Vertex} v3  a {@link Vertex} opposite to {@code v0}
   */
   #fan1(n, v0, v1, v2, v3)
   {
      this.#fan(n, v0, v1, v2);
      this.#fan(n, v0, v2, v3);
      this.#fan(n, v0, v3, v1);
   }

   /**
      Create {@code n} line segments fanning out from {@link Vertex}
      {@code v0} towards the edge spanned by the other two vertices.

      @param {number} n   number of lines fanning out from {@link Vertex} {@code v0}
      @param {number} v0  index in the {@link Vertex} list of the vertex to fan out from
      @param {Vertex} v1  a {@link Vertex} opposite to {@code v0}
      @param {Vertex} v2  a {@link Vertex} opposite to {@code v0}
   */
   #fan(n, v0, v1, v2)
   {
      for (let i = 0; i < n; ++i)
      {
         // Use linear leterpolation (lerp).
         const t = (i+1) / (n+1);
         const x = (1-t) * v1.x + t * v2.x;
         const y = (1-t) * v1.y + t * v2.y;
         const z = (1-t) * v1.z + t * v2.z;
         const v = new Vertex(x, y, z);
         const index = this.vertexList.length;

         this.addVertex(v);
         this.addPrimitive(LineSegment.buildVertex(v0, index));
      }
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
    * @returns {Tetrahedron} the new model with the same parameters but different line counts
    */
   remake(n, k)
   {
      return new Tetrahedron(n, k, k, n);
   }
}//Tetrahedron
