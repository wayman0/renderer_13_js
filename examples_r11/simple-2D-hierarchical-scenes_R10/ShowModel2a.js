/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

// @ts-check

import Model1 from "./Model1.js";
import * as ModelShading from "../../renderer/scene/util/UtilExport.js";
import {Position, Scene, Matrix} from "../../renderer/scene/SceneExport.js";
import {FrameBuffer, Color} from "../../renderer/framebuffer/FramebufferExport.js";
import {renderFB1 as renderFB} from "../../renderer/pipeline/PipelineExport.js";

// Create the Scene object that we shall render.
const scene = Scene.buildFromName("ShowModel_2");

// Create the top level Position.
const p = Position.buildFromName("top");

// Add the top level Position to the Scene.
scene.addPosition(p);

// Add two nested Positions to the top level Position.
const p1 = Position.buildFromName("left");
const p2 = Position.buildFromName("right");
p.addNestedPosition(p1, p2);

// Add two instances of Model_1 to the Scene.
const m1 = new Model1();
const m2 = new Model1();
ModelShading.setColor(m1, Color.red);
ModelShading.setColor(m2, Color.blue);
// Add references to Models m1 and m2 to Positions p1 and p2.
p1.setModel(m1);
p2.setModel(m2);

// Initialize the nested matrices in the Positions.
p2.getMatrix().mult( Matrix.translate(1, -2-Math.sqrt(2), 0) )
              .mult( Matrix.scaleXYZ(0.5, 0.5, 1) )
              .mult( Matrix.rotateZ(-45) );

// Create a FrameBuffer to render our Scene into.
const vp_width  = 1024;
const vp_height = 1024;
const fb = new FrameBuffer(vp_width, vp_height);

//PipelineLogger.debug = true;

for (let i = 0; i <= 36; ++i)
{
   // Push the models away from where the camera is.
   p.matrix2Identity()
    .mult( Matrix.translate(0, 0, -5) )
    .mult( Matrix.rotateZ(10*i) );

   // Render again.
   fb.clearFB(Color.white);
   renderFB(scene, fb);
   fb.dumpFB2File("PPM_ShowModel_2a_Frame0" + i + ".ppm");
}