import {Scene, Camera, Position, Model, Matrix} from "../../renderer/scene/SceneExport.js";
import {FrameBuffer, Color} from "../../renderer/framebuffer/FramebufferExport.js";
import {doAntiAliasing, doGamma, doNearClipping, rastDebug, render1, render2, renderFB1, setClipDebug, setDoAntiAliasing, setDoGamma, setDoNearClipping, setRastDebug} from "../../renderer/pipeline/PipelineExport.js";
import {Axes3D, Box, Cone, ConeFrustum, Cylinder, Octahedron, PanelXZ, ParametricCurve, Sphere, SurfaceOfRevolution, Tetrahedron, Torus, TriangularPrism} from "../../renderer/models_L/ModelsExport.js";
import * as ModelShading from "../../renderer/scene/util/ModelShading.js";
import { format } from "../../renderer/scene/util/StringFormat.js";

let fps = 30;
let timerHandle;

let cameraX = 0;
let cameraY = 3;
let cameraZ = 10;
let cameraRotX = 0;
let cameraRotY = 0;
let cameraRotZ = 0;

let letterbox = false;
let perspective = true;
let aspectRatio = 2;
let fovy = 90;
let near = 1;

let angleNumber = 0;
let showCamera = false;
let showMatrix = false
let showWindow = false;
let debug = false;
let useRenderer1 = true;

const assets = "../../assets/";
let grsImport;
let objImport;
let displayFunc;

/**@type FrameBuffer */ let fb = new FrameBuffer(600, 600, Color.black);
/**@type Camera */let camera = new Camera();
/**@type Scene */ let scene = Scene.buildFromCameraName(camera, "GeometriesR12-Navigate");
/**@type Position */ const xyzAxes = new Position(new Axes3D(-6, 6, -6, 0, -7, 7, Color.red));
/**@type Position */ const xzPlane = new Position(new PanelXZ(-6, 6, -7, 7));
/**@type Model[][] */ const model = new Array(5);
for(let row = 0; row < model.length; row += 1)
    model[row] = new Array(3);

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

    document.addEventListener("keypress", handleKeyPress);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleMouseEvent);

    timerHandle = setInterval(handleMouseEvent, 1000/fps);
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
   // row 0 (first row in first image)
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

   // row 3
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

    ModelShading.setColor(xzPlane.model, Color.gray.darker(.5));
    
    scene.addPosition(xzPlane, xyzAxes);
    for(let i = model.length -1; i >=0; --i)
    {   
        for(let j = 0; j < model[i].length; ++j)
            scene.addPosition(new Position(model[i][j]));
    }
}

function handleMouseEvent(e)
{
    angleNumber = (angleNumber + 1) % 360;

    run();
}

function handleKeyPress(e)
{
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
    else if('1' == c)
    {    
        useRenderer1 = true;
        console.log("Using Pipeline 1");
    }
    else if('2' == c)
    {
        useRenderer1 = false;
        console.log("Using Pipeline 2");
    }
    else if('a' == c)
    {
        setDoAntiAliasing(!doAntiAliasing);
        const antiStr = doAntiAliasing?"On":"Off";
        console.log("Anti Aliasing is turned: " + antiStr);
    }
    else if('g' == c)
    {
        setDoGamma(!doGamma);
        const gammaStr = doGamma?"On":"Off";
        console.log("Gamma Correction is turned: " + gammaStr);
    }
    else if('p' == c)
    {
        perspective = !perspective;
        const perspStr = perspective?"perspective":"orthographic";
        console.log("Using " + perspStr + " projection");
    }
    else if('l' == c)
    {
        letterbox = !letterbox;
        const letterStr = letterbox?"On":"Off";
        console.log("letterboxing is turned " + letterStr);
    }
    else if('n' == c)
        near -= 0.01;
    else if('N' == c)
        near += 0.01;
    else if('b' == c)
    {
        setDoNearClipping(!doNearClipping);
        const clipStr = doNearClipping?"On":"Off";
        console.log("Near Plane Clipping is turned: " + clipStr);
    }
    else if('m' == c || 'M' == c)
        showCamera = !showCamera
    else if('*' == c)
        showWindow = !showWindow;
    else if('r' == c)
        aspectRatio -= 0.01;
    else if('R' == c)
        aspectRatio += 0.01;
    else if('f' == c)
        fovy -= 0.5;
    else if('F' == c)
        fovy += 0.5;
    else if('=' == c)
    {
        cameraRotX = 0.0;
        cameraRotY = 0.0;
        cameraRotZ = 0.0;
    }
    else if('s' == c)
        clearInterval(timerHandle);
    else if('S' == c)
        timerHandle = setInterval(handleMouseEvent, 1000/fps);
    else if('x' == c)
        cameraX -= 1;
    else if('X' == c)
        cameraX += 1;
    else if('y' == c)
        cameraY -= 1;
    else if('Y' == c)   
        cameraY += 1
    else if('z' == c)
        cameraZ -= 1;
    else if('Z' == c)
        cameraZ += 1;

    handleMouseEvent(e);
    displayCamera(e);
    displayWindow(e);
}

function handleKeyDown(e)
{
    const c = e.key;
    const alt = e.altKey;

    if(alt)
    {
        e.preventDefault();
        
        if('x' == c)
            cameraRotX -= 1;
        else if('X' == c)
            cameraRotX += 1;
        else if('y' == c)
            cameraRotY -= 1;
        else if('Y' == c)   
            cameraRotY += 1
        else if('z' == c)
            cameraRotZ -= 1;
        else if('Z' == c)
            cameraRotZ += 1;
   
        handleMouseEvent(e);
        displayCamera();
    }
}

function displayCamera(e)
{
    const c = e.key;

    if(showCamera && ('m' == c || 'M' == c ||
                      'n' == c || 'N' == c ||
                      'r' == c || 'R' == c ||
                      'f' == c || 'F' == c ||
                      'b' == c && doNearClipping ||
                      'p' == c))
    {
        console.log(camera.toString());
    }

    if(showCamera && 
      ( 'x' == c || 'X' == c ||
        'y' == c || 'Y' == c ||
        'z' == c || 'Z' == c))
    {
        console.log("Camera Location: " )
        console.log("  cameraX = " + cameraX + 
                    "  cameraY = " + cameraY + 
                    "  cameraZ = " + cameraZ);

        console.log("Camera Rotation: ")
        console.log("  cameraRotX = " + cameraRotX + 
                    "  cameraRotY = " + cameraRotY + 
                    "  cameraRotZ = " + cameraRotZ);

        console.log("View Matrix: ") 
        console.log(camera.getViewMatrix().toString());
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

function run()
{
    scene.debug = debug;

    for(let i = model.length - 1; i >= 0; --i)
    {
        for(let j = 0; j < model[i].length; ++j)
        {
            const mat = Matrix.translate(-4+4*j, 0, 6-3*i)
                            .timesMatrix(Matrix.rotateX(3*angleNumber))
                            .timesMatrix(Matrix.rotateY(3*angleNumber));

            model[i][j].matrix = mat;
        }
    }

    displayFunc();
}

function setUpViewing()
{
    // Set up the camera's view volume.
    if (perspective)
      camera.projPerspectiveFOVY(fovy, aspectRatio);
    else
       camera.projOrthoFOVY(fovy, aspectRatio);
      
    camera = camera.changeNear(near);

    // Set up the camera's location.
    camera.view2Identity();
    camera.viewTranslate(cameraX, cameraY, cameraZ);
    camera.viewRotateX(cameraRotX);
    camera.viewRotateY(cameraRotY);
    camera.viewRotateZ(cameraRotZ);

    scene.setCamera(camera);

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
    const width = resizerEl.offsetWidth;
    const height = resizerEl.offsetHeight;

    const ctx = document.getElementById("pixels").getContext("2d");
    ctx.canvas.width = width;
    ctx.canvas.height = height;

    fb = new FrameBuffer(width, height);

    setUpViewing();

    if(useRenderer1)
        render1(scene, fb.vp);
    else
        render2(scene, fb.vp);

    ctx.putImageData(new ImageData(fb.pixelBuffer, fb.width, fb.height), 0, 0);
}

function write2File()
{
    render1(scene, fb.vp);
    fb.dumpFB2File(format("GeometriesR11-Navigate-Frame%03d.ppm", angleNumber++));

    if(angleNumber < 360)
        run();
}

function printHelpMessage()
{
    console.log("Use the 'd/D' keys to toggle debugging information on and off for the current model");
    console.log("Use the '1' and '2' keys to switch between the two renderers.");
    console.log("Use the 'p' key to toggle between parallel and orthographic projection.");
    console.log("Use the 'a' key to toggle anti-aliasing on and off.");
    console.log("Use the 'g' key to toggle gamma correction on and off.");
    console.log("Use the 'b' key to toggle near plane clipping on and off.");
    console.log("Use the n/N keys to move the camera's near plane.");
    console.log("Use the f/F keys to change the camera's field-of-view (keep AR constant).");
    console.log("Use the r/R keys to change the camera's aspect ratio (keep fov constant).");
    console.log("Use the 'l' key to toggle letterboxing viewport on and off.");
    console.log("Use x/X keys to translate the camera forward/backward.");
    console.log("Use Alt-x/X keys to rotate the camera sideways (on the z-axis).");
    console.log("Use y/Y keys to translate the camera forward/backward.");
    console.log("Use Alt-y/Y keys to rotate the camera sideways (on the z-axis).");
    console.log("Use z/Z keys to translate the camera forward/backward.");
    console.log("Use Alt-z/Z keys to rotate the camera sideways (on the z-axis).");
    console.log("Use the '=' key to reset the Camera's rotation.");
    console.log("Use the 'm' key to toggle showing the Camera data.");
    console.log("Use the '*' key to show window data.");
    console.log("Use the 's/S' key to stop/Start the animation.");
    console.log("Use the 'h' key to redisplay this help message.");
}