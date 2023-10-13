/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import {Scene, Model, Position, Vertex, LineSegment, Matrix} from "../renderer/scene/SceneExport.js";
import {FrameBuffer, Color} from "../renderer/framebuffer/FramebufferExport.js";
import {renderFB} from "../renderer/pipeline/PipelineExport.js";
import {format} from "../renderer/scene/util/UtilExport.js";

let scene = new Scene();

// Create a Model object to hold the geometry.
const model = Model.buildName("triangle");
scene.addPosition(Position.buildFromModel(model));
scene.getPosition(0).setMatrix(Matrix.translate(0, 0, -2));

// Create the geometry for the Model.
// Vertices.
model.addVertex(new Vertex(1.0, 0.0, 0.0),
                new Vertex(0.0, 1.0, 0.0),
                new Vertex(0.0, 0.0, 0.0));

// Give the Model three Color objects.
model.addColor(new Color(255,  0,   0 ),  // red
               new Color( 0,  255,  0 ),  // green
               new Color( 0,   0,  255)); // blue

// Line segments. Give a different color to each vertex.
model.addPrimitive(LineSegment.buildVertexColors(0, 1, 0, 1),
                   LineSegment.buildVertexColors(1, 2, 1, 2),
                   LineSegment.buildVertexColors(2, 0, 2, 0));


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
    let fb = new FrameBuffer(1000, 1000);
    renderFB(scene, fb);
    fb.dumpFB2File("InteractiveTriangle.ppm");

    for(let x = 0; x <= 180; x += 1)
    {
        fb.clearFB(Color.black);
        scene.getPosition(0).setMatrix(Matrix.translate(-.5, -.5, -2).mult(Matrix.rotateX(2*x)));
        renderFB(scene, fb);
        //fb.dumpFB2File(format("InteractiveTriangleRotX Frame %3d.ppm", x));

        fb.clearFB(Color.black);
        scene.getPosition(0).setMatrix(Matrix.translate(-.5, -.5, -2).mult(Matrix.rotateY(2*x)));
        renderFB(scene, fb);
        //fb.dumpFB2File(format("InteractiveTriangleRotY Frame %3d.ppm", x));

        fb.clearFB(Color.black);
        scene.getPosition(0).setMatrix(Matrix.translate(-.5, -.5, -2).mult(Matrix.rotateZ(2*x)));
        renderFB(scene, fb);
        //fb.dumpFB2File(format("InteractiveTriangleRotZ Frame %3d.ppm", x));

        fb.clearFB(Color.black);
        scene.getPosition(0).setMatrix(Matrix.translate(-.5, -.5, -2)
                                            .mult(Matrix.rotateX(2*x))
                                            .mult(Matrix.rotateY(2*x))
                                            .mult(Matrix.rotateZ(2*x)));
        renderFB(scene, fb);
        fb.dumpFB2File(format("InteractiveTriangleRotAll Frame %3d.ppm", x));
    }
}

