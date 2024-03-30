import {Camera, Matrix, Model, Position, Scene} from "../../renderer/scene/SceneExport.js";
import {doAntiAliasing, doGamma, rastDebug, render1, setClipDebug, setDoAntiAliasing, setDoGamma, setRastDebug} from "../../renderer/pipeline/PipelineExport.js";
import {FrameBuffer, Color} from "../../renderer/framebuffer/FramebufferExport.js";
import {PanelXY, PanelXZ, Sphere} from "../../renderer/models_L/ModelsExport.js";
import * as ModelShading from "../../renderer/scene/util/ModelShading.js";

/**
   There are four ways an object can appear larger in an image.
     1.) The object can move closer to the camera.
     2.) The object can grow in size (scale up).
     3.) The camera can move closer to the object.
     4.) The camera can zoom in on the object.
<p>
   If we look at an object without any frame of reference, we
   cannot tell which of these four operations is making the
   object larger (this ambiguity is the basis for many optical
   illusions). But the right frame of reference can give us
   clues about which operation is causing the object to appear
   larger.
*/

let showMatrix = false;
let aMatrixChanged = false;

let zTranslation = 0;
let eyeZ = 2;
let eyeY = 0;
let scale = 1;

let focalLength = 1;
let near = .1;
let perspective = true;

/**@type {FrameBuffer} */ let fb = new FrameBuffer(800, 800);
/**@type {Scene} */ let scene = new Scene();

/**@type {Model} */ const sphereMod = new Sphere(1, 30, 30);
ModelShading.setColor(sphereMod, Color.red);
/**@type {Position} */ const spherePos  = new Position(sphereMod);

/**@type {Model} */ const xzPlaneMod = new PanelXZ(-20, 20, -15, 0);
ModelShading.setColor(xzPlaneMod, Color.gray);
/**@type {Position} */ const xzPlanePos = new Position(xzPlaneMod, 
                                                        Matrix.translate(0, -3, 0));

/**@type {Model} */ const xyPlaneMod = new PanelXY(-20, 20, -3, 20);
ModelShading.setColor(xyPlaneMod, Color.gray);
/**@type {Position} */ const xyPlanePos = new Position(xyPlaneMod, 
                                                        Matrix.translate(0, 0, -15));

scene.camera.viewTranslate(0, 0, eyeZ);
scene.addPosition(xzPlanePos, xyPlanePos, spherePos);

const resizer = new ResizeObserver(setUpViewing);
resizer.observe(document.getElementById("resizer"));

document.addEventListener("keydown", keyDown);
document.addEventListener("keypress", keyPress);

printHelpMessage();

function keyDown(e)
{
    const c = e.key;
    const alt = e.altKey;

    if(alt)
    {
        e.preventDefault();

        if('z' == c)
            focalLength -= .1;
        else if('Z' == c)
            focalLength += .1;
        else if('s' == c)
            scale /= 1.1;
        else if('S' == c)
            scale *= 1.1;      
        
        aMatrixChanged = true;
    }

    setUpViewing();
}

function keyPress(e)
{
    const c = e.key;

    if('h' == c)
        printHelpMessage();
    else if('c' == c)
        ModelShading.setRandomColor(sphereMod);
    else if('d' == c)
    {
        scene.debug = !scene.debug;
        setClipDebug(scene.debug);
    }
    else if('D' == c)
        setRastDebug(!rastDebug);
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
        const perspStr = perspective?"Perspective":"Orthographic";
        console.log("Using " + perspStr + " projection");
    }
    else if('f' == c)
    {
        xzPlaneMod.visible = !xzPlaneMod.visible;
        xyPlaneMod.visible = !xyPlaneMod.visible;
    }
    else if('v' == c)
    {
        showMatrix = !showMatrix;
        showMatrix?(aMatrixChanged = true) : (aMatrixChanged = false);
    }
    else if('=' == c)
    {
        scale = 1;
        zTranslation = 0;
        near = 1;
        eyeY = 0;
        eyeZ = 2;
        aMatrixChanged = true;
    }
    else if('n' == c)
        near -= 0.1;
    else if('N' == c)
        near += 0.1;
    else if('s' == c)
    {
        zTranslation -= .1;
        aMatrixChanged = true;
    }
    else if('S' == c)
    {
        zTranslation += .1;
        aMatrixChanged = true;
    }
    else if('z' == c)
    {
        eyeZ += .1;
        aMatrixChanged = true;
    }
    else if('Z' == c)
    {
        eyeZ -= .1;
        aMatrixChanged = true;
    }
    else if('y' == c)
    {
        eyeY += .1;
        aMatrixChanged = true;
    }
    else if('Y' == c)
    {
        eyeY -= .1;
        aMatrixChanged = true;
    }

    setUpViewing();
}

function setUpViewing()
{
    let camera1 = new Camera();
    if(perspective)
        camera1.projPerspectiveFocalLength(-1, 1, -1, 1, focalLength);
    else
        camera1.projOrtho(-1, 1, -1, 1);

    const camera2 = camera1.changeNear(near);

    scene = scene.changeCamera(camera2);
    scene.camera.view2Identity();
    scene.camera.viewTranslate(0, eyeY, eyeZ);

    // set the model to view transformation matrix
    // the order is important
    scene.setPosition(2, 
        scene.getPosition(2).transform(Matrix.translate(0, 0, zTranslation)
                                             .timesMatrix(Matrix.scale(scale))));

    if(showMatrix && aMatrixChanged)
    {
        console.log("The sphere's Model Matrix: ");
        console.log(spherePos.matrix.toString());
        
        console.log("The Camera's View Matrix");
        console.log(scene.camera.getViewMatrix().toString());

        console.log("The Cameras Normalize Matrix");
        console.log(scene.camera.getNormalizeMatrix().toString());

        aMatrixChanged = false;
    }

    const resizer = document.getElementById("resizer");
    const w = resizer.offsetWidth;
    const h = resizer.offsetHeight;

    let fb = new FrameBuffer(w, h, Color.gray.darker(.75));
    if(1 < w/h)
    {
        fb.setViewport(h, h, (w-h)/2, 0);
        fb.vp.clearVP(Color.black);
    }
    else if(1 > w/h)
    {        
        fb.setViewport(w, w, (h-w)/2, 0);
        fb.vp.clearVP(Color.black);
    }

    render1(scene, fb.vp);

    const ctx = document.getElementById("pixels").getContext("2d");
    ctx.canvas.width = w;
    ctx.canvas.height = h;

    ctx.putImageData(new ImageData(fb.pixelBuffer, w, h), 0, 0);
}

function printHelpMessage()
{
    console.log("Use the 'p' key to toggle between parallel and orthographic projection.");
    console.log("Use the alt z/Z keys to zoom the camera in and out of the scene.");
    console.log("Use the z/Z key to move the camera along the z-axis.");
    console.log("Use the y/Y keys to move the camera along the y-axis");
    console.log("Use the s/S, key to move the sphere along the z-axis.");
    console.log("Use the alt s/S key to scale the size of the sphere.");
    console.log("Use the 'f' key to toggle the display of the floor & wall on and off.");
    console.log("Use the 'c' key to change the random sphere color.");
    console.log("Use the n/N keys to move the camera's near plane.");
    console.log("Use the 'v' key to toggle showing the Model, View, & Normalize matrices.");
    console.log("Use the '=' key to reset all matrices to the identity.");
    console.log("Use the '+' key to save a \"screenshot\" of the framebuffer.");
    console.log("Use the 'h' key to redisplay this help message.");
}