/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import {Scene, Position, Matrix} from "../renderer/scene/SceneExport.js";
import {Axes2D} from "../renderer/models_L/ModelsExport.js";
import * as ModelShading from "../renderer/scene/util/UtilExport.js";
import {FrameBuffer, Color} from "../renderer/framebuffer/FramebufferExport.js";
import {renderFB} from "../renderer/pipeline/PipelineExport.js";
import {format} from "../renderer/scene/util/UtilExport.js";

const path = "../assets/";

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

// see if we are running offline or online
// so we know which import to use
try
{
    document;

    try
    {
        async function getOBJ()
        {
            return await import ("../renderer/models_L/OBJModel.js");
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
}
catch(e)
{
    try
    {
        async function getOBJ()
        {
            return await import ("../renderer/models_L/OBJModelNode.js");
        }

        runOffline(await getOBJ());

    }
    catch(err)
    {
        console.log(err);
    }
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

/*
can use this function once the online and offline grsmodules 
are implemented the same, either as a class or as a function.

function setPosModels(objModule)
{
    // set the models
    birdhead.setModel(objModule.buildGrsModel("birdhead.grs"));
    brontov2.setModel(objModule.buildGrsModel("bronto_v2.grs"));
    bronto.setModel(objModule.buildGrsModel("bronto.grs"));
    dragon.setModel(objModule.buildGrsModel("dragon.grs"));
    house.setModel(objModule.buildGrsModel("house.grs"));
    knight.setModel(objModule.buildGrsModel("knight.grs"));
    kochcurve.setModel(objModule.buildGrsModel("kochcurve.grs"));
    monkeytree.setModel(objModule.buildGrsModel("monkeytree.grs"));
    rexv2.setModel(objModule.buildGrsModel("rex_v2.grs"));
    rex.setModel(objModule.buildGrsModel("rex.grs"));
    scenePos.setModel(objModule.buildGrsModel("scene.grs"));
    usav2.setModel(objModule.buildGrsModel("usa_v2.grs"));
    usa.setModel(objModule.buildGrsModel("usa.grs"));
    vinci.setModel(objModule.buildGrsModel("vinci.grs"));
}
*/

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

async function runOffline(objModule)
{
    //setPosModels(objModule);

    // set the models
        apple.setModel(await objModule.default(path + "apple.obj"));     
       cessna.setModel(await objModule.default(path + "cessna.obj"));    
          cow.setModel(await objModule.default(path + "cow.obj"));       
      galleon.setModel(await objModule.default(path + "galleon.obj"));   
    greatRhom.setModel(await objModule.default(path + "great_rhombicosidodecahedron.obj")); 
        horse.setModel(await objModule.default(path + "horse.obj"));     
    smallRhom.setModel(await objModule.default(path + "small_rhombicosidodecahedron.obj")); 
    stanBunny.setModel(await objModule.default(path + "stanford_bunny.obj")); 
       teapot.setModel(await objModule.default(path + "teapot.obj"));

    setModelColor();

    for(let x = 0; x < scene.positionList.length-1; x += 1)
    {
        fb.clearFBDefault();

        const p = scene.getPosition(x);
        p.visible = true;
        
        for(let rot = 0; rot < 180; rot += 5)
        {
           p.setMatrix(Matrix.translate(0, 0, -1)
                             .mult(Matrix.rotateY(rot))
                             .mult(Matrix.rotateX(rot)));
           
            renderFB(scene, fb);

           fb.dumpFB2File(format("Interactive_OBJ_Models_" + p.name + "_Frame%3d.ppm", rot/5));
           fb.clearFBDefault();
        }

        p.setMatrix(Matrix.translate(0, 0, -1));
        p.visible = false;
    }
}