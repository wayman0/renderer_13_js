/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Create a wireframe model of a regular dodecahedron
   with its center at the origin, having edge length
   <pre>{@code
     2*(sqrt(5)-1)/(1+sqrt(5)) = (1/2)*(sqrt(5)-1)^2 = 0.7639,
   }</pre>
   and with its vertices on a sphere of radius
   <pre>{@code
     2*sqrt(3)/(1+sqrt(5)) = 1.0705.
   }</pre>
<p>
   See <a href="https://en.wikipedia.org/wiki/Regular_dodecahedron" target="_top">
                https://en.wikipedia.org/wiki/Regular_dodecahedron</a>

   @see Tetrahedron
   @see Cube
   @see Octahedron
   @see Icosahedron
   @see Icosidodecahedron
*/
//@ts-check

import {Model, Vertex, LineSegment, LineLoop, LineFan, Lines} from "../scene/SceneExport.js";
import {format} from "../scene/util/UtilExport.js";

export default class Dodecahedron extends Model
{
   /**
      Create a regular dodecahedron with its center at
      the origin, having edge length
      <pre>{@code
        2*(sqrt(5)-1)/(1+sqrt(5)) = (1/2)*(sqrt(5)-1)^2 = 0.7639,
      }</pre>
      and with its vertices on a sphere of radius
      <pre>{@code
        2*sqrt(3)/(1+sqrt(5)) = 1.0705.
     }</pre>
   */
   constructor()
   {
      super(undefined, undefined, undefined, undefined, undefined,  "Dodecahedron");

      // Create the dodecahedron's geometry.
      // It has 20 vertices and 30 edges.
      const t = (1 + Math.sqrt(5))/2,   // golden ratio
            r = 1/t,
            r2 = r * r;
      //https://en.wikipedia.org/wiki/Regular_dodecahedron#Cartesian_coordinates
      // (�r, �r, �r)
      this.addVertex(new Vertex(-r, -r, -r),
                     new Vertex(-r, -r,  r),
                     new Vertex(-r,  r, -r),
                     new Vertex(-r,  r,  r),
                     new Vertex( r, -r, -r),
                     new Vertex( r, -r,  r),
                     new Vertex( r,  r, -r),
                     new Vertex( r,  r,  r));

      // (0, �r2, �1)
      this.addVertex(new Vertex( 0, -r2, -1),
                     new Vertex( 0, -r2,  1),
                     new Vertex( 0,  r2, -1),
                     new Vertex( 0,  r2,  1));

      // (�r2, �1, 0)
      this.addVertex(new Vertex(-r2, -1,  0),
                     new Vertex(-r2,  1,  0),
                     new Vertex( r2, -1,  0),
                     new Vertex( r2,  1,  0));

      // (�1, 0, �r2)
      this.addVertex(new Vertex(-1,  0, -r2),
                     new Vertex( 1,  0, -r2),
                     new Vertex(-1,  0,  r2),
                     new Vertex( 1,  0,  r2));
/*
      // These vertices create a dodecahedron with vertices
      // on a sphere of radius sqrt(3), and with edge length
      //    2/t = 4/(1 + sqrt(5)) = sqrt(5) - 1 = 1.2361.
      //https://en.wikipedia.org/wiki/Regular_dodecahedron#Cartesian_coordinates
      // (�1, �1, �1)
      this.addVertex(new Vertex(-1, -1, -1),
                new Vertex(-1, -1,  1),
                new Vertex(-1,  1, -1),
                new Vertex(-1,  1,  1),
                new Vertex( 1, -1, -1),
                new Vertex( 1, -1,  1),
                new Vertex( 1,  1, -1),
                new Vertex( 1,  1,  1));

      // (0, �r, �t)
      this.addVertex(new Vertex( 0, -r, -t),
                new Vertex( 0, -r,  t),
                new Vertex( 0,  r, -t),
                new Vertex( 0,  r,  t));

      // (�r, �t, 0)
      this.addVertex(new Vertex(-r, -t,  0),
                new Vertex(-r,  t,  0),
                new Vertex( r, -t,  0),
                new Vertex( r,  t,  0));

      // (�t, 0, �r)
      this.addVertex(new Vertex(-t,  0, -r),
                new Vertex( t,  0, -r),
                new Vertex(-t,  0,  r),
                new Vertex( t,  0,  r));
*/
      // Create 30 line segments (that make up 12 faces).
//https://github.com/mrdoob/three.js/blob/master/src/geometries/DodecahedronGeometry.js
      this.addPrimitive(new LineLoop(3, 11, 7, 15, 13), 
                        new LineFan(18, 3, 16, 1), 
                        new LineFan(9, 11, 1, 5), 
                        new LineFan(19, 7, 5, 17), 
                        new LineFan(6, 2, 15, 10, 17), 
                        new LineFan(2, 13, 10, 16), 
                        new Lines(17, 4, 5, 144, 1, 12, 16, 0, 10, 8), 
                        new LineLoop(4, 14, 12, 0, 8));

   }
}//Dodecahedron
