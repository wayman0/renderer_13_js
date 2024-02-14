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

const path = "../../assets/grs/";

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

try
{
    async function getGRS()
    {
        return await import ("../../renderer/models_L/GRSModel.js");
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

async function runOnline(grsModule, interUtilModule)
{
    //setPosModels(grsModule);

    // set the models
    birdhead.setModel(  await grsModule.default(path + "birdhead.grs"));
    brontov2.setModel(  await grsModule.default(path + "bronto_v2.grs"));
    bronto.setModel(    await grsModule.default(path + "bronto.grs"));
    dragon.setModel(    await grsModule.default(path + "dragon.grs"));
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

    interUtilModule.setScene(scene);
    interUtilModule.setNumberInteractiveModels(scene.positionList.length -1);
    interUtilModule.setPushBack(-1);

    document.addEventListener("keypress", interUtilModule.handleKeyInput);
    document.addEventListener("keydown", interUtilModule.overrideDefault);
    const resizer = new ResizeObserver(interUtilModule.windowResized);
    resizer.observe(document.getElementById("resizer"));
}