/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import * as ModelShading from "../../renderer/scene/util/UtilExport.js";
import {Position, Scene, Matrix, Model, LineSegment, Vertex} from "../../renderer/scene/SceneExport.js";
import {PanelXZ, TriangularPrism} from "../../renderer/models_L/ModelsExport.js";
import {FrameBuffer, Color} from "../../renderer/framebuffer/FramebufferExport.js";
import {renderFB1 as renderFB} from "../../renderer/pipeline/PipelineExport.js";

/**
   Here is a sketch of this program's scene graph.
   Only the TriangularPrism model holds any geometry.
   All of the other nodes hold only a matrix.
<pre>{@code
                 Scene
                   |
                   |
               Position
              /    |    \
             /     |     \
       Matrix    Model    List<Position>
         R      (empty)      / |  | \
                            /  |  |  \
                          p1  p2  p3  p4
                            \  |  |  /
                             \ |  | /
                          TriangularPrism
}</pre>
*/
      const sqrt3 = Math.sqrt(3.0);

      // Create the Scene object that we shall render.
      const scene = Scene.buildFromName("Prisms_v1");

      // Create the top level Position.
      const top_p = Position.buildFromName("top");

      // Add the top level Position to the Scene.
      scene.addPosition(top_p);

      // Create four nested Positions each holding
      // a reference to a shared prism Model.
      const prism = new TriangularPrism(1.0/sqrt3, 2.0, Math.PI/4.0, 25);
      ModelShading.setColor(prism, Color.red);
      const p1 = Position.buildFromModelName(prism, "p1");
      const p2 = Position.buildFromModelName(prism, "p2");
      const p3 = Position.buildFromModelName(prism, "p3");
      const p4 = Position.buildFromModelName(prism, "p4");

      // Put these four nested Positions into the top level Position.
      top_p.addNestedPosition(p1, p2, p3, p4);

      // Place the four nested positions within
      // the top level position.
      // right
      p1.getMatrix().mult(Matrix.translate(2+0.5/sqrt3, 0, 0));
      // left

      p2.getMatrix().mult(Matrix.translate(-2-0.5/sqrt3, 0, 0))
                    .mult(Matrix.rotateZ(180));
      // top
      p3.getMatrix().mult(Matrix.rotateZ(90))
                    .mult(Matrix.translate(2+0.5/sqrt3, 0, 0));
      // bottom
      p4.getMatrix().mult(Matrix.rotateZ(-90))
                    .mult(Matrix.translate(2+0.5/sqrt3, 0, 0));


      // Create a floor Model.
      const floor = new PanelXZ(-4, 4, -4, 4);
      ModelShading.setColor(floor, Color.black);
      const floor_p = Position.buildFromModel(floor);
      floor_p.getMatrix().mult(Matrix.translate(0, -4, 0));
      // Push this model away from where the camera is.
      floor_p.getMatrix().mult(Matrix.translate(0, 0, -5));
      // Add the floor to the Scene.
      scene.addPosition(floor_p);

      // Create a framebuffer to render our scene into.
      const vp_width  = 1024;
      const vp_height = 1024;
      const fb = new FrameBuffer(vp_width, vp_height);
      // Give the framebuffer a nice background color.
      fb.clearFB(Color.Gray);

      //PipelineLogger.debug = true;

      // Spin the model 360 degrees arond two axes.
      for (let i = 0; i <= 180; ++i)
      {
         // Push the model away from where the camera is.
         top_p.matrix2Identity()
              .mult(Matrix.translate(0, 0, -8))
              .mult(Matrix.rotateX(2*i))
              .mult(Matrix.rotateY(2*i))
              .mult(Matrix.rotateZ(2*i));

         // Render again.
         fb.clearFB(Color.Gray);
         renderFB(scene, fb);
         fb.dumpFB2File(("PPM_NestedPrism_V1_Frame0" + i + ".ppm"));
      }
