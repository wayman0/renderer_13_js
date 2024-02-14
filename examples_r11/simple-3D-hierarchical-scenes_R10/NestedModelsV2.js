/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import * as ModelShading from "../../renderer/scene/util/UtilExport.js";
import {Position, Scene, Matrix, Model, LineSegment, Vertex} from "../../renderer/scene/SceneExport.js";
import {PanelXZ, Sphere} from "../../renderer/models_L/ModelsExport.js";
import {FrameBuffer, Color} from "../../renderer/framebuffer/FramebufferExport.js";
import {renderFB} from "../../renderer/pipeline/PipelineExport.js";

/**
   This is a simple hierarchical scene made up of a
   triangle with a sphere attached to each vertex.
<p>
   Here is a sketch of the scene graph for this example.
<pre>{@code
                 Scene
                   |
                   |
               Position
              /    |    \
             /     }     \
            /      |      \
      Matrix     Model     List<Position>
       RT     (triangle)    /     |     \
                           /      |      \
                          /       |       \
                  Position    Position   Position
                   /   \       /  |      /    /
                  /     \     /   |     /    /
             Matrix      \ Matrix |  Matrix /
               TR         \  TR   |    TR  /
                           \      |       /
                            \     |      /
                             \    |     /
                              \   |    /
                                Model
                              (sphere)
}</pre>
*/

      // Create the Scene object that we shall render.
      const scene = Scene.buildFromName("NestedModels_v1a");

      // Create the top level Position.
      const top_p = Position.buildFromName("top");

      // Add the top level Position to the Scene.
      scene.addPosition(top_p);

      // Create a Model for the top level position.
      const topModel = Model.buildName("triangle");
      top_p.setModel(topModel);

      // Add a single triangle to the geometry of this model.
      const sin2PIover3 = Math.sin(2*Math.PI/3);
      const v0 = new Vertex( 1,        0,       0);
      const v1 = new Vertex(-0.5,  sin2PIover3, 0);
      const v2 = new Vertex(-0.5, -sin2PIover3, 0);
      topModel.addVertex(v0, v1, v2);
      topModel.addPrimitive(LineSegment.buildVertex(0, 1),
                            LineSegment.buildVertex(1, 2),
                            LineSegment.buildVertex(2, 0));
      ModelShading.setColor(topModel, Color.black);

      // Create three nested Positions each holding
      // a reference to a shared sphere Model.
      const sphere = new Sphere(0.5, 10, 10);
      ModelShading.setColor(sphere, Color.red);
      const p1 = Position.buildFromModelName(sphere, "s1");
      const p2 = Position.buildFromModelName(sphere, "s2");
      const p3 = Position.buildFromModelName(sphere, "s3");

      // Put these three nested Positions into the top level Position.
      top_p.addNestedPosition(p1, p2, p3);

      // Place the three nested positions at the
      // corners of the top level position's triangle.
      p1.getMatrix().mult(Matrix.translate( 1.5,   0,               0));
      p2.getMatrix().mult(Matrix.translate(-0.75,  1.5*sin2PIover3, 0));
      p3.getMatrix().mult(Matrix.translate(-0.75, -1.5*sin2PIover3, 0));

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

      //PipelineLogger.debug = true;

      for (let i = 0; i <= 72; ++i)
      {
         // Rotate each sphere WITHIN the scene.
         p1.getMatrix().mult(Matrix.rotateY(5));
         p2.getMatrix().mult(Matrix.rotateX(5));
         p3.getMatrix().mult(Matrix.rotateZ(5));

         // Translate and rotate the WHOLE scene.
         top_p.matrix2Identity();
         // Push the whole scene away from where the camera is.
         top_p.getMatrix().mult(Matrix.translate(0, 0, -5));
         // Rotate and translate the whole scene.
         top_p.getMatrix().mult(Matrix.rotateZ(5*i));
         top_p.getMatrix().mult(Matrix.translate(2, 0, 0));
//       top_p.getMatrix().mult(Matrix.rotateY(5*i));
//       top_p.getMatrix().mult(Matrix.rotateX(5*i));

         // Render
         fb.clearFB(Color.Gray);
         renderFB(scene, fb);
         fb.dumpFB2File(("PPM_NestedModels_v1a_Frame0" + i + ".ppm"));
      }