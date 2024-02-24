// @ts-check

/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/
import {Scene, Position, Matrix, Camera} from "../../renderer/scene/SceneExport.js";
import {FrameBuffer, Viewport, Color} from "../../renderer/framebuffer/FramebufferExport.js";
import {doAntiAliasing, doGamma, doNearClipping, rastDebug, render1, renderFB1, renderFB2, setClipDebug, setDoAntiAliasing, setDoGamma, setDoNearClipping, setRastDebug} from "../../renderer/pipeline/PipelineExport.js";
import * as ModelShading from "../../renderer/scene/util/ModelShading.js";
import {Axes3D, Box, Cone, ConeFrustum, Cylinder, Octahedron, PanelXZ, ParametricCurve, Sphere, SurfaceOfRevolution, Tetrahedron, Torus, TriangularPrism} from "../../renderer/models_L/ModelsExport.js";
import { format } from "../../renderer/scene/util/StringFormat.js";

/**
   Compare with
      http://threejs.org/examples/#webgl_geometries
   or
      https://stemkoski.github.io/Three.js/Shapes.html
   or
      http://www.smartjava.org/ltjs/chapter-02/04-geometries.html
*/  
  
const assets = "../../assets/";

const fps = 30;
let timerHandle = undefined;

let cameraX =  0.0;
let cameraY =  3.0;
let cameraZ = 10.0;
let angleNumber = 0;

let letterbox = false;
let aspectRatio = 2.0;
let near = 1.0;
let perspective = true;
let fovy = 90.0;
let showCamera = false;
let showWindow = false;

let scene = new Scene();
let debug = false;
let camera = new Camera();
let fb = new FrameBuffer(1800, 900, Color.black);

let objImport;
let grsImport;
let displayFunc;

const model = new Array(5);
for(let row = 0; row < model.length; row += 1)
    model[row] = new Array(3);

// Create x, y and z axes
const xyzAxes = new Axes3D(6, -6, 6, 0, 7, -7, Color.red);

// Create a horizontal coordinate plane model.
const xzPlane = new PanelXZ(-6, 6, -7, 7);
ModelShading.setColor(xzPlane, Color.gray);

try
{
    document;

    displayFunc = write2Canvas;

    objImport = await import("../../renderer/models_L/OBJModel.js");
    grsImport = await import("../../renderer/models_L/GRSModel.js");

    await buildModelArray();

    const resizerEl = document.getElementById("resizer");
    const resizer = new ResizeObserver(write2Canvas);
    resizer.observe(resizerEl);

    document.addEventListener("keydown", handleKeyEvent);
    document.addEventListener("click", handleMouseEvent);

    timerHandle = setInterval(()  => {setUpViewing(); run();}, 1000/fps);
}
catch(e)
{
    if(e != "ReferenceError: document is not defined")
        console.log(e);
    else
    {
        displayFunc = write2File;

        grsImport = await import("../../renderer/models_L/GRSModelNode.js");
        objImport = await import("../../renderer/models_L/OBJModelNode.js");

        await buildModelArray();

        setUpViewing();
        run();
    }
}

async function buildModelArray()
{
    // row 0 (first row in the first image)
    model[0][0] = new TriangularPrism(1.0, 1.0, 10);
    ModelShading.setColor(model[0][0], Color.green.darker().darker());

    model[0][1] = new Cylinder(0.5, 1.0, 30, 30);
    ModelShading.setColor(model[0][1], Color.blue.brighter().brighter());

    model[0][2] = await objImport.default(assets + "great_rhombicosidodecahedron.obj");
    ModelShading.setColor(model[0][2], Color.red);

      // row 1
    model[1][0] = await grsImport.default(assets + "grs/bronto.grs");
    ModelShading.setColor(model[1][0], Color.red);

    model[1][1] = await objImport.default(assets + "horse.obj");
    ModelShading.setColor(model[1][1], Color.pink.darker());

    model[1][2] = new ConeFrustum(0.5, 1.0, 1.0, 10, 10);
    ModelShading.setColor(model[1][2], Color.orange.darker());

      // row 2
    model[2][0] = new Torus(0.75, 0.25, 30, 30);
    ModelShading.setColor(model[2][0], Color.gray);

    model[2][1] = new Octahedron(6);
    ModelShading.setColor(model[2][1], Color.green);

    model[2][2] = new Box(1.0, 1.0, 1.0);
    ModelShading.setRandomPrimitiveColor(model[2][2]);

      // row 3 (back row in the first image)
    model[3][0] = new ParametricCurve(
              (t) => {return 0.3*(Math.sin(t) + 2*Math.sin(2*t)) + 0.1*Math.sin(t/6)},
              (t) => {return 0.3*(Math.cos(t) - 2*Math.cos(2*t)) + 0.1*Math.sin(t/6)},
              (t) => {return 0.3*(-Math.sin(3*t))},
              0, 6*Math.PI, 120);
    ModelShading.setRandomPrimitiveColor(model[3][0]);

    model[3][1] = await objImport.default(assets + "small_rhombicosidodecahedron.obj");
    ModelShading.setColor(model[3][1], Color.magenta);

    model[3][2] = new SurfaceOfRevolution(
              (t) => {return 1.5*(0.5 + 0.15 * Math.sin(10*t+1.0)*Math.sin(5*t+0.5))},
              (t) => {return 1.5*(0.5 + 0.15 * Math.sin(10*t+1.0)*Math.sin(5*t+0.5))},
              (t) => {return 1.5*(0.5 + 0.15 * Math.sin(10*t+1.0)*Math.sin(5*t+0.5))},
              -0.1, 0.9,
              30, 30);
    ModelShading.setColor(model[3][2], Color.blue);

      // row 4 (last row in first image)
    model[4][0] = new Cone(0.5, 1.0, 30, 30);
    ModelShading.setColor(model[4][0], Color.yellow);

    model[4][1] = new Tetrahedron(12, 12);
    ModelShading.setColor(model[4][1], Color.green.brighter().brighter());

    model[4][2] = new Sphere(1.0, 30, 30);
    ModelShading.setColor(model[4][2], Color.cyan.brighter().brighter());
}

function run()
{
    // Build the Scene for this frame of the animation.
    scene = Scene.buildFromCameraName(camera, "Geometries_R11_navigate_angle_"+angleNumber);
    scene.debug = debug;

    // Create a "top level" Model that is a horizontal coordinate plane.
    const topLevel = new PanelXZ(-6, 6, -7, 7);
    ModelShading.setColor(topLevel, Color.Gray.darker().darker());

    // Add all the other models as nested models of the top level Model.
    topLevel.addNestedModel(xyzAxes); // draw the axes after the grid

    // Place each model where it belongs in the xz-plane
    // and also rotate each model on its own axis.
    for (let i = model.length - 1; i >= 0; --i) // from back to front
    {
        for (let j = 0; j < model[i].length; ++j)
        {
            // Place this model where it belongs in the plane.
            // Then rotate this model on its own axis.
            const mat = Matrix.translate(-4+4*j, 0, 6-3*i)
                                .timesMatrix(Matrix.rotateX(3*angleNumber))
                                .timesMatrix(Matrix.rotateY(3*angleNumber));

            topLevel.addNestedModel(model[i][j].transform(mat));
        }
    }

    // Create a "top level" Position that holds the
    // "top level" Model, rotated by k degrees.
    const topLevel_p = new Position(topLevel);

    // Add the top level Position to the Scene.
    scene.addPosition( topLevel_p );

    displayFunc();
}

function setUpViewing()
{
    // Set up the camera's view volume.
    const camera1 = new Camera();
    if (perspective)
      camera1.projPerspectiveFOVY(fovy, aspectRatio);
    else
       camera1.projOrthoFOVY(fovy, aspectRatio);
      
    const camera2 = camera1.changeNear(near);

    // Set up the camera's location.
    camera = camera2.translate(cameraX, cameraY, cameraZ);

    // Get the size of the FrameBuffer.
    const  w = fb.width;
    const  h = fb.height;

    // Create a viewport with the correct aspect ratio.
    if ( letterbox )
    {
        if ( aspectRatio <= w/h)
        {
            const  width = (h * aspectRatio);
            const  xOffset = (w - width) / 2;
            fb.setViewport(width, h, xOffset, 0);
        }
        else
        {
            const  height = (w / aspectRatio);
            const  yOffset = (h - height) / 2;
            fb.setViewport(w, height, 0, yOffset);
        }

        fb.clearFB(Color.gray.darker().darker());
        fb.vp.clearVP(Color.black);
    }
    else // The viewport is the whole framebuffer.
    {
        fb.setViewport(fb.width, fb.height, 0, 0);
        fb.vp.clearVP(Color.black);
    }
}

function write2Canvas()
{
    const resizerEl = document.getElementById("resizer");
    const width = resizerEl?.offsetWidth;
    const height = resizerEl?.offsetHeight;

    const ctx = document.getElementById("pixels").getContext("2d");
    ctx.canvas.width = width;
    ctx.canvas.height = height;

    fb = new FrameBuffer(width, height);

    setUpViewing();

    render1(scene, fb.vp);
    
    ctx.putImageData(new ImageData(fb.pixelBuffer, fb.width, fb.height), 0, 0);
}

function write2File()
{
    setUpViewing();

    render1(scene, fb.vp);
    fb.dumpFB2File(format("GeometriesR11-Navigate-Frame%03d.ppm", angleNumber++));

    if(angleNumber < 360)
        run();
}

function handleMouseEvent(e)
{
    angleNumber = (angleNumber + 1) % 360;

    setUpViewing();
    displayFunc();
}

function handleKeyEvent(e)
{    
    const keyCode = e.keyCode;
    const ctrl = e.ctrlKey;
    const uCode = 38;
    const dCode = 40;
    const rCode = 39;
    const lCode = 37;

    if( keyCode == uCode || keyCode == dCode ||
        keyCode == rCode || keyCode == lCode)
    {
        if(ctrl)
        {
            if(uCode == keyCode)
                cameraY += .1;
            else if(dCode == keyCode)
                cameraY -= .1;
        }
        else
        {
            if(uCode == keyCode)
                cameraZ -= .1;
            else if(dCode == keyCode)
                cameraZ += .1;
            else if(lCode == keyCode)
                cameraX -= .1;
            else if(rCode == keyCode)
                cameraX += .1;
        }
    }

    const c = e.key;

    if('h' == c)
        printHelpMessage();
    else if('d' == c)
    {
        debug = !debug;
        setClipDebug(debug);
    }
    else if('D' == c)
        setRastDebug(!rastDebug);
    else if('a' == c)
    {
        setDoAntiAliasing(!doAntiAliasing);
        console.log("Anti-aliasing is turned: " + doAntiAliasing? "On":"Off");
    }
    else if('g' == c)
    {
        setDoGamma(!doGamma);
        console.log("Gamma correction is turned: " + doGamma? "On":"Off");
    }
    else if('p' == c)
    {
        perspective = !perspective;
        console.log("Using " + perspective? "perspective":"orthographic" + " projection");
    }
    else if('l' == c)
    {
        letterbox = !letterbox;
        console.log("Letter boxing is turned " + letterbox? "On":"Off");
    }
    else if('n' == c)
        near -= 0.01;
    else if('N' == c)
        near += 0.01;
    else if('b' == c)
    {
        setDoNearClipping(!doNearClipping);
        console.log("Near-clipping is turned: " +doNearClipping? "On":"Off");
    }
    else if('r' == c)
        aspectRatio -= 0.01;
    else if('R' == c)
        aspectRatio += 0.01;
    else if('f' == c)
        fovy -= 0.5;
    else if('F' == c)
        fovy += 0.5;
    else if('m' == c || 'M' == c)
        showCamera = !showCamera;
    else if('*' == c)
        showWindow = !showWindow;
    else if('s' == c)
        clearInterval(timerHandle);
    else if('S' == c)
        setInterval(run, 1000/fps);

    // Render again.
    setUpViewing();
    displayCamera(e);
    displayWindow(e);
    displayFunc();
}

function displayCamera(e)
{
    const c = e.key;

    if(showCamera && ('p' == c ||
         'm' == c || 'M' == c ||
         'n' == c || 'N' == c ||
         'f' == c || 'F' == c ||
         'r' == c || 'R' == c ||
        ('b' == c && doNearClipping)))
    {
        console.log(camera.toString());
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
        console.log("Camera Location: " + camera.getViewVector().toString());
    }
}

function displayWindow(e)
{
    if(showWindow)
    {
        const wFB = fb.width;
        const hFB = fb.height;

        const wVP = fb.vp.width;
        const hVP = fb.vp.height;

        const vpULX = fb.vp.vp_ul_x;
        const vpULY = fb.vp.vp_ul_y;

        const c = camera;
        const wVR = c.right - c.left;
        const hVR = c.top - c.bottom;

        const rFB = wFB/hFB;
        const rVP = wVP/hVP;
        const rCam = wVR/hVR;

        const formatStr = format("Window Information: \n" + 
                                 "FrameBuffer [w=%4d, h=%4d], aspect ration = %.2f\n" +
                                 "Viewport    [w=%4d, h=%4d, x=%d, y=%d], aspect ration = %.2f\n" +
                                 "Camera      [w=%4d, h=%4d], aspect ration = %.2f\n", 
                                  wFB,   hFB,               rFB, 
                                  wVP,   hVP, vpULX, vpULY, rVP, 
                                  wVR,   hVR,               rCam);
        console.log(formatStr);
        showWindow = false;
    }
}

function printHelpMessage()
{
    console.log("Use the 'd/D' keys to toggle debugging information on and off for the current model.");
    console.log("Use the 'p' key to toggle between parallel and orthographic projection.");
    console.log("Use the 'a' key to toggle anti-aliasing on and off.");
    console.log("Use the 'g' key to toggle gamma correction on and off.");
    console.log("Use the 'b' key to toggle near plane clipping on and off.");
    console.log("Use the n/N keys to move the camera's near plane.");
    console.log("Use the f/F keys to change the camera's field-of-view (keep AR constant).");
    console.log("Use the r/R keys to change the camera's aspect ratio (keep fov constant).");
    console.log("Use the 'l' key to toggle letterboxing viewport on and off.");
    console.log("Use the arrow keys to translate the camera left/right/forward/backward.");
    console.log("Use CTRL arrow keys to translate the camera up/down.");
    console.log("Use the 'm' key to toggle showing the Camera data.");
    console.log("Use the '*' key to show window data.");
    console.log("Use the 's/S' key to stop/Start the animation.");
    console.log("Use the 'h' key to redisplay this help message.");
}