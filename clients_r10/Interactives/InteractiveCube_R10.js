/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import {Scene, Matrix, Model, Position, Vertex} from "../../../renderer/scene/SceneExport.js";
import {FrameBuffer, Viewport, Color} from "../../../renderer/framebuffer/FramebufferExport.js";
import {renderFB, setRastDebug, setDoAntiAliasing} from "../../../renderer/pipeline/PipelineExport.js";
import {LineSegment} from "../../../renderer/scene/primitives/PrimitiveExport.js";
import { handleKeyInput, windowResized } from "./InteractiveAbstractClient_R10.js";

let cubeModel = Model.buildName("Cube");
cubeModel.addVertex(new Vertex(-1, -1, 1),
                    new Vertex(-1, 1, 1),
                    new Vertex(1, 1, 1),
                    new Vertex(1, -1, 1),
                    new Vertex(-1, -1, -1),
                    new Vertex(-1, 1, -1),
                    new Vertex(1, 1, -1),
                    new Vertex(1, -1, -1));
cubeModel.addColor(Color.RED, Color.Green, Color.BLUE, Color.Orange, Color.yellow, Color.pink, Color.cyan, Color.magenta);
cubeModel.addPrimitive( LineSegment.buildVertexColors(0, 1, 0, 1),
                        LineSegment.buildVertexColors(1, 2, 1, 2),
                        LineSegment.buildVertexColors(2, 3, 2, 3),
                        LineSegment.buildVertexColors(3, 0, 3, 0),

                        LineSegment.buildVertexColors(4, 5, 4, 5),
                        LineSegment.buildVertexColors(5, 6, 5, 6),
                        LineSegment.buildVertexColors(6, 7, 6, 7),
                        LineSegment.buildVertexColors(7, 4, 7, 4),

                        LineSegment.buildVertexColors(0, 4, 0, 4),
                        LineSegment.buildVertexColors(1, 5, 1, 5),
                        LineSegment.buildVertexColors(2, 6, 2, 6),
                        LineSegment.buildVertexColors(3, 7, 3, 7));

let cubePos = Position.buildFromModelName(cubeModel, "Cube Position");
cubePos.setMatrix(Matrix.translate(0, 0, -5));

let scene = Scene.buildFromName("InteractiveCube_R10");
scene.addPosition(cubePos);


const file = "./InteractiveAbstractClient_R10.js";
try
{
    async function getModule()
    {
        return await import("./InteractiveAbstractClient_R10.js");
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
    const resizer = new ResizeObserver(mod.windowResized);
    resizer.observe(document.getElementById("resizer"));    
}
