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

const path = "../assets/grs/";

// create the scene
const scene = Scene.buildFromName("GRS Models");

// create the axes model and position
const axes = new Axes2D(-1, 1, -1, 1, 20, 20);
const axesPos = new Position(axes, Matrix.translate(0, 0, -1), "Axes");

// create all the grs positions
const birdhead   = Position.buildFromName("Bird Head");
const brontov2   = Position.buildFromName("Bronto v2");
const bronto     = Position.buildFromName("Bronto");
const dragon     = Position.buildFromName("Dragon");
const house      = Position.buildFromName("House");
const knight     = Position.buildFromName("Knight");
const kochcurve  = Position.buildFromName("Kochcurve");
const monkeytree = Position.buildFromName("Monkey Tree");
const rexv2      = Position.buildFromName("Rex v2");
const rex        = Position.buildFromName("Rex");
const scenePos   = Position.buildFromName("Scene");
const usav2      = Position.buildFromName("Usa v2");
const usa        = Position.buildFromName("Usa");
const vinci      = Position.buildFromName("Vinci");

// add the positions
scene.addPosition(birdhead, bronto, brontov2, 
                  dragon, house, knight, 
                  kochcurve,  monkeytree, 
                  rex, rexv2, scenePos, 
                  usa, usav2, vinci);
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
        async function getGRS()
        {
            return await import ("../renderer/models_L/GRSModel.js");
        }

        async function getInteractiveUtilites()
        {
            return await import ("./InteractiveAbstractClient_R10.js");
        }

        runOnline(await getGRS(), await getInteractiveUtilites());
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
        async function getGRS()
        {
            return await import ("../renderer/models_L/GRSModelNode.js");
        }

        runOffline(await getGRS());

    }
    catch(err)
    {
        console.log(err);
    }
}

function setPosMatrixes()
{
    for(const pos of scene.positionList)
        pos.setMatrix(Matrix.translate(0, 0, -1));
}

function hidePositions()
{
    for(const pos of scene.positionList)
        pos.visible = false;

    axesPos.visible = true;    
}

/*
can use this function once the online and offline grsmodules 
are implemented the same, either as a class or as a function.

function setPosModels(grsModule)
{
    // set the models
    birdhead.setModel(grsModule.buildGrsModel("birdhead.grs"));
    brontov2.setModel(grsModule.buildGrsModel("bronto_v2.grs"));
    bronto.setModel(grsModule.buildGrsModel("bronto.grs"));
    dragon.setModel(grsModule.buildGrsModel("dragon.grs"));
    house.setModel(grsModule.buildGrsModel("house.grs"));
    knight.setModel(grsModule.buildGrsModel("knight.grs"));
    kochcurve.setModel(grsModule.buildGrsModel("kochcurve.grs"));
    monkeytree.setModel(grsModule.buildGrsModel("monkeytree.grs"));
    rexv2.setModel(grsModule.buildGrsModel("rex_v2.grs"));
    rex.setModel(grsModule.buildGrsModel("rex.grs"));
    scenePos.setModel(grsModule.buildGrsModel("scene.grs"));
    usav2.setModel(grsModule.buildGrsModel("usa_v2.grs"));
    usa.setModel(grsModule.buildGrsModel("usa.grs"));
    vinci.setModel(grsModule.buildGrsModel("vinci.grs"));
}
*/

async function runOnline(grsModule, interUtilModule)
{
    //setPosModels(grsModule);

    // set the models
    birdhead.setModel(  await new grsModule.default(path + "birdhead.grs"));
    brontov2.setModel(  await new grsModule.default(path + "bronto_v2.grs"));
    bronto.setModel(    await new grsModule.default(path + "bronto.grs"));
    dragon.setModel(    await new grsModule.default(path + "dragon.grs"));
    house.setModel(     await new grsModule.default(path + "house.grs"));
    knight.setModel(    await new grsModule.default(path + "knight.grs"));
    kochcurve.setModel( await new grsModule.default(path + "kochcurve.grs"));
    monkeytree.setModel(await new grsModule.default(path + "monkeytree.grs"));
    rexv2.setModel(     await new grsModule.default(path + "rex_v2.grs"));
    rex.setModel(       await new grsModule.default(path + "rex.grs"));
    scenePos.setModel(  await new grsModule.default(path + "scene.grs"));
    usav2.setModel(     await new grsModule.default(path + "usa_v2.grs"));
    usa.setModel(       await new grsModule.default(path + "usa.grs"));
    vinci.setModel(     await new grsModule.default(path + "vinci.grs"));

    interUtilModule.setScene(scene);
    interUtilModule.setNumberInteractiveModels(scene.positionList.length -1);
    interUtilModule.setPushBack(-1);

    document.addEventListener("keypress", interUtilModule.handleKeyInput);
    const resizer = new ResizeObserver(interUtilModule.windowResized);
    resizer.observe(document.getElementById("resizer"));
}

async function runOffline(grsModule)
{
    //setPosModels(grsModule);

    // set the models
    birdhead.setModel(  await grsModule.default(path + "birdhead.grs"));
    brontov2.setModel(  await grsModule.default(path + "bronto_v2.grs"));
    bronto.setModel(    await grsModule.default(path + "bronto.grs"));
    dragon.setModel(    await grsModule.default(path + "dragon.grs"));
    // house gives me a color error
    house.setModel(     await grsModule.default(path + "house.grs"));
    knight.setModel(    await grsModule.default(path + "knight.grs"));
    kochcurve.setModel( await grsModule.default(path + "kochcurve.grs"));
    monkeytree.setModel(await grsModule.default(path + "monkeytree.grs"));
    rexv2.setModel(     await grsModule.default(path + "rex_v2.grs"));
    rex.setModel(       await grsModule.default(path + "rex.grs"));
    scenePos.setModel(  await grsModule.default(path + "scene.grs"));
    usav2.setModel(     await grsModule.default(path + "usa_v2.grs"));
    usa.setModel(       await grsModule.default(path + "usa.grs"));
    vinci.setModel(     await grsModule.default(path + "vinci.grs"));

/*
***WARNING: Added default color to model: GRS Model: ../assets/grs/house.grs.
file:///E:/Javascript%20Renderers/Javascript-Renderer-9v2/renderer_10_js/renderer/framebuffer/Color.js:106
                   throw new Error("Int data must be between 0 and 255 inclusive");
                         ^

Error: Int data must be between 0 and 255 inclusive
    at new Color (file:///E:/Javascript%20Renderers/Javascript-Renderer-9v2/renderer_10_js/renderer/framebuffer/Color.js:106:26)
    at interpolateNewVertex (file:///E:/Javascript%20Renderers/Javascript-Renderer-9v2/renderer_10_js/renderer/pipeline/NearClip_Line.js:146:22)
    at clip (file:///E:/Javascript%20Renderers/Javascript-Renderer-9v2/renderer_10_js/renderer/pipeline/NearClip_Line.js:73:16)
    at clip (file:///E:/Javascript%20Renderers/Javascript-Renderer-9v2/renderer_10_js/renderer/pipeline/NearClip.js:71:24)
    at renderPosition (file:///E:/Javascript%20Renderers/Javascript-Renderer-9v2/renderer_10_js/renderer/pipeline/Pipeline.js:150:24)
    at render (file:///E:/Javascript%20Renderers/Javascript-Renderer-9v2/renderer_10_js/renderer/pipeline/Pipeline.js:90:13)
    at renderFB (file:///E:/Javascript%20Renderers/Javascript-Renderer-9v2/renderer_10_js/renderer/pipeline/Pipeline.js:45:5)
    at runOffline (file:///E:/Javascript%20Renderers/Javascript-Renderer-9v2/renderer_10_js/clients_r10/InteractiveGRSModels_R10.js:201:13)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)

Node.js v18.13.0
*/
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

           fb.dumpFB2File(format("Interactive_GRS_Models_" + p.name + "_Frame%3d.ppm", rot/5));
           fb.clearFBDefault();
        }

        p.setMatrix(Matrix.translate(0, 0, -1));
        p.visible = false;
    }
}