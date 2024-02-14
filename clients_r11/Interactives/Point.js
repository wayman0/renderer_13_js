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

function runOnline(mod)
{
    mod.setScene(scene);
    mod.setNumberInteractiveModels(scene.positionList.length);

    document.addEventListener("keypress", mod.handleKeyInput);
    document.addEventListener("keydown", mod.overrideDefault);
    const resizer = new ResizeObserver(mod.windowResized);
    resizer.observe(document.getElementById("resizer"));
}
