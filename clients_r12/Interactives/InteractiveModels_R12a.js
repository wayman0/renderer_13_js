//@ts-check
import {Scene, Position, Matrix} from '../../renderer/scene/SceneExport.js';
import {default as OBJ} from "../../renderer/models_L/OBJModel.js";
import {Cube2, Cylinder, PanelXY, PanelXZ, Sphere, Torus} from "../../renderer/models_L/ModelsExport.js";
import { setRandomColor } from '../../renderer/scene/util/ModelShading.js';
import {currentModel, display, handleKeyDown, handleKeyPress, numberOfInteractiveModels, 
        printHelpMessage, scale, setCurrentModel, setDebugWholeScene, 
        setDisplayMatrixFunc, setInteractiveModelsAllVis, setNumInteractiveMod, 
        setPrintHelpMessageFunc, setScene, setTransformationsFunc, showMatrix, 
        xTranslation, yTranslation, zTranslation, xRotation, yRotation, zRotation, scene} from './InteractiveAbstractClient_R12a.js';

const assets = "../../assets/";

setScene(Scene.buildFromName("InteractiveModels_R12a"));

scene.addPosition(Position.buildFromModel(await OBJ(assets + "apple.obj")));
scene.addPosition(Position.buildFromModel(await OBJ(assets + "cow.obj")));
scene.addPosition(Position.buildFromModel(await OBJ(assets + "teapot.obj")));
scene.addPosition(Position.buildFromModel(await OBJ(assets + "galleon.obj")));
scene.addPosition(Position.buildFromModel(await OBJ(assets + "stanford_bunny.obj")));
scene.addPosition(Position.buildFromModel(await OBJ(assets + "cessna.obj")));

scene.addPosition(Position.buildFromModel(new Sphere(1, 30, 30)));
scene.addPosition(Position.buildFromModel(new Cylinder(0.5, 1.0, 20, 20)))
scene.addPosition(Position.buildFromModel(new Torus(0.75, 0.25, 25, 25)));
scene.addPosition(Position.buildFromModel(new Cube2(15, 15, 15)));

scene.addPosition(Position.buildFromModel(await OBJ(assets + "small_rhombicosidodecahedron.obj")));

scene.addPosition(Position.buildFromModel(new PanelXY(-7, 7, -1, 3)));
scene.addPosition(Position.buildFromModel(new PanelXZ(-7, 7, -3, 1)));

scene.addPosition(Position.buildFromModel(await OBJ(assets + "cessna.obj")));

for(const p of scene.positionList)
    setRandomColor(p.model);

setNumInteractiveMod(scene.positionList.length - 3);
for(let i = 0; i < numberOfInteractiveModels; ++i)
    scene.getPosition(i).visible = false;

setCurrentModel(1);
scene.getPosition(currentModel).visible = true;
setInteractiveModelsAllVis(false);
setDebugWholeScene(false);

const size = scene.positionList.length;
scene.setPosition(size-3, scene.getPosition(size-3).transform(Matrix.translate(0,  0, -3)));
scene.setPosition(size-2, scene.getPosition(size-2).transform(Matrix.translate(0, -1,  0)));
scene.setPosition(size-1, scene.getPosition(size-1).transform(Matrix.translate(3,  0,  0)));

xTranslation.length = numberOfInteractiveModels;
yTranslation.length = numberOfInteractiveModels;
zTranslation.length = numberOfInteractiveModels;
xRotation.length = numberOfInteractiveModels;
yRotation.length = numberOfInteractiveModels;
zRotation.length = numberOfInteractiveModels;
scale.length = numberOfInteractiveModels;

for(let index = 0; index < numberOfInteractiveModels; index += 1)
{
    xTranslation[index] = 0.0;
    yTranslation[index] = 0.0;
    zTranslation[index] = 0.0;
    xRotation[index] = 0.0;
    yRotation[index] = 0.0;
    zRotation[index] = 0.0;
    scale[index] = 1.0;   
}

setTransformationsFunc(newTransformations);
setDisplayMatrixFunc(newDisplayMatrix);
setPrintHelpMessageFunc(newPrintHelp);

printHelpMessage();

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keypress", handleKeyPress);
const resizer = new ResizeObserver(display);
resizer.observe(document.getElementById("resizer"));

function newTransformations(e)
{
    const c = e.key;

    if('=' == c)
    {
        //alert(scale[currentModel]);

        scale[currentModel] = 1.0;
        xTranslation[currentModel] = 0.0;
        yTranslation[currentModel] = 0.0;
        zTranslation[currentModel] = 0.0;
        xRotation[currentModel] = 0.0;
        yRotation[currentModel] = 0.0;
        zRotation[currentModel] = 0.0;
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


    const matrix = Matrix.translate(xTranslation[currentModel], 
                                    yTranslation[currentModel],
                                    zTranslation[currentModel])
                    .timesMatrix(Matrix.rotateZ(zRotation[currentModel]))
                    .timesMatrix(Matrix.rotateY(yRotation[currentModel]))
                    .timesMatrix(Matrix.rotateX(xRotation[currentModel]))
                    .timesMatrix(Matrix.scale(scale[currentModel]));
    
    scene.setPosition(currentModel, scene.getPosition(currentModel).transform(matrix));
}

function newDisplayMatrix(e)
{
    const c = e.key;

    if(showMatrix && ( 'm' == c || '=' == c || '/' == c || '?' == c 
                    || 's' == c || 'x' == c || 'y' == c || 'z' == c || 'u' == c || 'v' == c || 'w' == c
                    || 'S' == c || 'X' == c || 'Y' == c || 'Z' == c || 'U' == c || 'V' == c || 'W' == c))
    {
        console.log("Current model is " + currentModel + ".");
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
    console.log("Use the '/' and '?' keys to cycle forwards and backwards through the models.");
    console.log("Use the '>/<' and shift keys to increase and decrease the mesh divisions in each direction.");
    console.log("Use the 'i/I' keys to get information about the current model.");
    console.log("Use the 'p' key to toggle between parallel and orthographic projection.");
    console.log("Use the x/X, y/Y, z/Z, keys to translate the current model along the x, y, z axes.");
    console.log("Use the u/U, v/V, w/W, keys to rotate the current model around the x, y, z axes.");
    console.log("Use the s/S keys to scale the size of the current model.");
    console.log("Use the 'm' key to toggle the display of the current model's matrix information.");
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
    console.log("Use the f/F keys to change the camera's field-of-view (keep AR constant).");
    console.log("Use the r/R keys to change the camera's aspect ratio (keep fov constant).");
    console.log("Use the 'l' key to toggle letterboxing viewport on and off.");
    console.log("Use alt + x/X, y/Y, z/Z keys to translate the camera along the x, y, z axis.");
    console.log("Use alt + u/U, v/V, w/W keys to rotate the camera around the x, y, z, axis.");
    console.log("Use alt + s/S, keys to zoom the camera in and out of the scene.");
    console.log("Use the 'M' key to toggle showing the Camera data.");
    console.log("Use the '*' key to show window data.");
    console.log("Use the 'P' key to convert the current model to a point cloud.");
    console.log("Use the 'h' key to redisplay this help message.");
}

