/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Create a wireframe model of a regular icosahedron
   with its center at the origin, having edge length
   <pre>{@code
     4/(1+sqrt(5)) = 1.2361,
   }</pre>
   and with its vertices on a sphere of radius
   <pre>{@code
     4/(1+sqrt(5)) * sin(2Pi/5) = 1.1756.
   }</pre>
<p>
   See <a href="https://en.wikipedia.org/wiki/Regular_icosahedron" target="_top">
                https://en.wikipedia.org/wiki/Regular_icosahedron</a>

   @see Tetrahedron
   @see Cube
   @see Octahedron
   @see Dodecahedron
   @see Icosidodecahedron
*/
//@ts-check

import {Model, Vertex, LineSegment, LineFan, LineLoop, Points, Lines} from "../scene/SceneExport.js";
import {format} from "../scene/util/UtilExport.js";

export default class Icosahedron extends Model
{
   /**
      Create a regular icosahedron with its center at
      the origin, having edge length
      <pre>{@code
        4/(1+sqrt(5)) = 1.2361,
      }</pre>
      and with its vertices on a sphere of radius
      <pre>{@code
        4/(1+sqrt(5)) * sin(2Pi/5) = 1.1756.
      }</pre>
   */
   constructor()
   {
      super(undefined, undefined, undefined, undefined, undefined,  "Icosahedron");

      // Create the icosahedron's geometry.
      // It has 12 vertices and 30 edges.
      const t = (1 + Math.sqrt(5))/2;  // golden ratio
      const r = 1/t;
      //https://en.wikipedia.org/wiki/Regular_icosahedron#Cartesian_coordinates
      // All cyclic permutations of (0, �r, �1).
      this.addVertex(new Vertex(-r,  1,  0),
                     new Vertex( r,  1,  0),
                     new Vertex(-r, -1,  0),
                     new Vertex( r, -1,  0),
                     new Vertex( 0, -r,  1),
                     new Vertex( 0,  r,  1),
                     new Vertex( 0, -r, -1),
                     new Vertex( 0,  r, -1),
                     new Vertex( 1,  0, -r),
                     new Vertex( 1,  0,  r),
                     new Vertex(-1,  0, -r),
                     new Vertex(-1,  0,  r));
/*
      // These vertices create a icosahedron with edge length 2,
      // and vertices on a sphere of radius
      //    sqrt(10+2sqrt(5))/2 = 2sin(2Pi/5) = 1.90211.
      //https://en.wikipedia.org/wiki/Regular_icosahedron#Cartesian_coordinates
      // and also
      //https://github.com/mrdoob/three.js/blob/master/src/geometries/IcosahedronGeometry.js
      // All cyclic permutations of (0, �1, �t).
      this.addVertex(new Vertex(-1,  t,  0),
                new Vertex( 1,  t,  0),
                new Vertex(-1, -t,  0),
                new Vertex( 1, -t,  0),
                new Vertex( 0, -1,  t),
                new Vertex( 0,  1,  t),
                new Vertex( 0, -1, -t),
                new Vertex( 0,  1, -t),
                new Vertex( t,  0, -1),
                new Vertex( t,  0,  1),
                new Vertex(-t,  0, -1),
                new Vertex(-t,  0,  1));
*/
      // Create 30 line segments.
      // To figure out the edges, look at the orthogonal projection in the z-direction.
      // https://en.wikipedia.org/wiki/Regular_icosahedron#Orthogonal_projections

      // The edge from v00 to v01 is the top horizontal edge.
      // The edge from v02 to v03 is the bottom horizontal edge.
      // The edge from v04 to v05 is the front vertical edge.
      // The edge from v06 to v07 is the back vertical edge.
      // The edge from v08 to v09 is the right horizontal edge.
      // The edge from v10 to v11 is the left horizontal edge.

      // Working, more or less, from the top down.
      this.addPrimitive(new LineFan(0, 1, 7, 10, 11, 5), 
                        new LineLoop(1, 7, 10, 11, 5), 
                        new Lines(1, 8, 8, 7, 7, 6, 6, 10, 10, 2, 2, 11, 11, 4, 4, 5, 5, 9, 9, 1), 
                        new LineLoop(8, 6, 2, 4, 9), 
                        new LineFan(3, 8, 6, 2, 4, 9));

      const pts1 = Points.buildIndices(0, 3);
      const pts2 = Points.buildIndices(1, 7, 10, 11, 5);
      const pts3 = Points.buildIndices(8, 6, 2, 4, 9);

      pts1.radius = 10;
      pts2.radius = 5;
      pts3.radius = 5;

      this.addPrimitive(pts1, pts2, pts3);
   }
}//Icosahedron
