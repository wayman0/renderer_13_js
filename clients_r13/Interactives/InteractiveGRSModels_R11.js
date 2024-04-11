//@ts-check

import {default as GRS} from "../../renderer/models_L/GRSModel.js";
import {Scene, Position} from "../../renderer/scene/SceneExport.js";
import { setRandomColor } from "../../renderer/scene/util/ModelShading.js";
import { Color } from "../../renderer/framebuffer/FramebufferExport.js";
import {Axes2D} from "../../renderer/models_L/ModelsExport.js";
import {currentModel, display, handleKeyDown, handleKeyPress, numberOfInteractiveModels, printHelpMessage, 
        scene, 
        setDebugWholeScene, setInteractiveModelsAllVis, setNumInteractiveMod, setScene} from "./InteractiveAbstractClient_R11.js";

const assets = "../../assets/";

setScene(Scene.buildFromName("InteractiveGRSModels_R11"));

scene.addPosition(Position.buildFromModel(await GRS(assets + "grs/bronto_v2.grs")));
scene.addPosition(Position.buildFromModel(await GRS(assets + "grs/rex_v2.grs")));
scene.addPosition(Position.buildFromModel(await GRS(assets + "grs/usa_v2.grs")));
scene.addPosition(Position.buildFromModel(await GRS(assets + "grs/bronto.grs")));
scene.addPosition(Position.buildFromModel(await GRS(assets + "grs/rex.grs")));
scene.addPosition(Position.buildFromModel(await GRS(assets + "grs/usa.grs")));
scene.addPosition(Position.buildFromModel(await GRS(assets + "grs/vinci.grs")));
scene.addPosition(Position.buildFromModel(await GRS(assets + "grs/dragon.grs")));
scene.addPosition(Position.buildFromModel(await GRS(assets + "grs/birdhead.grs")));
scene.addPosition(Position.buildFromModel(await GRS(assets + "grs/knight.grs")));
scene.addPosition(Position.buildFromModel(await GRS(assets + "grs/house.grs")));
scene.addPosition(Position.buildFromModel(await GRS(assets + "grs/scene.grs")));

for(const p of scene.positionList)
    setRandomColor(p.model);

const axes = new Axes2D(-1, 1, -1, 1, 20, 20, Color.red);
const axesP = Position.buildFromModel(axes);
scene.addPosition(axesP);

setNumInteractiveMod(scene.positionList.length -1)
for(let i = 0; i < numberOfInteractiveModels; ++i)
    scene.getPosition(i).visible = false;

scene.getPosition(currentModel).visible = true;

setInteractiveModelsAllVis(false);
setDebugWholeScene(false);
document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keypress", handleKeyPress);
const resizer = new ResizeObserver(display);
resizer.observe(document.getElementById("resizer"));

printHelpMessage();

