//@ts-check
import {Matrix, Model, Position, Scene} from "../../renderer/scene/SceneExport.js";
import {make} from '../../renderer/scene/util/PointCloud.js';
import {SierpinskiSponge, SierpinskiTriangle} from '../../renderer/models_L/ModelsExport.js';
import {setRandomColor, setRandomNestedModelColors} from "../../renderer/scene/util/ModelShading.js";
import {currentModel, display, handleKeyDown, handleKeyPress, printHelpMessage, scale, 
        scene, setCurrentModel, setDebugWholeScene, 
        setInteractiveModelsAllVis, setNumInteractiveMod, 
        setPrintHelpMessageFunc, setScene, setTransformationsFunc, 
        xRotation, xTranslation, yRotation, yTranslation, 
        zRotation, zTranslation} from "./InteractiveAbstractClient_R12a.js";

let xSubRotation1 = false;
let xSubRotation2 = false;
let ySubRotation1 = false;
let ySubRotation2 = false;
let zSubRotation1 = false;
let zSubRotation2 = false;

setScene(Scene.buildFromName("InteractiveSponges_R12a"));

scene.addPosition(Position.buildFromModelName(new SierpinskiSponge(5), "SierpinskiSponge"));
scene.addPosition(Position.buildFromModelName(make(new SierpinskiSponge(7)), "SierpinskiSponge"));
scene.addPosition(Position.buildFromModelName(new SierpinskiTriangle(7), "SierpinskiTriangle"));
scene.addPosition(Position.buildFromModelName(make(new SierpinskiSponge(9)), "SierpinskiTriangle"));

for(const p of scene.positionList)
    setRandomColor(p.model);

for(const p of  scene.positionList)
    p.visible = false;

setNumInteractiveMod(scene.positionList.length);
setCurrentModel(0);
scene.getPosition(currentModel).visible = true;
setInteractiveModelsAllVis(false);
setDebugWholeScene(true);

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keypress", handleKeyPress);
const resizer = new ResizeObserver(display);
resizer.observe(document.getElementById('resizer'));

setTransformationsFunc(newTransformations);
setPrintHelpMessageFunc(newPrintHelp);
printHelpMessage();

function newTransformations(e)
{
    const c = e.key;

    if ('=' == c)
    {
       scale[0] = 1.0;
       xTranslation[0] = 0.0;
       yTranslation[0] = 0.0;
       zTranslation[0] = 0.0;
       xRotation[0] = 0.0;
       yRotation[0] = 0.0;
       zRotation[0] = 0.0;
    }
    else if ('s' == c) // Scale the model 10% smaller.
    {
       scale[0] /= 1.1;
    }
    else if ('S' == c) // Scale the model 10% larger.
    {
       scale[0] *= 1.1;
    }
    else if ('x' == c)
    {
       xTranslation[0] -= 0.1;
    }
    else if ('X' == c)
    {
       xTranslation[0] += 0.1;
    }
    else if ('y' == c)
    {
       yTranslation[0] -= 0.1;
    }
    else if ('Y' == c)
    {
       yTranslation[0] += 0.1;
    }
    else if ('z' == c)
    {
       zTranslation[0] -= 0.1;
    }
    else if ('Z' == c)
    {
       zTranslation[0] += 0.1;
    }
    else if ('u' == c)
    {
       xRotation[0] -= 2.0;
    }
    else if ('U' == c)
    {
       xRotation[0] += 2.0;
    }
    else if ('v' == c)
    {
       yRotation[0] -= 2.0;
    }
    else if ('V' == c)
    {
       yRotation[0] += 2.0;
    }
    else if ('w' == c)
    {
       zRotation[0] -= 2.0;
    }
    else if ('W' == c)
    {
       zRotation[0] += 2.0;
    }
    else if ('3' == c)
    {
       xSubRotation1 = true;
    }
    else if ('#' == c)
    {
       xSubRotation2 = true;
    }
    else if ('4' == c)
    {
       ySubRotation1 = true;
    }
    else if ('$' == c)
    {
       ySubRotation2 = true;
    }
    else if ('5' == c)
    {
       zSubRotation1 = true;
    }
    else if ('%' == c)
    {
       zSubRotation2 = true;
    }
    else if ('6' == c)
    {
       setRandomNestedModelColors(scene.positionList[currentModel].model);
    }

    // Update the nested matrices within the hierarchical model.
    let mat = Matrix.identity();

    if (xSubRotation1)
       mat = Matrix.rotateX(2.0);
    else if (xSubRotation2)
       mat = Matrix.rotateX(-2.0);
    else if (ySubRotation1)
       mat = Matrix.rotateY(2.0);
    else if (ySubRotation2)
       mat = Matrix.rotateY(-2.0);
    else if (zSubRotation1)
       mat = Matrix.rotateZ(2.0);
    else if (zSubRotation2)
       mat = Matrix.rotateZ(-2.0);

    xSubRotation1 = false;
    xSubRotation2 = false;
    ySubRotation1 = false;
    ySubRotation2 = false;
    zSubRotation1 = false;
    zSubRotation2 = false;

    updateNestedMatrices(scene.getPosition(currentModel).model, mat);

    // Set the model-to-view transformation matrix.
    // The order of the transformations is very important!
    scene.setPosition(currentModel,
             scene.getPosition(currentModel).transform(
                      Matrix.translate(xTranslation[0],
                                       yTranslation[0],
                                       zTranslation[0])
              .timesMatrix(Matrix.rotateX(xRotation[0]))
              .timesMatrix(Matrix.rotateY(yRotation[0]))
              .timesMatrix(Matrix.rotateZ(zRotation[0]))
              .timesMatrix(Matrix.scale(scale[0]))));
}

/**
 * 
 * @param {Model} model 
 * @param {Matrix} matrix 
 */
function updateNestedMatrices(model, matrix)
{
    for(let i = 0; i < model.nestedModels.length; ++i)
    {    
        const mat = model.getNestedModel(i).matrix.timesMatrix(matrix);
        model.setNestedModel(i, model.getNestedModel(i).transform(mat));
    }

    for(const m of model.nestedModels)
        updateNestedMatrices(m, matrix);
}

function newPrintHelp()
{
    console.log("Use the 'd/D' keys to toggle debugging information on and off for the current model.");
    console.log("Use the '1' and '2' keys to switch between the two renderers.");
    console.log("Use the '/' and '?' keys to cycle forwards and backwards through the sponges.");
    console.log("Use the '>/<' keys to increase and decrease the depth of the sponge.");
    console.log("Use the 'i/I' keys to get information about the current model.");
    console.log("Use the 3/#, 4/$, 5/%, keys to rotate the sub-sponges around the x, y, z axes.");
    console.log("Use the '6' key to change the random solid sub-sponge colors.");
    console.log("Use the 'p' key to toggle between parallel and orthographic projection.");
    console.log("Use the x/X, y/Y, z/Z, keys to translate the sponge along the x, y, z axes.");
    console.log("Use the u/U, v/V, w/W, keys to rotate the sponge around the x, y, z axes.");
    console.log("Use the s/S keys to scale the size of the sponge.");
    console.log("Use the 'm' key to toggle the display of matrix information.");
    console.log("Use the '=' key to reset the model matrix.");
    console.log("Use the 'c' key to change the random solid sponge color.");
    console.log("Use the 'C' key to randomly change sponge's colors.");
    console.log("Use the 'e' key to change the random solid edge colors.");
    console.log("Use the 'E' key to change the random edge colors.");
    console.log("Use the 'Alt-e' key combination to change the random vertex colors.");
    console.log("Use the 'a' key to toggle anti-aliasing on and off.");
    console.log("Use the 'g' key to toggle gamma correction on and off.");
    console.log("Use the 'b' key to toggle near plane clipping on and off.");
    console.log("Use the n/N keys to move the camera's near plane.");
    console.log("Use the f/F keys to change the camera's field-of-view (keep AR constant.");
    console.log("Use the r/R keys to change the camera's aspect ratio (keep fov constant).");
    console.log("Use the 'l' key to toggle letterboxing viewport on and off.");
    console.log("Use alt + x/X, y/Y, z/Z keys to translate the camera along the x, y, z axis.");
    console.log("Use alt + x/X, y/Y, z/Z keys to rotate the camera around the x, y, z axis.");
    console.log("Use alt + s/S keys to zoom the camera in and out of the scene.");
    console.log("Use the 'M' key to toggle showing the Camera data.");
    console.log("Use the '*' key to show window data.");
    console.log("Use the 'P' key to convert the current model to a point cloud.");
    console.log("Use the '+' key to save a \"screenshot\" of the framebuffer.");
    console.log("Use the 'h' key to redisplay this help message.");
}


