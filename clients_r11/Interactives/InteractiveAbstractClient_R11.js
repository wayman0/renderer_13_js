//@ts-check

import {Scene, Position, Matrix, Camera, Model, LineSegment, Point} from "../../renderer/scene/SceneExport.js";
import {make, format} from "../../renderer/scene/util/UtilExport.js";
import {FrameBuffer, Viewport, Color} from "../../renderer/framebuffer/FramebufferExport.js";
import {doAntiAliasing, doGamma, doNearClipping, rastDebug, render1, render2, renderFB1, renderFB2, setClipDebug, setDoAntiAliasing, setDoGamma, setDoNearClipping, setRastDebug} from "../../renderer/pipeline/PipelineExport.js";
import * as ModelShading from "../../renderer/scene/util/ModelShading.js";

export let cameraX = 0.0;
export let cameraY = 0.0;
export let cameraZ = 2.0;

export let letterbox = false;
export let aspectRatio = 1.0;
export let near = 0.1;
export let perspective = true;
export let fovy = 90.0;
export let showCamera = false;
export let showWindow = false;

export let showMatrix = false;
export const xTranslation = [0.0];
export const yTranslation = [0.0];
export const zTranslation = [0.0];
export const xRotation = [0.0];
export const yRotation = [0.0];
export const zRotation = [0.0];
export const scale = [1.0];

/**@type {Scene}*/        export let scene;
/**@type {FrameBuffer} */ export let fb;
export let numberOfInteractiveModels = 1;
export let interactiveModelsAllVisible = false;
export let debugWholeScene = true;
export let currentModel = 0;
let savedModel;
let pointSize = 0;

let useRenderer1 = true;

// create variables to allow the functions to be overriden
export let printHelpMessage = helpMessage;
export let handleKeyInput = keyInput;
export let setTransformations = transformations;
export let displayCamera = dispCamera;
export let displayMatrix = dispMatrix;
export let displayWindow = dispWindow;

/**
 * 
 * @param {Scene} s 
 */
export function setScene(s)
{
    if(s instanceof Scene)
        scene = s;
}

/**
 * @param {FrameBuffer} f
 */
export function setFB(f)
{
    if(f instanceof FrameBuffer)
        fb = f;
}

export function setShowCamera(val)
{
    if(typeof val != "boolean")
        throw new Error("Val needs to be a boolean");

    showCamera = val;
}

export function setShowWindow(val)
{
    if(typeof val != "boolean")
        throw new Error("Val needs to be a boolean");

    showWindow = val;
}

export function setShowMatrix(val)
{
    if(typeof val != "boolean")
        throw new Error("Val needs to be a boolean");

    showMatrix = val;
}

export function projPersp(val)
{
    if(typeof val != "boolean")
        throw new Error("Value must be a boolean");

    scene.camera.perspective = val;
}

export function setNear(val)
{
    if(typeof val != "number")
        throw new Error("Value must be a number");

    near = val;
}

export function setNumInteractiveMod(val)
{
    if(typeof val != "number")
        throw new Error("val must be a number");

    numberOfInteractiveModels = val;
}

export function setInteractiveModelsAllVis(val)
{
    if(typeof val != "boolean")
        throw new Error("Val must be a boolean");

    interactiveModelsAllVisible = val;
}

export function setDebugWholeScene(val)
{
    if(typeof val != "boolean")
        throw new Error("Val must be a boolean");

    debugWholeScene = val;
}

export function setCurrentModel(val)
{
    if(typeof val != "number")
        throw new Error("Val must be a number");

    currentModel = val;
}

export function setPrintHelpMessageFunc(func)
{
    if(func instanceof Function == false)
        throw new Error("Parameter must be a function");

    printHelpMessage = func;
}

export function setHandleKeyInputFunc(func)
{
    if(func instanceof Function == false)
        throw new Error("Parameter must be a function");

    handleKeyInput = func;
}

export function setTransformationsFunc(func)
{
    if(func instanceof Function == false)
        throw new Error("Parameter must be a function");

    setTransformations = func;
}

export function setDisplayMatrixFunc(func)
{
    if(func instanceof Function == false)
        throw new Error("Parameter must be a function");

    displayMatrix = func;
}

export function setDisplayWindowFunc(func)
{
    if(func instanceof Function == false)
        throw new Error("Parameter must be a function");

    displayWindow = func;
}

export function setDisplayCameraFunc(func)
{
    if(func instanceof Function == false)
        throw new Error("Parameter must be a function");

    displayCamera = func;
}

export function setUpViewing()
{
    let camera1 = new Camera();
    if(perspective)
        camera1.projPerspectiveFOVY(fovy, aspectRatio);
    else
        camera1.projOrthoFOVY(fovy, aspectRatio);

    const camera2 = camera1.changeNear(near);
    const camera3 = camera2.translate(cameraX, cameraY, cameraZ);

    scene = scene.changeCamera(camera3);

    const resizerEl = document.getElementById("resizer");
    const w = resizerEl.offsetWidth;
    const h = resizerEl.offsetHeight;

    const canv = document.getElementById("pixels");
    canv.width = w;
    canv.height = h;

    fb = new FrameBuffer(w, h, Color.gray.darker().darker());

    if(letterbox)
    {
        if(aspectRatio < w/h)
        {
            const width = h * aspectRatio;
            const xOffset = (w-width)/2;
            fb.setViewport(width, h, xOffset, 0, Color.black);
        }
        else
        {
            const height = w/aspectRatio;
            const yOffset = (h-height)/2;
            fb.setViewport(w, height, 0, yOffset, Color.black);
        }
    }
    else
    {
        fb.setViewportDefault();
        fb.vp.clearVP(Color.black);
    }
}

export function display()
{
    setUpViewing();

    const canv = document.getElementById("pixels");

    if(useRenderer1)
        render1(scene, fb.vp);
    else
        render2(scene, fb.vp);

    const ctx = canv.getContext("2d");
    ctx.putImageData(new ImageData(fb.pixelBuffer, fb.width, fb.height), 0, 0);
}

export function keyInput(e)
{    
    const keyCode = e.keyCode;
    const ctrl = e.ctrlKey;
    const uCode = 38;
    const dCode = 40;
    const rCode = 39;
    const lCode = 37;

    if( uCode == keyCode || dCode == keyCode ||
        rCode == keyCode || lCode == keyCode)
    {
        if(ctrl)
        {
            e.preventDefault();

            if(uCode == keyCode)
                cameraZ -= .1;
            else if(dCode == keyCode)
                cameraZ += .1;
        }
        else
        {
            if(uCode == keyCode)
                cameraY += .1;
            else if(dCode == keyCode)
                cameraY -= .1;
            else if(rCode == keyCode)
                cameraX += .1
            else if(lCode == keyCode)
                cameraX -= .1;
        }
    }

    const c = e.key;
    const alt = e.altKey;

    if('h' == c)
        printHelpMessage();
    else if('d' == c && alt)
    {
        e.preventDefault();
        console.log(scene.getPosition(currentModel).model.toString());
    }
    else if('d' == c)
    {
        if(debugWholeScene)
        {
            scene.debug = !scene.debug;
            setClipDebug(scene.debug);
        }
        else
        {
            const p = scene.getPosition(currentModel);
            p.debug = !p.debug;
            setClipDebug(p.debug);
        }
    }
    else if('D' == c)
        setRastDebug(!rastDebug);
    else if('i' == c)
    {
        const modelInfo = modelInfo(scene.getPosition(currentModel).model);
        console.log("The current Model has: ");
        console.log(format("%d vertices, ", modelInfo[0]));
        console.log(format("%d Point primitives, ", modelInfo[1]));
        console.log(format("%d, Line Segments. ", modelInfo[2]));
    }
    else if('1' == c)
    {    
        useRenderer1 = true;
        console.log("Using Pipeline1");
    }
    else if('2' == c)
    {
        useRenderer1 = false;
        console.log("Using Pipeline2");
    }
    else if('/' == c)
    {
        scene.getPosition(currentModel).visible = interactiveModelsAllVisible;
        currentModel = (currentModel + 1) % numberOfInteractiveModels;
        scene.getPosition(currentModel).visible = true;
        savedModel = undefined;
        pointSize = 0;
    }
    else if('?' == c)
    {
        scene.getPosition(currentModel).visible = interactiveModelsAllVisible;
        currentModel = (currentModel-1)%numberOfInteractiveModels;
        scene.getPosition(currentModel).visible = true;
        savedModel = undefined;
        pointSize = 0;
    }
    else if('a' == c)
    {
        setDoAntiAliasing(!doAntiAliasing);
        console.log("Anti-aliasing is turned: " + doAntiAliasing ?"On":"Off");
    }
    else if('g' == c)
    {
        setDoGamma(!doGamma);
        console.log("Gamma Correction is turned: " + doGamma?"On":"Off");
    }
    else if('p' == c)
    {
        perspective = !perspective;
        console.log("Using " + perspective?"perspective":"orthographic" + " projection");
    }
    else if('P' == c)
    {
        if(savedModel != undefined)
        {
            scene.setPosition(currentModel, 
                scene.getPosition(currentModel).changeModel(savedModel));
            savedModel = undefined;
            ++pointSize;
        }
        else
        {
            const model = scene.getPosition(currentModel).model;
            savedModel = model;
            scene.setPosition(currentModel, 
                scene.getPosition(currentModel).changeModel(make(model, pointSize)));
        }
    }
    else if('l' == c)
    {
        letterbox = !letterbox;
        console.log("Letterboxing is turned: " + letterbox?"On":"Off");
    }
    else if('n' == c)
        near -= 0.01;
    else if('N' == c)
        near += 0.01;
    else if('b' == c)
    {
        setDoNearClipping(!doNearClipping);
        console.log("Near-plane clipping is turned: " + doNearClipping?"On":"Off");
    }
    else if('r' == c)
        aspectRatio -= 0.01;
    else if('R' == c)
        aspectRatio += 0.01;
    else if('f' == c)
        fovy -= 0.5;
    else if('F' == c)
        fovy += 0.5;
    else if('M' == c)
        showCamera = !showCamera;
    else if('m' == c)
        showMatrix = !showMatrix;
    else if('c' == c)
        ModelShading.setRandomColor(scene.getPosition(currentModel).model);
    else if('e' == c && alt)
    {
        e.preventDefault();
        ModelShading.setRandomVertexColor(scene.getPosition(currentModel).model);
    }
    else if('e' == c)
        ModelShading.setRandomPrimitiveColor(scene.getPosition(currentModel).model);
    else if('E' == c)
        ModelShading.setRainbowPrimitiveColors(scene.getPosition(currentModel).model);
    else if('*' == c)
        showWindow = !showWindow;

    setTransformations(e);
    displayMatrix(e);
    displayCamera(e);
    displayWindow(e);
    setUpViewing();
    display();
}

export function transformations(e)
{
    const c = e.key;

    if('=' == c)
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
       scale[0] /= 1.1;
    else if ('S' == c) // Scale the model 10% larger.
       scale[0] *= 1.1;
    else if ('x' == c)
       xTranslation[0] -= 0.1;
    else if ('X' == c)
       xTranslation[0] += 0.1;
    else if ('y' == c)
       yTranslation[0] -= 0.1;
    else if ('Y' == c)
       yTranslation[0] += 0.1;
    else if ('z' == c)
       zTranslation[0] -= 0.1;
    else if ('Z' == c)
       zTranslation[0] += 0.1;
    else if ('u' == c)
       xRotation[0] -= 2.0;
    else if ('U' == c)
       xRotation[0] += 2.0;
    else if ('v' == c)
       yRotation[0] -= 2.0;
    else if ('V' == c)
       yRotation[0] += 2.0;
    else if ('w' == c)
       zRotation[0] -= 2.0;
    else if ('W' == c)
       zRotation[0] += 2.0;

    const matrix = Matrix.translate(xTranslation[0], 
                                    yTranslation[0], 
                                    zTranslation[0])
        .timesMatrix(Matrix.rotateZ(zRotation[0]))
        .timesMatrix(Matrix.rotateY(yRotation[0]))
        .timesMatrix(Matrix.rotateX(xRotation[0]))
        .timesMatrix(Matrix.scale(scale[0]));

    scene.setPosition(currentModel, 
        scene.getPosition(currentModel).transform(matrix));
}

export function dispMatrix(e)
{
    const c = e.key;

    if (showMatrix && 
        ('m' == c || '=' == c || 
         's' == c || 'S' == c ||
         'x' == c || 'y' == c || 'z' == c ||
         'u' == c || 'v' == c || 'w' == c ||
         'X' == c || 'Y' == c || 'Z' == c || 
         'U' == c || 'V' == c || 'W' == c))
    {
        console.log(format("xRot = %0.5f, " + 
                           "yRot = %0.5f, " + 
                           "zRot = %0.5f\n", 
                           xRotation[0], 
                           yRotation[0], 
                           zRotation[0]));

        console.log(scene.getPosition(currentModel).matrix.toString());
    }
}

export function dispCamera(e)
{
    const c = e.key;

    if(showCamera && ('p' == c ||
         'm' == c || 'M' == c ||
         'n' == c || 'N' == c ||
         'f' == c || 'F' == c ||
         'r' == c || 'R' == c ||
        ('b' == c && doNearClipping)))
    {
        console.log(scene.camera.toString());
    }

    const keyCode = e.keyCode;
    const uCode = 38;
    const dCode = 40;
    const rCode = 39;
    const lCode = 37;
    if(showCamera && ( uCode == keyCode 
                    || dCode == keyCode 
                    || rCode == keyCode
                    || lCode == keyCode))
    {
        console.log("Camera Location: " + scene.camera.getViewVector().toString());
    }
}

export function dispWindow(e)
{
    if(showWindow)
    {
        const resizerEl = document.getElementById("resizer");
        const wRes = resizerEl.offsetWidth;
        const hRes = resizerEl.offsetHeight;
        
        const canvas = document.getElementById("pixels");
        const wCan = canvas.width;
        const hCan = canvas.height;

        const wFB = fb.width;
        const hFB = fb.height;

        const wVP = fb.vp.width;
        const hVP = fb.vp.height;

        const vpULX = fb.vp.vp_ul_x;
        const vpULY = fb.vp.vp_ul_y;

        const c = scene.camera;
        const wVR = c.right - c.left;
        const hVR = c.top - c.bottom;

        const rRes = wRes/hRes;
        const rCan = wCan/hCan;
        const rFB = wFB/hFB;
        const rVP = wVP/hVP;
        const rCam = wVR/hVR;

        const formatStr = format("Window Information: \n" + 
                                 "Resizer     [w=%4d, h=%4d], aspect ration = %.2f\n" +
                                 "Canvas      [w=%4d, h=%4d], aspect ration = %.2f\n" +
                                 "FrameBuffer [w=%4d, h=%4d], aspect ration = %.2f\n" +
                                 "Viewport    [w=%4d, h=%4d, x=%d, y=%d], aspect ration = %.2f\n" +
                                 "Camera      [w=%4d, h=%4d], aspect ration = %.2f\n", 
                                  wRes,  hRes,              rRes,
                                  wCan,  hCan,              rCan,
                                  wFB,   hFB,               rFB, 
                                  wVP,   hVP, vpULX, vpULY, rVP, 
                                  wVR,   hVR,               rCam);
        console.log(formatStr);
        showWindow = false;
    }
}

export function helpMessage()
{
    console.log("Use the 'd/D' keys to toggle debugging information on and off for the current model.");
    console.log("Use the 'Alt-d' key combination to print the current Model data structure.");
    console.log("Use the '1' and '2' keys to switch between the two renderers.");
    console.log("Use the '/' and '?' keys to cycle forwards and backwards through the models.");
    console.log("Use the '>/<' and shift keys to increase and decrease the mesh divisions in each direction.");
    console.log("Use the 'i/I' keys to get information about the current model.");
    console.log("Use the 'p' key to toggle between parallel and orthographic projection.");
    console.log("Use the x/X, y/Y, z/Z, keys to translate the model along the x, y, z axes.");
    console.log("Use the u/U, v/V, w/W, keys to rotate the model around the x, y, z axes.");
    console.log("Use the s/S keys to scale the size of the model.");
    console.log("Use the 'm' key to toggle the display of matrix information.");
    console.log("Use the '=' key to reset the model matrix.");
    console.log("Use the 'c' key to change the random solid model color.");
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
    console.log("Use the arrow keys to translate the camera location left/right/up/down.");
    console.log("Use CTRL arrow keys to translate the camera forward/backward.");
    console.log("Use the 'M' key to toggle showing the Camera data.");
    console.log("Use the '*' key to show window data.");
    console.log("Use the 'P' key to convert the current model to a point cloud.");
    console.log("Use the 'h' key to redisplay this help message.");   
}

/**
 * 
 * @param {Model} model 
 * @return {Array} 
 */
function modelInfo(model)
{
    let verts = model.vertexList.length;
    let point = 0;
    let lineSegment = 0;

    for(const p of model.primitiveList)
    {
        if(p instanceof Point)
            ++point;
        else if(p instanceof LineSegment)
            ++lineSegment;
    }

    for(const m of model.nestedModels)
    {
        const info = modelInfo(m);
        verts += info[0];
        point += info[1];
        lineSegment += info[2];
    }

    return [verts, point, lineSegment];
}
