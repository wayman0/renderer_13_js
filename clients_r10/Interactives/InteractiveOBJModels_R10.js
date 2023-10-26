/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import {Scene, Position, Matrix} from "../../renderer/scene/SceneExport.js";
import {Axes2D} from "../../renderer/models_L/ModelsExport.js";
import * as ModelShading from "../../renderer/scene/util/UtilExport.js";
import {FrameBuffer, Color} from "../../renderer/framebuffer/FramebufferExport.js";
import {renderFB} from "../../renderer/pipeline/PipelineExport.js";
import {format} from "../../renderer/scene/util/UtilExport.js";

const path = "../../assets/";

// create the scene
const scene = Scene.buildFromName("OBJ Models");

// create the axes model and position
const axes = new Axes2D(-3, 3, -3, 3, 20, 20);
const axesPos = new Position(axes, Matrix.translate(0, 0, -1), "Axes");

// create all the obj positions
const apple     = Position.buildFromName("apple");
const cessna    = Position.buildFromName("cessna");
const cow       = Position.buildFromName("cow");
const galleon   = Position.buildFromName("galleon");
const greatRhom = Position.buildFromName("greatRhom");
const horse     = Position.buildFromName("horse");
const smallRhom = Position.buildFromName("smallRhom");
const stanBunny = Position.buildFromName("stanford bunny");
const teapot    = Position.buildFromName("teapot");

// add the positions
scene.addPosition(apple, cessna, cow, galleon, 
                  greatRhom, horse, smallRhom, 
                  stanBunny, teapot);
scene.addPosition(axesPos);

//set where the models should be
setPosMatrixes();

// hide all positions beside the axes
hidePositions();

let fb = new FrameBuffer(1024, 1024);

try
{
    async function getOBJ()
    {
        return await import ("../../renderer/models_L/OBJModel.js");
    }

    async function getInteractiveUtilites()
    {
        return await import ("./InteractiveAbstractClient_R10.js");
    }

    runOnline(await getOBJ(), await getInteractiveUtilites());
}
catch(err)
{
    console.log(err);
}

function setPosMatrixes()
{
    for(const pos of scene.positionList)
        pos.setMatrix(Matrix.translate(0, 0, -3));
}

function hidePositions()
{
    for(const pos of scene.positionList)
        pos.visible = false;

    axesPos.visible = true;    
}

function setModelColor()
{
    for(const p of scene.positionList)
        ModelShading.setColor(p.model, ModelShading.randomColor());
}

async function runOnline(objModule, interUtilModule)
{
    //setPosModels(objModule);

    // set the models
        apple.setModel(await new objModule.default(path + "apple.obj"));     
       cessna.setModel(await new objModule.default(path + "cessna.obj"));    
          cow.setModel(await new objModule.default(path + "cow.obj"));       
      galleon.setModel(await new objModule.default(path + "galleon.obj"));   
    greatRhom.setModel(await new objModule.default(path + "great_rhombicosidodecahedron.obj")); 
        horse.setModel(await new objModule.default(path + "horse.obj"));     
    smallRhom.setModel(await new objModule.default(path + "small_rhombicosidodecahedron.obj")); 
    stanBunny.setModel(await new objModule.default(path + "stanford_bunny.obj")); 
       teapot.setModel(await new objModule.default(path + "teapot.obj"));

    setModelColor();

    interUtilModule.setScene(scene);
    interUtilModule.setNumberInteractiveModels(scene.positionList.length -1);
    interUtilModule.setPushBack(-3);

    document.addEventListener("keypress", interUtilModule.handleKeyInput);
    const resizer = new ResizeObserver(interUtilModule.windowResized);
    resizer.observe(document.getElementById("resizer"));
}
