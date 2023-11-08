/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import { Octahedron, TriangularPyramid} from "../../renderer/models_L/ModelsExport.js";
import {Scene, Position, Matrix} from "../../renderer/scene/SceneExport.js";
import * as ModelShading from "../../renderer/scene/util/UtilExport.js";
import {renderFB} from "../../renderer/pipeline/PipelineExport.js";
import {FrameBuffer, Color } from "../../renderer/framebuffer/FramebufferExport.js";
import {format} from "../../renderer/scene/util/UtilExport.js";

const scene = Scene.buildFromName("Two Interactive Models R10");

scene.addPosition(Position.buildFromModelName(new Octahedron(2, 2, 2, 2, 2, 2), "Octahedron Position"));
//scene.addPosition(Position.buildFromModelName(Octahedron.buildMeshOctahedron(2, 2, 2, 2, 2, 2), "Octahedron Position"));
scene.addPosition(Position.buildFromModelName(new TriangularPyramid(), "Triangular Pyramid Position"));

for(const p of scene.positionList)
    ModelShading.setRandomColor(p.getModel());

scene.getPosition(0).setMatrix(Matrix.translate(-2, 0, -4));
scene.getPosition(1).setMatrix(Matrix.translate(+2, 0, -3));

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
