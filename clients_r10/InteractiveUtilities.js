/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import {doAntiAliasing, doGamma, setDoAntiAliasing, setDoGamma} from "../renderer/pipeline/PipelineExport.js";
import {make, setRainbowPrimitiveColors, setRandomPrimitiveColor, setRandomVertexColor, setRandomColor} from "../renderer/scene/util/UtilExport.js";
import {Matrix} from "../renderer/scene/SceneExport.js";
import {renderFB} from "../renderer/pipeline/PipelineExport.js";
import {FrameBuffer} from "../renderer/framebuffer/FramebufferExport.js";

let scene;
let fb;
let currPos = 0;
let z = -3;
let xTrans = 0;
let yTrans = 0;
let zTrans = 0;
let xRot = 0;
let yRot = 0;
let zRot = 0;
let scale = 1
let showMatrix;
let pSize = 1;


export function setScene(s)
{
    scene = s;
}


export function setFB(frameBuff)
{
    fb = frameBuff;
}


export function setCurrPos(index)
{
    currPos = index;
}


export function setPSize(size)
{
    pSize = size;
}


export function setPushback(pushBack)
{
    z = pushBack;
}


export function keyPressed(event)
{
    const c = event.key;

    if(c == 'd')
        scene.getPosition(currPos).debug = false;
    else if(c == 'D')
        scene.getPosition(currPos).debug = true;
    else if(c == '/')
        currPos = (currPos % scene.positionList.length) +1;
    else if(c == '?')
        currPos = (currPos % scene.PositionList.length) -1;
    else if(c == 'p')
    {
        const cam = scene.getCamera();
        scene.getCamera().projPerspective(cam.l, cam.r, cam.b, cam.t, cam.n);
    }
    else if(c == 'P')
    {
        const cam = scene.getCamera();
        scene.getCamera().projOrtho(cam.l, cam.r, cam.b, cam.t, cam.n);
    }
    else if(c == 'x')
        xTrans -= .1
    else if(c == 'X')
        xTrans += .1;
    else if(c == 'y')
        yTrans -= .1;
    else if(c == 'Y')
        yTrans += .1;
    else if(c == 'z')
        zTrans -= .1;
    else if(c == 'Z')
        zTrans += .1;
    else if(c == 'u')
        xRot -= 1;
    else if(c == 'U')
        xRot += 1;
    else if(c == 'v')
        yRot -= 1;
    else if(c == 'V')
        yRot += 1;
    else if(c == 'w')
        zRot -= 1;
    else if(c == 'W')
        zRot += 1;
    else if(c == 's')
        scale /= .1;
    else if(c == 'S')
        scale *= .1;
    else if(c == 'm')
        showMatrix = !showMatrix;
    else if(c == '=')
        reset();
    else if(c == 'c')
        setRandomColor(scene.getPosition(currPos).getModel());
    else if(c == 'C')
        setRandomColor(scene.getPosition(currPos).getModel());
    else if(c == 'e')
        setRandomPrimitiveColor(scene.getPosition(currPos).getModel());
    else if(c == 'E')
        setRainbowPrimitiveColors(scene.getPosition(currPos).getModel());
    else if(event.altKey && c == 'e')
        setRandomVertexColor(scene.getPosition(currPos).getModel());
    else if(c == 'a')
        setDoAntiAliasing(!doAntiAliasing);
    else if(c == 'g')
        setDoGamma(!doGamma);
    else if(event.altKey && c == 'p')
        make(scene.getPosition(currPos).getModel(), pSize);
    else if(c == 'h')
        printHelp();

    setTransformations();
    display();
}


function setTransformations()
{
    const p = scene.getPosition(currPos);

    p.setMatrix(Matrix.translate(0, 0, z)
          .mult(Matrix.translate(xTrans, yTrans, zTrans))
          .mult(Matrix.rotateX(xRot))
          .mult(Matrix.rotateY(yRot))
          .mult(Matrix.rotateZ(zRot))
          .mult(Matrix.scale(scale)));
}


//export function display(document)
export function display()
{
    const resizer = document.getElementById("resizer");
    // @ts-ignore
    const ctx = document.getElementById("pixels").getContext("2d");
    const w = resizer?.offsetWidth;
    const h = resizer?.offsetHeight;

    if (ctx == null)
    {
       console.log("cn.getContext(2d) is null");
       return;
    }

    ctx.canvas.width = w;
    ctx.canvas.height = h;

    fb = new FrameBuffer(w?w:fb.width, h?h:fb.height, fb.bgColorFB);
    renderFB(scene, fb);

    /*
       This is not a good idea.
       We are copying a lot of data for every frame!
       We need to make the framebuffer implementation
       more friendly to the JavaScript canvas element.
    */
    const pixelData = new Uint8ClampedArray(fb.width * fb.height * 4);
    for (let y = 0; y < fb.height; y += 1)
    {
       for (let x = 0; x < fb.width; x += 1)
       {
          const index = y * (4*fb.width) + (4*x);
          const r = fb.getPixelFB(x, y).getRed();
          const g = fb.getPixelFB(x, y).getGreen();
          const b = fb.getPixelFB(x, y).getBlue();
          const a = fb.getPixelFB(x, y).getAlpha();

          pixelData[index + 0] = r;
          pixelData[index + 1] = g;
          pixelData[index + 2] = b;
          pixelData[index + 3] = a;
       }
    }
    ctx.putImageData(new ImageData(pixelData, fb.width, fb.height), fb.vp.vp_ul_x, fb.vp.vp_ul_y);
}


function reset()
{
    xTrans = 0;
    yTrans = 0;
    zTrans = 0;
    xRot = 0;
    yRot = 0;
    zRot = 0;
    scale = 1;
}


export function printHelp()
{
    console.log("Use the 'd/D' keys to toggle debugging information on and off for the current model.");
    console.log("Use the '/' and '?' keys to cycle forwards and backwards through the models.");
    console.log("Use the 'p/P' key to toggle between parallel and orthographic projection.");
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
    console.log("Use the 'Alt-p' key to convert the current model to a point cloud.");
    console.log("Use the 'h' key to redisplay this help message.");
}