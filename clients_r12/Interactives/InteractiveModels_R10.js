/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import {Scene, Position, Matrix} from "../../renderer/scene/SceneExport.js";
import {Sphere, Cylinder, Torus, Cube, PanelXY, PanelXZ, Cube2} from "../../renderer/models_L/ModelsExport.js";
import * as ModelShading from "../../renderer/scene/util/UtilExport.js";
import {FrameBuffer, Color} from "../../renderer/framebuffer/FramebufferExport.js";
import {renderFB1 as renderFB} from "../../renderer/pipeline/PipelineExport.js";
import {format} from "../../renderer/scene/util/UtilExport.js";


// Create the Scene object that we shall render.
const scene = Scene.buildFromName("InteractiveModels_R10");

// Create several Model objects.
scene.addPosition(Position.buildFromModel(new Sphere(1.0, 30, 30)));
scene.addPosition(Position.buildFromModel(new Cylinder(0.5, 1.0, 20, 20)));
scene.addPosition(Position.buildFromModel(new Torus(0.75, 0.25, 25, 25)));
//scene.addPosition(Position.buildFromModel(new Cube(1)));
scene.addPosition(Position.buildFromModel(new Cube2(15, 15, 15)));

// Give each model a random color.

// Push the Positions away from where the camera is.
for(let x = 0; x < scene.positionList.length; x += 1)
{
   const p = scene.getPosition(x);
   ModelShading.setRainbowPrimitiveColors(p.model);
   p.setMatrix(Matrix.translate(3*x - 6, 0, -3) );
   p.visible = false;
}

scene.addPosition(Position.buildFromModel(new PanelXY(-7, 7, -1, 3)));  // wall
scene.addPosition(Position.buildFromModel(new PanelXZ(-7, 7, -3, 1)));  // floor

// Position the wall, floor.
const size = scene.positionList.length;
scene.getPosition(size - 2).getMatrix().mult( Matrix.translate(0,  0, -3) );// wall
ModelShading.setColor(scene.getPosition(size-2).getModel(), new Color(50, 50, 50));
scene.getPosition(size - 1).getMatrix().mult( Matrix.translate(0, -1,  0) );// floor
ModelShading.setColor(scene.getPosition(size-1).getModel(), new Color(50, 50, 50));

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
   mod.setNumberInteractiveModels(scene.positionList.length-2);

   document.addEventListener("keypress", mod.handleKeyInput);
   document.addEventListener("keydown", mod.overrideDefault);
   const resizer = new ResizeObserver(mod.windowResized);
   resizer.observe(document.getElementById("resizer"));    
}
