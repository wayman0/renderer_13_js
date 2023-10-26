/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
 * Demonstrates 'layering' in the framebuffer by
 * rendering into the same framebuffer without clearing it.
 */

//@ts-check

import {Scene, Matrix, Model, Position, Vertex} from "../../renderer/scene/SceneExport.js";
import {FrameBuffer, Viewport, Color} from "../../renderer/framebuffer/FramebufferExport.js";
import {renderFB, setRastDebug, setDoAntiAliasing} from "../../renderer/pipeline/PipelineExport.js";
import {Point} from "../../renderer/scene/primitives/PrimitiveExport.js";

let ptMod = Model.buildName("Point Model");
ptMod.addVertex(new Vertex(0, 0, 0));
ptMod.addColor(Color.red);
ptMod.addPrimitive(new Point(0, 0));
/**@type {Point} */ (ptMod.getPrimitive(0)).radius = 1;
let ptPos = Position.buildFromModelName(ptMod, "Point Position");
ptPos.setMatrix(Matrix.translate(-1, 0, -3));

let scene = new Scene();
scene.addPosition(ptPos);

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
    let fb = new FrameBuffer(50, 50);
    fb.clearFB(Color.white);

    //setRastDebug(true);

    renderFB(scene, fb);

    ptMod.primitiveList.length = 0;
    ptMod.colorList.length = 0;

    ptMod.addColor(Color.magenta);
    ptMod.addPrimitive(new Point(0, 0));
    /**@type {Point} */ (ptMod.getPrimitive(0)).radius = 3;
    ptPos.setMatrix(Matrix.translate(0, 0, -3));

    renderFB(scene, fb);

    ptMod.primitiveList.length = 0;
    ptMod.colorList.length = 0;

    ptMod.addColor(Color.Blue);
    ptMod.addPrimitive(new Point(0, 0));
    /**@type {Point}*/ (ptMod.getPrimitive(0)).radius = 5;
    ptPos.setMatrix(Matrix.translate(1, 0, -3));

    renderFB(scene, fb);

    fb.dumpFB2File("Point r=1, 3, 5.ppm");
}
