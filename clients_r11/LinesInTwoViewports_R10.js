/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import {Scene, Model, Position, Vertex, LineSegment} from "../renderer/scene/SceneExport.js";
import {FrameBuffer, Viewport, Color} from "../renderer/framebuffer/FramebufferExport.js";
import {render1 as render, setClipDebug, setDoAntiAliasing, setDoGamma, setRastDebug} from "../renderer/pipeline/PipelineExport.js";
import {setRainbowPrimitiveColors} from "../renderer/scene/util/ModelShading.js";

const scene = Scene.buildFromName("LinesInTwoViewports_R10");
const model = Model.buildName("Lines");
scene.addPosition(Position.buildFromModelName(model, "top"));

model.addVertex(new Vertex( 5, 4,  -6),
                new Vertex(-1, .5, -2),
                new Vertex( 5, 4,  -3)); // try (0, 4, -3)

model.addColor(Color.red,
               Color.green,
               Color.blue);

model.addPrimitive(LineSegment.buildVertexColors(0, 1, 0, 1),
                   LineSegment.buildVertexColors(1, 2, 1, 2));

const width  = 300;
const height = 200;
const fb = new FrameBuffer(width, height, Color.white);

//FrameBuffer.Viewport vp1 = fb.new Viewport( 50, 50, 100, 100);
//FrameBuffer.Viewport vp2 = fb.new Viewport(150, 50, 100, 100);
let vp1 = new Viewport(100, 100, fb, 50,  50);
let vp2 = new Viewport(100, 100, fb, 150, 50);

vp1.setBackgroundColorVP(Color.gray);
vp2.setBackgroundColorVP(Color.black);
vp1.clearVPDefault();
vp2.clearVPDefault();

scene.debug = true;

setClipDebug(true);
setRastDebug(true);
setDoAntiAliasing(true);
setDoGamma(true);

render(scene, vp1);
render(scene, vp2);
fb.dumpFB2File("LinesInTwoViewports_R10.ppm");