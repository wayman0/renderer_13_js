/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Create a wireframe model of a icosidodecahedron
   with its center at the origin, having edge length
   <pre>{@code
     4/(1+sqrt(5)) = 1.2361,
   }</pre>
   and with its vertices on a sphere of radius
   <pre>{@code
     4/(1+sqrt(5)) * sin(2Pi/5) = 1.1756.
   }</pre>
<p>
   See <a href="https://en.wikipedia.org/wiki/Icosidodecahedron" target="_top">
                https://en.wikipedia.org/wiki/Icosidodecahedron</a>

   @see Tetrahedron
   @see Cube
   @see Octahedron
   @see Dodecahedron
   @see Icosahedron
*/
//@ts-check 

import {Model, Vertex, LineSegment} from "../scene/SceneExport.js";
import {format} from "../scene/util/StringFormat.js";

export default class Icosidodecahedron extends Model
{
   /**
      Create a icosidodecahedron with its center at
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
      super(undefined, undefined, undefined, "Icosidodecahedron");

      // Create the icosidodecahedron's geometry.
      // It has 30 vertices and 60 edges.
      //https://en.wikipedia.org/wiki/Icosidodecahedron#Cartesian_coordinates
      //http://www.georgehart.com/virtual-polyhedra/vrml/icosidodecahedron.wrl
      const t = (1 + Math.sqrt(5))/2;  // golden ratio
      const r = t - 1; // (-1 + Math.sqrt(5))/2;
      this.addVertex(new Vertex( 0,          0,          1.051462),
                     new Vertex( r,          0,          0.8506508),
                     new Vertex( 0.2763932,  0.5527864,  0.8506508),
                     new Vertex(-r,          0,          0.8506508),
                     new Vertex(-0.2763932, -0.5527864,  0.8506508),
                     new Vertex( 1,          0,          0.3249197),
                     new Vertex( 0.7236068, -0.5527864,  0.5257311),
                     new Vertex(-0.1708204,  0.8944272,  0.5257311),
                     new Vertex( 0.4472136,  0.8944272,  0.3249197),
                     new Vertex(-1,          0,          0.3249197),
                     new Vertex(-0.7236068,  0.5527864,  0.5257311),
                     new Vertex( 0.1708204, -0.8944272,  0.5257311),
                     new Vertex(-0.4472136, -0.8944272,  0.3249197),
                     new Vertex( 1,          0,         -0.3249197),
                     new Vertex( 0.8944272,  0.5527864,  0),
                     new Vertex( 0.5527864, -0.8944272,  0),
                     new Vertex(-0.5527864,  0.8944272,  0),
                     new Vertex( 0.4472136,  0.8944272, -0.3249197),
                     new Vertex(-1,          0,         -0.3249197),
                     new Vertex(-0.8944272, -0.5527864,  0),
                     new Vertex(-0.4472136, -0.8944272, -0.3249197),
                     new Vertex( r,          0,         -0.8506508),
                     new Vertex( 0.7236068, -0.5527864, -0.5257311),
                     new Vertex( 0.1708204, -0.8944272, -0.5257311),
                     new Vertex(-0.7236068,  0.5527864, -0.5257311),
                     new Vertex(-0.1708204,  0.8944272, -0.5257311),
                     new Vertex( 0.2763932,  0.5527864, -0.8506508),
                     new Vertex(-r,          0,         -0.8506508),
                     new Vertex(-0.2763932, -0.5527864, -0.8506508),
                     new Vertex( 0,          0,         -1.051462));

      // Create 60 line segments (as 12 pentagon faces).
      this.addPrimitive(LineSegment.buildVertex( 0,  2),
                        LineSegment.buildVertex( 2,  7),
                        LineSegment.buildVertex( 7, 10),
                        LineSegment.buildVertex(10,  3),
                        LineSegment.buildVertex( 3,  0),
         
                        LineSegment.buildVertex( 0,  4),
                        LineSegment.buildVertex( 4, 11),
                        LineSegment.buildVertex(11,  6),
                        LineSegment.buildVertex( 6,  1),
                        LineSegment.buildVertex( 1,  0),
         
                        LineSegment.buildVertex( 1,  5),
                        LineSegment.buildVertex( 5, 14),
                        LineSegment.buildVertex(14,  8),
                        LineSegment.buildVertex( 8,  2),
                        LineSegment.buildVertex( 2,  1),
         
                        LineSegment.buildVertex( 3,  9),
                        LineSegment.buildVertex( 9,  19),
                        LineSegment.buildVertex(19, 12),
                        LineSegment.buildVertex(12,  4),
                        LineSegment.buildVertex( 4,  3),
         
                        LineSegment.buildVertex( 5,  6),
                        LineSegment.buildVertex( 6, 15),
                        LineSegment.buildVertex(15, 22),
                        LineSegment.buildVertex(22, 13),
                        LineSegment.buildVertex(13,  5),
         
                        LineSegment.buildVertex( 7,  8),
                        LineSegment.buildVertex( 8, 17),
                        LineSegment.buildVertex(17, 25),
                        LineSegment.buildVertex(25, 16),
                        LineSegment.buildVertex(16,  7),
         
                        LineSegment.buildVertex( 9, 10),
                        LineSegment.buildVertex(10, 16),
                        LineSegment.buildVertex(16, 24),
                        LineSegment.buildVertex(24, 18),
                        LineSegment.buildVertex(18,  9),
         
                        LineSegment.buildVertex(11, 12),
                        LineSegment.buildVertex(12, 20),
                        LineSegment.buildVertex(20, 23),
                        LineSegment.buildVertex(23, 15),
                        LineSegment.buildVertex(15, 11),
         
                        LineSegment.buildVertex(13, 21),
                        LineSegment.buildVertex(21, 26),
                        LineSegment.buildVertex(26, 17),
                        LineSegment.buildVertex(17, 14),
                        LineSegment.buildVertex(14, 13),
         
                        LineSegment.buildVertex(18, 27),
                        LineSegment.buildVertex(27, 28),
                        LineSegment.buildVertex(28, 20),
                        LineSegment.buildVertex(20, 19),
                        LineSegment.buildVertex(19, 18),
         
                        LineSegment.buildVertex(21, 22),
                        LineSegment.buildVertex(22, 23),
                        LineSegment.buildVertex(23, 28),
                        LineSegment.buildVertex(28, 29),
                        LineSegment.buildVertex(29, 21),
         
                        LineSegment.buildVertex(24, 25),
                        LineSegment.buildVertex(25, 26),
                        LineSegment.buildVertex(26, 29),
                        LineSegment.buildVertex(29, 27),
                        LineSegment.buildVertex(27, 24));
   }
}//Icosidodecahedron
