//@ts-check
import {Scene, Position, Matrix} from "../../renderer/scene/SceneExport.js";
import {setRandomColor} from "../../renderer/scene/util/ModelShading.js";
import {Octahedron, TriangularPyramid} from "../../renderer/models_L/ModelsExport.js";
import {currentModel, defaultHandleKeyPress, display, 
        handleKeyDown, handleKeyPress, numberOfInteractiveModels, 
        printHelpMessage, scene, setCameraZ, setCurrentModel, 
        setDebugWholeScene, setDisplayMatrixFunc, 
        setHandleKeyPressFunc, setInteractiveModelsAllVis, 
        setNumInteractiveMod, setPrintHelpMessageFunc, 
        setTransformationsFunc, setScene, showMatrix, 
        xTranslation, yTranslation, zTranslation, 
        xRotation, yRotation, zRotation, scale} from './InteractiveAbstractClient_R12a.js';

const visibility = [0, 0];

setScene(Scene.buildFromName("Two Interactive Models_R12"));
scene.addPosition(new Position(new Octahedron(5), Matrix.identity(), "p1"));
scene.addPosition(new Position(new TriangularPyramid(), Matrix.identity(), "p2"));

for(const p of scene.positionList)
    setRandomColor(p.model);

setNumInteractiveMod(scene.positionList.length);
setCurrentModel(0);

scene.getPosition(0).visible = true;
scene.getPosition(1).visible = true;

setInteractiveModelsAllVis(true);
setDebugWholeScene(true);

xTranslation.length = numberOfInteractiveModels;
yTranslation.length = numberOfInteractiveModels;
zTranslation.length = numberOfInteractiveModels;
xRotation.length = numberOfInteractiveModels;
yRotation.length = numberOfInteractiveModels;
zRotation.length = numberOfInteractiveModels;
scale.length = numberOfInteractiveModels;

for(let x = 0; x < numberOfInteractiveModels; x += 1)
{
    xTranslation[x] = 0;
    yTranslation[x] = 0;
    zTranslation[x] = 0 

    xRotation[x] = 0; 
    yRotation[x] = 0;
    zRotation[x] = 0;

    scale[x] = 1;
}

setHandleKeyPressFunc(newKeyPress);
setTransformationsFunc(newTransformations);
setDisplayMatrixFunc(newDisplayMatrix);
setPrintHelpMessageFunc(newPrintHelp);

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keypress", handleKeyPress);
const resizer = new ResizeObserver(display);
resizer.observe(document.getElementById("resizer"));

printHelpMessage();

function newKeyPress(e)
{
    const c = e.key;

    if(';' == c)
    {
        ++visibility[currentModel];

        if(3 == visibility[currentModel])
            visibility[currentModel] = 0;
    }

    if(0 == visibility[currentModel])
    {
        scene.getPosition(currentModel).visible = true;
        scene.getPosition(currentModel).model.visible = true;
    }
    else if(1 == visibility[currentModel])
    {
        scene.getPosition(currentModel).visible = true;
        scene.getPosition(currentModel).model.visible = false;
    }
    else if(2 == visibility[currentModel])
        scene.getPosition(currentModel).visible = false;

    defaultHandleKeyPress(e);
}

function newTransformations(e)
{
    const c = e.key;

    if('=' == c)
    {
        scale[currentModel] = 1.0;
        xTranslation[currentModel] = 0;
        yTranslation[currentModel] = 0;
        zTranslation[currentModel] = 0;
        xRotation[currentModel] = 0;
        yRotation[currentModel] = 0;
        zRotation[currentModel] = 0;
    }
    else if('s' == c)
        scale[currentModel] /= 1.1;
    else if('S' == c)
        scale[currentModel] *= 1.1;
    else if('x' == c)
        xTranslation[currentModel] -= 0.1;
    else if('X' == c)
        xTranslation[currentModel] += 0.1;
    else if('y' == c)
        yTranslation[currentModel] -= 0.1;
    else if('Y' == c)
        yTranslation[currentModel] += 0.1;
    else if('z' == c)
        zTranslation[currentModel] -= 0.1;
    else if('Z' == c)
        zTranslation[currentModel] += 0.1;
    else if('u' == c)
        xRotation[currentModel] -= 2.0;
    else if('U' == c)
        xRotation[currentModel] += 2.0;
    else if('v' == c)
        yRotation[currentModel] -= 2.0;
    else if('V' == c)
        yRotation[currentModel] += 2.0;
    else if('w' == c)
        zRotation[currentModel] -= 2.0;
    else if('W' == c)
        zRotation[currentModel] += 2.0;

    const mat = Matrix.translate(xTranslation[currentModel], 
                                 yTranslation[currentModel], 
                                 zTranslation[currentModel])
            .timesMatrix(Matrix.rotateZ(zRotation[currentModel]))
            .timesMatrix(Matrix.rotateY(yRotation[currentModel]))
            .timesMatrix(Matrix.rotateX(xRotation[currentModel]))
            .timesMatrix(Matrix.scale(scale[currentModel]));

    scene.setPosition(currentModel, scene.getPosition(currentModel).transform(mat));
}

function newDisplayMatrix(e)
{
    const c = e.key;
    
    if (showMatrix && ('m' == c || '=' == c || '/' == c || '?' == c 
                    || 's' == c || 'x' == c || 'y' == c || 'z' == c || 'u' == c || 'v' == c || 'w' == c
                    || 'S' == c || 'X' == c || 'Y' == c || 'Z' == c || 'U' == c || 'V' == c || 'W' == c))
  {
     console.log("Current model is " + currentModel +".");
     console.log("xRot = " + xRotation[currentModel]
                    + ", yRot = " + yRotation[currentModel]
                    + ", zRot = " + zRotation[currentModel]);
     console.log( scene.getPosition(currentModel).matrix );
  }
}

function newPrintHelp()
{
    console.log("Use the 'd/D' keys to toggle debugging information on and off for the current model.");
    console.log("Use the '1' and '2' keys to switch between the two renderers.");
    console.log("Use the '/' and '?' keys to cycle forwards and backwards through the two models.");
    console.log("Use the ';' key to cycle through the current model's visibility.");
    console.log("Use the '>/<' and shift keys to increase and decrease the mesh divisions in each direction.");
    console.log("Use the 'i/I' keys to get information about the current model.");
    console.log("Use the 'p' key to toggle between parallel and orthographic projection.");
    console.log("Use the x/X, y/Y, z/Z, keys to translate the current model along the x, y, z axes.");
    console.log("Use the u/U, v/V, w/W, keys to rotate the current model around the x, y, z axes.");
    console.log("Use the s/S keys to scale the size of the current model.");
    console.log("Use the 'm' key to toggle the display of the current model's matrix.");
    console.log("Use the '=' key to reset the current model's matrix.");
    console.log("Use the 'c' key to change the random solid model color.");
    console.log("Use the 'C' key to randomly change model's colors.");
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
    console.log("Use alt + s/S to zoom the camera in and out of the scene.");
    console.log("Use the 'M' key to toggle showing the Camera data.");
    console.log("Use the '*' key to show window data.");
    console.log("Use the 'P' key to convert the current model to a point cloud.");
    console.log("Use the 'h' key to redisplay this help message.");
}

