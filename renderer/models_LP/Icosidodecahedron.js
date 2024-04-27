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

import {Model, Vertex, LineSegment, LineLoop} from "../scene/SceneExport.js";
import {format} from "../scene/util/UtilExport.js";

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
      super(undefined, undefined, undefined, undefined, undefined,  "Icosidodecahedron");

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
      this.addPrimitive(new LineLoop(0, 2, 7, 10, 3), 
                        new LineLoop(0, 4, 11, 6, 1), 
                        new LineLoop(1, 5, 14, 8, 2), 
                        new LineLoop(3, 9, 19, 12, 4), 
                        new LineLoop(5,6, 15, 22, 13), 
                        new LineLoop(7, 8, 17, 25, 16), 
                        new LineLoop( 9, 10, 16, 24, 18),
                        new LineLoop(11, 12, 20, 23, 15),
                        new LineLoop(13, 21, 26, 17, 14),
                        new LineLoop(18, 27, 28, 20, 19),
                        new LineLoop(21, 22, 23, 28, 29),
                        new LineLoop(24, 25, 26, 29, 27));
   }
}//Icosidodecahedron
