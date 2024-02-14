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
const scene = Scene.buildFromName("ShowNestedModels_36")

// Create the top level Position.
const p = Position.buildFromName("top")

// Add the top level Position to the Scene.
scene.addPosition(p)

// Add nine nested Position objects to the top level Position.
for (let i = 0; i <= 8; ++i)
   p.addNestedPosition( Position.buildFromName("n"+i) );

// Create a Position that holds the complex hierarchical
// structure that draws four copies of Model_1.
const complex_p = Position.buildFromName("complex_p")

// Add two nested Positions to the complex position structure.
const p1 = Position.buildFromName("p1");
const p2 = Position.buildFromName("p2");
complex_p.addNestedPosition(p1, p2)

// Add a reference to a Position p3 to each of Positions p1 and p2.
const p3 = Position.buildFromName("p3");
p1.addNestedPosition(p3);
p2.addNestedPosition(p3)

// Add two nested Positions to the Position p3.
const p4 = Position.buildFromName("p4");
const p5 = Position.buildFromName("p5");
p3.addNestedPosition(p4, p5)

// Create a single instance of Model_1.
const m1 = new Model1();
ModelShading.setColor(m1, Color.red);

// Add a reference to Model m1 to each of Positions p4 and p5.
p4.setModel(m1);
p5.setModel(m1)

// Initialize the nested matrices in these Positions.
p1.getMatrix().mult( Matrix.translate(-2, -2, 0) );
p2.getMatrix().mult( Matrix.translate(2, 2, 0) )
              .mult( Matrix.rotateZ(180) );
p5.getMatrix().mult( Matrix.translate(1, -2-Math.sqrt(2), 0) )
              .mult( Matrix.scaleXYZ(0.5, 0.5, 1) )
              .mult( Matrix.rotateZ(-45) )

// Add a reference to the complex position structure
// to each of the nine nested positions in the top
// level Position object.
p.nestedPositions[0].addNestedPosition(complex_p);
for (let i = 1; i <= 8; ++i)
{
   p.nestedPositions[i].addNestedPosition(complex_p);
   p.nestedPositions[i].matrix2Identity()
                    .mult(Matrix.rotateZ(i*45))
                    .mult(Matrix.translate(0, -11, 0))
                    .mult(Matrix.scale(0.5));
}

// Create a FrameBuffer to render our Scene into.
const vp_width  = 1024;
const vp_height = 1024;
const fb = new FrameBuffer(vp_width, vp_height)

//PipelineLogger.debug = true
for (let i = 0; i <= 36; ++i)
{
   // Push the models away from where the camera is.
   p.matrix2Identity()
    .mult( Matrix.translate(0, 0, -15) )
    .mult( Matrix.rotateZ(10*i) )
   // What does this do?
 //complex_p.matrix2Identity();
 //complex_p.matrix.mult(rotateZ(10*i))
   // Render again.
   fb.clearFB(Color.white);
   renderFB(scene, fb);
   fb.dumpFB2File(("PPM_ShowNestedModels_36_Frame0" + i + ".ppm"));
}