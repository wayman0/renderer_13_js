/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import Model1 from "./Model1.js";
import * as ModelShading from "../../renderer/scene/util/UtilExport.js";
import {Position, Scene, Matrix} from "../../renderer/scene/SceneExport.js";
import {FrameBuffer, Color} from "../../renderer/framebuffer/FramebufferExport.js";
import {renderFB} from "../../renderer/pipeline/PipelineExport.js";

// Create the Scene object that we shall render.
const scene = Scene.buildFromName("ShowModel_4a");

// Create the top level Position.
const p = Position.buildFromName("top");

// Add the top level Position to the Scene.
scene.addPosition(p);

// Add two nested Positions to the top level Position.
const p1 = Position.buildFromName("p1");
const p2 = Position.buildFromName("p2");
p.addNestedPosition(p1, p2);

// Add a reference to a Position p3 to each of Positions p1 and p2.
const p3 = Position.buildFromName("p3");
p1.addNestedPosition(p3);
p2.addNestedPosition(p3);

// Add two nested Positions to the Position p3.
const p4 = Position.buildFromName("p4");
const p5 = Position.buildFromName("p5");
p3.addNestedPosition(p4, p5);

// Create two instances of Model_1.
const m1 = new Model1();
const m2 = new Model1();
ModelShading.setColor(m1, Color.red);
ModelShading.setColor(m2, Color.blue);
// Add a reference to a Model_1 to each of Positions p4 and p5.
p4.setModel(m1);
p5.setModel(m2);

// Initialize the nested matrices in the Positions.
p1.getMatrix().mult( Matrix.translate(-2, -2, 0) );
p2.getMatrix().mult( Matrix.translate(2, 2, 0) )
              .mult( Matrix.rotateZ(180) );
p5.getMatrix().mult( Matrix.translate(1, -2-Math.sqrt(2), 0) )
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
    .mult( Matrix.translate(0, 0, -8) )
    .mult( Matrix.rotateZ(10*i) );

   // Render again.
   fb.clearFB(Color.white);
   renderFB(scene, fb);
   fb.dumpFB2File(("PPM_ShowModel_4b_Frame0" + i + ".ppm"));
}