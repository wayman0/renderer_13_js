/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import {Scene, Model, Position, Matrix, Camera, Vertex} from "../renderer/scene/SceneExport.js";
import {Point, LineSegment} from "../renderer/scene/primitives/PrimitiveExport.js";
import {make as PointCloud} from "../renderer/scene/util/UtilExport.js";
import * as ModelShading from "../renderer/scene/util/UtilExport.js";
import {render, renderFB, clipDebug, setClipDebug, 
        rastDebug, setRastDebug, doAntiAliasing, setDoAntiAliasing, 
        doGamma, setDoGamma, doNearClipping, setDoNearClipping} from "../renderer/pipeline/PipelineExport.js"
import {FrameBuffer, Viewport, Color} from "../renderer/framebuffer/FramebufferExport.js";
import {format} from "../renderer/scene/util/UtilExport.js";


export let letterbox = false;
export let aspectRatio = 1.0;
export let near = 1.0;
export let fovy = 90.0;
export let showCamera = false;
export let showWindow = false;

export let showMatrix = false;
export let pushback = undefined;

// make these arrays to account for if there are multiple models
export let xTranslation = new Array()
export let yTranslation = new Array()
export let zTranslation = new Array()
export let xRotation = new Array();
export let yRotation = new Array();
export let zRotation = new Array();
export let scale = new Array();

export let scene;
export let numberOfInteractiveModels = 1;
export let interactiveModelsAllVisible = false;
export let debugWholeScene = true;
export let currentModel = 0;
export let savedModel;
export let pointSize = 0;

export let takeScreenshot = false;
export let screenshotNumber = 0;

export let fb = new FrameBuffer(100, 100, Color.black);

/**@param {Scene} s the scene to be used*/
export function setScene(s)
{
    scene = s;
}

export function setNumberInteractiveModels(num)
{
    numberOfInteractiveModels = num;

    for(let modIndex = 0; modIndex < numberOfInteractiveModels; modIndex += 1)
    {   
        xTranslation[modIndex] = 0;
        yTranslation[modIndex] = 0;
        zTranslation[modIndex] = 0;

        xRotation[modIndex] = 0;
        yRotation[modIndex] = 0;
        zRotation[modIndex] = 0;
        
        scale[modIndex] = 1;
    }
}

export function setPushBack(z)
{
    pushback = z;
}

export function setAspectRatio(asp)
{
    aspectRatio = asp;
}

export function setFOVY(fovy)
{
    fovy = fovy;
}

export function setNear(n)
{
    near = n;
}

export function handleKeyInput(e)
{
    const c = e.key;

    if('h' == c)
        printHelpMessage();
    else if('d' == c && e.altKey)
        console.log("\n" + scene.getPosition(currentModel).getModel().toString())
    else if('d' == c)//change the debug info
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
    else if('/' == c)
    {
        scene.getPosition(currentModel).visible = interactiveModelsAllVisible;
        currentModel = (currentModel + 1)%numberOfInteractiveModels;
        scene.getPosition(currentModel).visible = true;
        savedModel = null;
        pointSize = 0;
    }
    else if('?' == c)
    {
        scene.getPosition(currentModel).visible = interactiveModelsAllVisible;
        currentModel = currentModel - 1;

        if(currentModel < 0)
            currentModel = numberOfInteractiveModels -1;

        scene.getPosition(currentModel).visible = true;
        savedModel = null;
        pointSize == 0;
    }
    else if('a' == c)
    {
        setDoAntiAliasing(!doAntiAliasing);
        console.log("Anti aliasing is turned " + doAntiAliasing ? "On":"Off");
    }
    else if('g' == c)
    {
        setDoGamma(!doGamma);
        console.log("Gamma correction is turned " + doGamma ? "On":"Off");
    }
    else if('p' == c)
    {
        scene.getCamera().perspective = !scene.getCamera().perspective;
        const p = scene.getCamera().perspective ? "perspective":"orthographic";
        console.log("Using " + p + "projection");
    }
    else if('P' == c)
    {
        if(savedModel != null)
        {
            scene.getPosition(currentModel).setModel(savedModel);
            savedModel = null;
            ++pointSize;
        }
        else
        {
            const model = scene.getPosition(currentModel).getModel();
            savedModel = model;
            scene.getPosition(currentModel).setModel(PointCloud(model, pointSize));
        }
    }
    else if('l' == c)
    {
        letterbox = !letterbox;
        console.log("Letterboxing is turned " + letterbox ? "On":"Off");
    }
    else if('n' == c)
        near -= .01;
    else if('N' == c)
        near += .01;
    else if('b' == c)
    {
        setDoNearClipping(!doNearClipping);
        console.log("Near plane clipping is turned: " + doNearClipping ? "On":"Off");
    }
    else if('r' == c)
        aspectRatio -= .01;
    else if('R' == c)
        aspectRatio += .01;
    else if('f' == c)
        fovy -= .5;
    else if('F' == c)
        fovy += .5;
    else if('M' == c)
        showCamera = !showCamera;
    else if('m' == c)
        showMatrix = !showMatrix;
    else if('c' == c)
        ModelShading.setRandomColor(scene.getPosition(currentModel).getModel());
    else if('C' == c)
        ModelShading.setRandomColor(scene.getPosition(currentModel).getModel());
    else if('e' == c && e.altKey)
        ModelShading.setRandomVertexColor(scene.getPosition(currentModel).getModel());
    else if('e' == c)
        ModelShading.setRandomPrimitiveColor(scene.getPosition(currentModel).getModel());
    else if('E' == c)
        ModelShading.setRainbowPrimitiveColors(scene.getPosition(currentModel).getModel());
    else if('m' == c)
        showMatrix = !showMatrix;
    else if('k' == c)
        showWindow = !showWindow;
    else if('+' == c)
        takeScreenshot = true;

    setTransformations(c);
    displayMatrix(c);
    displayCamera(c);

    // these two depend on implementation in html
    //displayWindow(c);
    
    setUpViewing();
}

export function setTransformations(c)
{
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
        xTranslation[currentModel] -= .1;
    else if('X' == c)
        xTranslation[currentModel] += .1;
    else if('y' == c)
        yTranslation[currentModel] -= .1;
    else if('Y' == c)
        yTranslation[currentModel] += .1;
    else if('z' == c)
        zTranslation[currentModel] -= .1;
    else if('Z' == c)
        zTranslation[currentModel] += .1;
    else if('u' == c)
        xRotation[currentModel] -= 2;
    else if('U' == c)
        xRotation[currentModel] += 2;
    else if('v' == c)
        yRotation[currentModel] -= 2;
    else if('V' == c)
        yRotation[currentModel] += 2;
    else if('w' == c)
        zRotation[currentModel] -= 2;
    else if('W' == c)
        zRotation[currentModel] += 2;


    // round to the nearest tenth otherwise we get 
    // translate .999 or .799
    xTranslation[currentModel] = roundTenth(xTranslation[currentModel]);
    yTranslation[currentModel] = roundTenth(yTranslation[currentModel]);
    zTranslation[currentModel] = roundTenth(zTranslation[currentModel]);

    const modelP = scene.getPosition(currentModel);

    // if pushback wasn't set or isn't a number use the positions z translation
    if(pushback == undefined || typeof pushback != "number")
        pushback = modelP.getMatrix().v4.z;

    //@ts-ignore
    modelP.matrix2Identity().mult(Matrix.translate(0, 0, pushback))
                            .mult(Matrix.translate( xTranslation[currentModel], 
                                                    yTranslation[currentModel], 
                                                    zTranslation[currentModel]))
                            .mult(Matrix.rotateX(xRotation[currentModel]))
                            .mult(Matrix.rotateY(yRotation[currentModel]))
                            .mult(Matrix.rotateZ(zRotation[currentModel]))
                            .mult(Matrix.scale(scale[currentModel]));
}

export function displayMatrix(c)
{
    if(showMatrix &&
        (  'm' == c || '=' == c || 's' == c
        || 'x' == c || 'y' == c || 'z' == c
        || 'u' == c || 'v' == c || 'w' == c
        || 'X' == c || 'Y' == c || 'Z' == c
        || 'U' == c || 'V' == c || 'W' == c
        || 'S' == c))
    {
        console.log("xRot = % .5f, yRot = % .5f, zRot = % .5\n",
                    xRotation, yRotation, zRotation);
        console.log(scene.getPosition(currentModel).getMatrix().toString());
    }
}

export function displayCamera(c)
{
    if(showCamera &&
        ('M' == c || 'p' == c ||
         'n' == c || 'N' == c ||
         'f' == c || 'F' == c ||
         'r' == c || 'R' == c ||
         ('b' == c && doNearClipping) ))
            console.log(scene.getCamera().toString());
}

export function printHelpMessage()
{
    console.log("Use the 'd/D' keys to toggle debugging information on and off for the current model.");
    console.log("Use the '1' and '2' keys to switch between the two renderers.");
    console.log("Use the '/' and '?' keys to cycle forwards and backwards through the models.");
    console.log("Use the '>/<' and shift keys to increase and decrease the mesh divisions in each direction.");
    console.log("Use the 'p' key to toggle between parallel and orthographic projection.");
    console.log("Use the x/X, y/Y, z/Z, keys to translate the model along the x, y, z axes.");
    console.log("Use the u/U, v/V, w/W, keys to rotate the model around the x, y, z axes.");
    console.log("Use the s/S keys to scale the size of the model.");
    console.log("Use the 'm' key to toggle the display of matrix information.");
    console.log("Use the '=' key to reset the model matrix.");
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
    console.log("Use the 'M' key to toggle showing the Camera data.");
    console.log("Use the 'k' key to show window data.");
    console.log("Use the 'P' key to convert the current model to a point cloud.");
    console.log("Use the '+' key to save a \"screenshot\" of the framebuffer.");
    console.log("Use the 'h' key to redisplay this help message.");
}

export function windowResized()
{
    // Get the new size of the canvas
    const resizer = document.getElementById("resizer");
    const w = resizer?.offsetWidth;
    const h = resizer?.offsetHeight;

    // Create a new FrameBuffer that fits the canvas    
    const bg1 = fb.getBackgroundColorFB();
    const bg2 = fb.getViewport().getBackgroundColorVP();
    
    //@ts-ignore
    fb = new FrameBuffer(w, h, bg1);
    fb.vp.setBackgroundColorVP(bg2);
    
    setUpViewing();
}

export function setUpViewing()
{
    // Set up the camera's view volume.
    if (scene.getCamera().perspective)
       scene.getCamera().projPerspectiveFOVY(fovy, aspectRatio, near);
    else
       scene.getCamera().projOrthoFOVY(fovy, aspectRatio, near);

    // get the size of the resizer so we know what size to make the fb
    const resizer = document.getElementById("resizer");
    const w = resizer?.offsetWidth;
    const h = resizer?.offsetHeight;

    //@ts-ignore
    fb = new FrameBuffer(w, h, Color.black);

    // Create a viewport with the correct aspect ratio.
    if ( letterbox )
    {
        //@ts-ignore
        if ( aspectRatio <= w/h )
        {
            //@ts-ignore
            const width = (h * aspectRatio); const xOffset = (w - width) / 2;
            fb.setViewport(xOffset, 0, width, h);
        }
        else
        {
            //@ts-ignore
            const height = (w / aspectRatio); const yOffset = (h - height) / 2;
            fb.setViewport(0, yOffset, w, height);
        }

        fb.clearFBDefault();
        fb.vp.clearVPDefault();
    }
    else // The viewport is the whole framebuffer.
    {
        //@ts-ignore
        fb.setViewport(w, h, 0, 0);
        fb.vp.clearVPDefault();
    }

    render(scene, fb.vp);

    /*
    if (takeScreenshot)
    {
        fb.dumpFB2File(format("Screenshot%03d.png", screenshotNumber));
        ++screenshotNumber;
        takeScreenshot = false;
    }
    */
   
    // @ts-ignore
    const ctx = document.getElementById("pixels").getContext("2d");
    ctx.canvas.width = w;
    ctx.canvas.height = h;
    
    ctx.putImageData(new ImageData(fb.pixelBuffer, fb.width, fb.height), fb.vp.vp_ul_x, fb.vp.vp_ul_y);
}

function roundTenth(num)
{
    return Math.round(num * 10)/10;
}