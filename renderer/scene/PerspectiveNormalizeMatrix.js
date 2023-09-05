/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   We use two steps to transform the camera's perspective view volume
   into the standard perspective view volume. The first step "skews" the
   current view volume so that its center line is the negative z-axis.
   The second step scales the skewed view volume so that it intersects
   the plane {@code z = -1} with corners {@code (-1, -1, -1)} and
   {@code (+1, +1, -1)}.
<p>
   Suppose we have an asymmetrical field-of-view in the yz-plane that is
   determined by the two points {@code (t, -near)} and {@code (b, -near)}.
   The center line of this field-of-view is determined by the point
   {@code ((t+b)/2, -near)}. We want to skew the yz-plane in the
   y-direction along the z-axis so that the field-of-view's center line
   becomes the z-axis. So we need to solve this equation for the value
   of the skew factor {@code s}.
   <pre>{@code
      [ 1  s ] * [ (t+b)/2 ] = [  0   ]
      [ 0  1 ]   [  -near  ]   [-near ]
   }</pre>
   This simplifies to the equation
   <pre>{@code
      (t+b)/2 + (s * -near) = 0
      s * near = (t+b)/2
      s = (t + b)/(2*near).
   }</pre>
   Once this field-of-view has been made symmetric with respect to the
   z-axis, we want to scale it in the y-direction so that the scaled
   field-of-view has an angle at the origin of 90 degrees. We need to
   scale the point {@code ((t-b)/2, -near)} to {@code (near, -near)}
   (and the point {@code (-(t-b)/2, -near)} to {@code (-near, -near)}).
   So we need to solve this equation for the value of the scale factor
   {@code s}.
   <pre>{@code
      [ s  0 ] * [ (t-b)/2 ] = [ near ]
      [ 0  1 ]   [  -near  ]   [-near ]
   }</pre>
   This simplifies to the equation
   <pre>{@code
      s * (t-b)/2 = near
      s = 2*near/(t - b).
   }</pre>
<p>
   Similar calculations can be made for the field-of-view in the xz-plane.
<p>
   The following matrix skews the camera's view volume along the
   z-axis so that the transformed view volume will be centered on
   the negative z-axis.
   <pre>{@code
     [ 1  0  (r+l)/(2*near)  0 ]
     [ 0  1  (t+b)/(2*near)  0 ]
     [ 0  0       1          0 ]
     [ 0  0       0          1 ]
   }</pre>
   The following matrix scales the skewed view volume so that it will
   be 2 units wide and 2 units tall at the view plane {@code z = -1}.
   <pre>{@code
     [ 2*near/(r-l)       0       0  0 ]
     [       0      2*near/(t-b)  0  0 ]
     [       0            0       1  0 ]
     [       0            0       0  1 ]
   }</pre>
   The matrix product looks like this.
   <pre>{@code
     [ 1  0  (r+l)/(2*near)  0 ]   [ 2*near/(r-l)       0       0  0 ]
     [ 0  1  (t+b)/(2*near)  0 ] * [       0      2*near/(t-b)  0  0 ]
     [ 0  0       1          0 ]   [       0            0       1  0 ]
     [ 0  0       0          1 ]   [       0            0       0  1 ]

         [ 2*near/(r-l)       0       (r+l)/(r-l)  0 ]
       = [   0          2*near/(t-b)  (t+b)/(t-b)  0 ]
         [   0                0            1       0 ]
         [   0                0            0       1 ]
   }</pre>
   This product matrix transforms the camera's perspective view
   volume into the standard (normalized) perspective view volume
   whose intersection with the view plane, {@code z = -1}, has
   {@code left = -1}, {@code right = +1}, {@code bottom = -1},
   and {@code top = +1}.
*/
//@ts-check
import {Camera, Matrix, Model, OrthoNorm, Position, Scene, Vector, Vertex} from "./SceneExport.js";

/**
 * This is a static factory method.
 * <p>
 * Construct the {@link Matrix} that transforms from the
 * {@link Camera}'s perspective view coordinate system to
 * the normalized perspective camera coordinate system.

 * @param {number} l the left edge of the view rectangle in the plane z = -near
 * @param {number} r the right edge of the view rectangle in the plane z = -near
 * @param {number} b the bottom edge of the view rectangle in the plane z = -near
 * @param {number} t the top edge of the view rectangle in the plane z = -near
 * @param {number} near the distance from the origin to the near plane
 * @returns {Matrix} a new matrix containing the perspective nomarlization matrix
 */
export default function build(l, r, b, t, near)
{
   if (typeof l != "number" ||
       typeof r != "number" ||
       typeof b != "number" ||
       typeof t != "number" ||
       typeof near != "number")
           throw new Error("L, R, B, T, and near must be numerical");

   let m1, m2;

   m1 = Matrix.buildFromColumns(
           new Vector(    1.0,            0.0,        0.0, 0.0),
           new Vector(    0.0,            1.0,        0.0, 0.0),
           new Vector((r+l)/(2*near), (t+b)/(2*near), 1.0, 0.0),
           new Vector(    0.0,            0.0,        0.0, 1.0));

   m2 = Matrix.buildFromColumns(
           new Vector(2*near/(r-l),      0.0,     0.0, 0.0),
           new Vector(     0.0,     2*near/(t-b), 0.0, 0.0),
           new Vector(     0.0,          0.0,     1.0, 0.0),
           new Vector(     0.0,          0.0,     0.0, 1.0));

   return m2.timesMatrix(m1);
}