/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import {Scene, Matrix, Model, Position, Vertex} from "../../renderer/scene/SceneExport.js";
import {FrameBuffer, Viewport, Color} from "../../renderer/framebuffer/FramebufferExport.js";
import {renderFB, setRastDebug, setDoAntiAliasing} from "../../renderer/pipeline/PipelineExport.js";
import {LineSegment} from "../../renderer/scene/primitives/PrimitiveExport.js";

let lsModelBlend = Model.buildName("Line Segment Model: Red to Blue");
lsModelBlend.addVertex(  new Vertex(-1, 0, 0),
                    new Vertex(1, 0, 0));
lsModelBlend.addColor(Color.red, Color.blue);
lsModelBlend.addPrimitive(LineSegment.buildVertexColors(0, 1, 0, 1));

let lsPositBlend = Position.buildFromModelName(lsModelBlend, "Line Segment Blend Position");
lsPositBlend.setMatrix(Matrix.translate(0, 0, -3));

let lsModelRed = Model.buildName("Line Segment Model Red");
lsModelRed.addVertex(   new Vertex(-1, -1, 0),
                        new Vertex(1, -1, 0));
lsModelRed.addColor(Color.Red);
lsModelRed.addPrimitive(LineSegment.buildVertexColor(0, 1, 0));

let lsPositRed = Position.buildFromModelName(lsModelRed, "Line Segment Red Position ")
lsPositRed.setMatrix(Matrix.translate(0, 0, -3));

let lsModelBlue = Model.buildName("Line Segment Model Blue");
lsModelBlue .addVertex( new Vertex(-1, 1, 0),
                        new Vertex(1, 1, 0));
lsModelBlue.addColor(Color.Blue);
lsModelBlue.addPrimitive(LineSegment.buildVertexColor(0, 1, 0));

let lsPositBlue = Position.buildFromModelName(lsModelBlue, "Line Segment Blue Position ")
lsPositBlue.setMatrix(Matrix.translate(0, 0, -3));

let scene = Scene.buildFromName("Line Segment Scene");
scene.addPosition(lsPositBlend);
scene.addPosition(lsPositRed);
scene.addPosition(lsPositBlue);

scene.getPosition(0).visible = false;
scene.getPosition(2).visible = false;
scene.getPosition(1).visible = false;

try
{
    document;
    const file = "./InteractiveAbstractClient_R10.js";

    try
    {
        async function getModule()
        {
            return await import(file);
        }

        runOnline(await getModule());
    }
    catch(err)
    {
        console.log(err);
    }
}
catch(e)
{
    runOffline();
}

function runOnline(mod)
{
    mod.setScene(scene);
    mod.setNumberInteractiveModels(scene.positionList.length);

    document.addEventListener("keypress", mod.handleKeyInput);
    const resizer = new ResizeObserver(mod.windowResized);
    resizer.observe(document.getElementById("resizer"));
}

function runOffline()
{
    let fb = new FrameBuffer(500, 500);

    renderFB(scene, fb);
    fb.dumpFB2File("LineSegment.ppm");

    // clearFBDefault or ClearFB doesn't work
    for(let x = -3; x <= 3; x += .5)
    {
        fb.clearFBDefault();
        lsPositBlend.setMatrix(Matrix.translate(x, x, -3));
        renderFB(scene, fb);
        fb.dumpFB2File("LineSegment--Translate(" + x + ", " + x + ").ppm");
    }
}