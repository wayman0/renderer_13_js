/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Create a wireframe model of a camera's perspective view frustum.
   That is, create a frustum of a pyramid along the negative z-axis
   with its apex at the origin.
<p>
   This class has two constructors that mimic the projPerspective()
   methods from the {@link Camera} class.
<p>
   See <a href="https://en.wikipedia.org/wiki/Viewing_frustum" target="_top">
                https://en.wikipedia.org/wiki/Viewing_frustum</a>
*/
//@ts-check
import {Model, Vertex, LineSegment, LineLoop, Lines} from "../scene/SceneExport.js";
import {format} from "../scene/util/UtilExport.js";

export default class ViewFrustumModel extends Model
{

   /**
      Create a frustum of a pyramid along the negative z-axis that
      mimics a {@link Camera}'s perspective view volume.

      @param {number} [left  =-.25]  left edge of the front face in the plane z = -near
      @param {number} [right =.25]  right edge of the front face in the plane z = -near
      @param {number} [bottom=-.25]  bottom edge of the front face in the plane z = -near
      @param {number} [top   =.25]  top edge of the front face in the plane z = -near
      @param {number} [near  =.25]  distance from the origin to the front face
      @param {number} [far   =1]  distance from the origin to the back face
   */
   constructor(left=-.25, right=.25, bottom=-.25, top=.25, near=.25, far=1)
   {
      super(undefined, undefined, undefined, undefined, undefined,  "View Frustum Model");

      this.addVertex(new Vertex(left,  top,    -near),
                     new Vertex(right, top,    -near),
                     new Vertex(right, bottom, -near),
                     new Vertex(left,  bottom, -near),
                     new Vertex( (left/near)*far,    (top/near)*far, -far),
                     new Vertex((right/near)*far,    (top/near)*far, -far),
                     new Vertex((right/near)*far, (bottom/near)*far, -far),
                     new Vertex( (left/near)*far, (bottom/near)*far, -far));

      this.addPrimitive(new LineLoop(0, 1, 2, 3), 
                        new LineLoop(4, 5, 6, 7), 
                        new Lines(0,4, 1,5, 2,6, 3,7));
   }

   /**
      Here, the frustum is determined by a vertical "field of view"
      angle and an aspect ratio for the front face.

      @param {number} fovy    angle in the y-direction subtended by the front face
      @param {number} aspect  aspect ratio of the front face
      @param {number} near    distance from the origin to the front face
      @param {number} far     distance from the origin to the back face
   */
   static BuildViewFrustumModel(fovy, aspect, near, far)
   {
      // top    =  near * Math.tan((Math.PI/180.0)*fovy/2.0)
      // left   = -top * aspect
      // right  =  top * aspect
      // bottom = -top
      return new ViewFrustumModel
                 (-near * Math.tan((Math.PI/180.0)*fovy/2.0) * aspect,
                   near * Math.tan((Math.PI/180.0)*fovy/2.0) * aspect,
                  -near * Math.tan((Math.PI/180.0)*fovy/2.0),
                   near * Math.tan((Math.PI/180.0)*fovy/2.0),
                   near,
                   far);
   }
}//ViewFrustumModel
