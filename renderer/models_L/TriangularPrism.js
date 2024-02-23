/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Create a wireframe model of a right equilateral triangular prism
   with the y-axis as its central axis.
<p>
   See <a href="https://en.wikipedia.org/wiki/Triangular_prism" target="_top">
                https://en.wikipedia.org/wiki/Triangular_prism</a>
<p>
   See <a href="https://en.wikipedia.org/wiki/Prism_(geometry)" target="_top">
                https://en.wikipedia.org/wiki/Prism_(geometry)</a>
<p>
   Attach to each triangular end of the prism a tetrahedron.
*/
//@ts-check 

import {Model, Vertex, LineSegment} from "../scene/SceneExport.js";
import {format} from "../scene/util/UtilExport.js";

export default class TriangularPrism extends Model
{
//   /**
//      Create a right equilateral triangular prism with a
//      regular tetrahedrons attached to each end so that
//      the total length runs from -1 to 1 along the y-axis.
//   */
//   public TriangularPrism( )
//   {
//      this(0.5, 0.6);
//   }
//
//
//   /**
//      Create an equilateral triangular prism that runs
//      from {@code -h} to {@code h} along the y-axis, has
//      triangle side length {@code s}, and has a regular
//      tetrahedron attached to each end.
//
//      @param s  the length of the triangle's sides
//      @param h  the body of the prism runs from -h to h along the y-axis
//   */
//   public TriangularPrism(final double s, final double h)
//   {
//      this(s, h, 0);
//   }
//
//
//   /**
//      Create an equilateral triangular prism that runs
//      from {@code -h} to {@code h} along the y-axis, has
//      triangle side length {@code s}, has a regular
//      tetrahedron attached to each end, and has {@code n}
//      lines of latitude around the body of the prism.
//
//      @param s  the length of the triangle's sides
//      @param h  the body of the prism runs from -h to h along the y-axis
//      @param n  number of lines of latitude around the body of the prism
//      @throws IllegalArgumentException if {@code n} is less than 0
//   */
//   public TriangularPrism(final double s, final double h,
//                          final int n)
//   {
//      this(s/Math.sqrt(3), h, Math.atan(Math.sqrt(2)), n);
//   }
//
//
//   /**
//      Create an equilateral triangular prism that runs
//      from {@code -h} to {@code h} along the y-axis, with
//      the triangle inscribed in a circle of radius {@code r},
//      has a tetrahedron attached to each end where the
//      face-edge-face angle of each tetrahedron is {@code theta}
//      (with theta in radians!), and has {@code n} lines of
//      latitude around the body of the prism.
//   <p>
//      If {@code theta = 0}, then there are no tetrahedrons at the ends of the prism.
//   <p>
//      If {@code theta = arctan(sqrt(2)) = 54.736�}, then the tetrahedrons are regular.
//
//      @param r      radius of circle in xz-plane that the equilateral triangle is inscribed in
//      @param h      the body of the prism runs from -h to h along the y-axis
//      @param theta  slant angle of each tetrahedron at the ends of the prism
//      @param n      number of lines of latitude around the body of the prism
//      @throws IllegalArgumentException if {@code n} is less than 0
//   */
//   public TriangularPrism(final double r, final double h, final double theta,
//                          final int n)
//   {
//      this(r, h, r*Math.tan(theta), n, true);
//   }
//
   /**
      Create an equilateral triangular prism that runs
      from {@code -h} to {@code h} along the y-axis, with
      the triangle inscribed in a circle of radius {@code r},
      has a tetrahedron attached to each end where the height
      of each tetrahedron is {@code h2}, and has {@code n} lines
      of latitude around the body of the prism.
   <p>
      So the total height is {@code 2*(h + h2)}.
      @param {number} [r=.5/Math.sqrt(3)]  radius of circle in xz-plane that the equilateral triangle is insc
      @param {number} [h=.6]  the body of the prism runs from h to -h in the y-direction
      @param {number} [h2=r*Math.tan(Math.atan(Math.sqrt(2)))]  height of each tetrahedron at the ends of the
      @param {number} [n=3]  number of lines of latitude around the body of the prism
      @param {boolean} [bothHalves=true]  determines if both halves or only the top half gets created
   */
   constructor(r=.5, h=.6, h2=r*Math.tan(Math.atan(Math.sqrt(2))), n=3, bothHalves=true)
   {
      super(undefined, undefined, undefined, undefined, undefined,  format("Triangular Prism(%.2f,%.2f,%.2f,%d)", r, h, h, n));
      
      if(n < 0)
         throw new Error("n must be greater than or equal to 0");

      // Create the prism's geometry.
      const sqrt3 = Math.sqrt(3.0);
      let v0, v1, v2, v3, v4, v5, v6, v7;

      // Three vertices around the top.
      v0 = new Vertex( r,    h,    0);
      v1 = new Vertex(-r/2,  h,  r*0.5*sqrt3);
      v2 = new Vertex(-r/2,  h, -r*0.5*sqrt3);

      // Three vertices around the bottom.
      if (bothHalves)
      {
         v3 = new Vertex( r,   -h,    0);
         v4 = new Vertex(-r/2, -h,  r*0.5*sqrt3);
         v5 = new Vertex(-r/2, -h, -r*0.5*sqrt3);
      }
      else // ! bothHalves, so cut off the bottom half
      {
         v3 = new Vertex( r,    0,    0);
         v4 = new Vertex(-r/2,  0,  r*0.5*sqrt3);
         v5 = new Vertex(-r/2,  0, -r*0.5*sqrt3);
      }
      v6 = new Vertex(0,  h+h2, 0);  // vertex at the top
      if (bothHalves)
         v7 = new Vertex(0, -h-h2, 0);  // vertex at the bottom
      else // ! bothHalves, so cut off the bottom half
         v7 = new Vertex(0, 0, 0);   // vertex at the bottom
      this.addVertex(v0, v1, v2, v3, v4, v5, v6, v7);
      let index = 8;
      // Create 15 line segments.
      // 3 top faces
      this.addPrimitive(LineSegment.buildVertex(6, 0),
                        LineSegment.buildVertex(6, 1),
                        LineSegment.buildVertex(6, 2));
      // the top edge
      this.addPrimitive(LineSegment.buildVertex(0, 1),
                        LineSegment.buildVertex(1, 2),
                        LineSegment.buildVertex(2, 0));
      // three vertical edges
      this.addPrimitive(LineSegment.buildVertex(0, 3),
                        LineSegment.buildVertex(1, 4),
                        LineSegment.buildVertex(2, 5));
      // the bottom edge
      this.addPrimitive(LineSegment.buildVertex(3, 4),
                        LineSegment.buildVertex(4, 5),
                        LineSegment.buildVertex(5, 3));
      // 3 bottom faces
      this.addPrimitive(LineSegment.buildVertex(7, 3),
                        LineSegment.buildVertex(7, 4),
                        LineSegment.buildVertex(7, 5));
      // Create n lines of latitude around the prism.
      if (n > 0)
      {
         let delta_y = 2.0*h/(n+1);
         if (! bothHalves)  // cut off the bottom half
            delta_y = h/(n+1);
         for(let j = 0; j < n; ++j)
         {
            let y = -h + (j+1) * delta_y;
            if (! bothHalves)  // cut off the bottom half
               y = (j+1) * delta_y;
            this.addVertex(new Vertex( r,    y,    0),
                           new Vertex(-r/2,  y,  r*0.5*sqrt3),
                           new Vertex(-r/2,  y, -r*0.5*sqrt3));
            this.addPrimitive(LineSegment.buildVertex(index+0, index+1),
                              LineSegment.buildVertex(index+1, index+2),
                              LineSegment.buildVertex(index+2, index+0));
            index += 3;
         }
      }
   }
}//TriangularPrism
