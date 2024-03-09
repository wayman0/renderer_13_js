import {Scene, Position, Model, Camera, Matrix} from "../../renderer/scene/SceneExport.js";
import {Sphere} from "../../renderer/models_L/ModelsExport.js";
import {setColor} from "../../renderer/scene/util/ModelShading.js";
import {FrameBuffer, Color} from "../../renderer/framebuffer/FramebufferExport.js";
import {doAntiAliasing, doGamma, rastDebug, render1, render2, setClipDebug, setDebugPosition, setDoAntiAliasing, setDoGamma, setRastDebug} from "../../renderer/pipeline/PipelineExport.js";
import { format } from "../../renderer/scene/util/StringFormat.js";

/**
   Draw an animation of a solar system with a sun, planet, and moon.
<p>
   In this version, the orbit of the planet is independent of the
   rotation of the sun, and the orbit of the moon is independent
   of the rotation of the planet. This version has the exact same
   scene graph structure as v2a, but this version uses different
   matrices.
<pre>{@code
         Scene
        /     \
       /       \
  Camera     List<Position>
               |
               |
            Position
           /   |    \
          /    |     \
    Matrix   Model    List<Position>
      I     /  |  \      (empty)
           /   |   \
     Matrix  empty  List<Model>
       R             /        \
                    /          \
                Model          Model
               /  |           /  |  \
              /   |          /   |   \
        Matrix   sun   Matrix  empty  List<Model>
          R              T            /         \
                                     /           \
                                 Model            Model
                                /  |             /   |
                               /   |            /    |
                         Matrix  planet    Matrix   moon
                           R                 TR
}</pre>
*/

let fps = 20;
let timerHandle;

let planetOrbitRadius = 5;
let moonOrbitRadius = 1;

let planetOrbitRot = 0;
let moonOrbitRot = 0;

let sunAxisRot = 0;
let planetAxisRot = 0;
let moonAxisRot = 0;

let ecliptic = 7.0;

let perspective = true;
let frameNum = 0;
let useRenderer1 = true;
let letterbox = true;
let aspectRatio = 1;
let fovy = 90;

/**@type {Scene} */ let scene = new Scene();
/**@type {Model} */ let solarSystem, sun, planetMoon, planet, moon;
/**@type {FrameBuffer} */ let fb = new FrameBuffer(600, 600, Color.gray.darker().darker());

let resizer;
let resizerEl;
let displayFunc;

let cam = new Camera();
cam.projPerspective();
scene = Scene.buildFromCameraName(cam.translate(0, 0, 8), "Solar System 2a");

// Create the Model that will hold ethe whole solar system
solarSystem = Model.buildName("SolarSystem");
// create a position that holds the solar system model
scene.addPosition(Position.buildFromModelName(solarSystem, "p0"));

// create the sun
sun = new Sphere(1, 10, 10);
setColor(sun, Color.yellow);
solarSystem.addNestedModel(sun);

// create the model that holds the planet moon system
planetMoon = Model.buildName("PlanetMoon");
solarSystem.addNestedModel(planetMoon);

// create the planet
planet = new Sphere(.5, 10, 10);
setColor(planet, Color.blue);
planetMoon.addNestedModel(planet);

// create the moon
moon = new Sphere(.2, 10, 10);
setColor(moon, Color.green.darker().darker());
planetMoon.addNestedModel(moon);

try
{
    document;

    // set the display function to write to the canvas
    displayFunc = write2Canvas;

    // add a key listener
    document.addEventListener("keydown", handleKeyInput);
    
    // add a click listener
    document.addEventListener("click", updateParameters);

    // create the resize observer
    resizerEl = document.getElementById('resizer');
    resizer = new ResizeObserver(displayFunc);
    resizer.observe(resizerEl);    

    // set up the animation rate
    timerHandle = setInterval(makeNextFrame, 1000/fps);
}
catch(err)
{
    if(err != "ReferenceError: document is not defined")
        console.log(err);
    else
    {
        // set the display function to write to a file
        displayFunc = write2File;

        // call the display function to 
        // start the recursive animation 
        displayFunc();
    }
}  

function handleKeyInput(e)
{
    const c = e.key;

    if('h' == c)
        printHelpMessage();
    else if('d' == c && e.altKey)
    {
        e.preventDefault();
        console.log(scene.toString());
    }
    else if('d' == c)
    {
        scene.debug = !scene.debug;
        setClipDebug(scene.debug);
    }
    else if('D' == c)
    {
        setRastDebug(!rastDebug);
        console.log("Rasterizer Debug: " + rastDebug);
    }    
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
        const aliasStr = doAntiAliasing? "On":"Off";
        console.log("Anti Aliasing is turned: " + aliasStr);
    }
    else if('g' == c)
    {
        setDoGamma(!doGamma);
        const gammStr = doGamma? "On":"Off";
        console.log("Gamma correction is turned: " + gammStr);
    }
    else if('f' == c)
    {
        fps -= 1;
        if(0 > fps) fps = 0;

        console.log("fps = " + fps);
        resetInterval(true);
    }
    else if('F' == c)
    {
        fps += 1;
        console.log("fps = " + fps);
        resetInterval(true);
    }
    else if('s' == c)
        resetInterval(false);
    else if('S' == c)
        resetInterval(true);
    else if('p' == c)
    {
        perspective = !perspective;
        const persStr = perspective? "perspective":"orthographic";
        console.log("Using " + persStr + " projection");
    }
    else if('l' == c)
    {
        letterbox = !letterbox;
        const lettStr = letterbox? "On":"Off";
        console.log("letterboxing is turned: " + lettStr);
    }
    else if('r' == c)
        aspectRatio -= 0.01;
    else if('R' == c)
        aspectRatio += 0.01;
    else if('v' == c)
        fovy -= 0.5;
    else if('V' == c)
        fovy += 0.5;
    else if('e' == c)
        console.log("ecliptic = " + --ecliptic);
    else if('E' == c)
        console.log("ecliptipc = " + ++ecliptic);

    makeNextFrame();
}

function setUpViewing()
{
    let camera1 = new Camera();
    if(perspective)
        camera1.projPerspectiveFOVY(fovy, aspectRatio);
    else
        camera1.projOrthoFOVY(fovy, aspectRatio);

    const camera2 = camera1.translate(0, 0, 8);
    
    scene = scene.changeCamera(camera2);

    let w = 600;
    let h = 600;

    if(resizerEl)
    {
        w = resizerEl.offsetWidth;
        h = resizerEl.offsetHeight;

        const ctx = document.getElementById("pixels").getContext("2d");
        ctx.canvas.width = w;
        ctx.canvas.height = h;
    }

    fb = new FrameBuffer(w, h, Color.gray.darker().darker());

    if(letterbox)
    {
        if(aspectRatio <= w/h)
        {
            const width = h*aspectRatio;
            const xOffset = (w-width)/2;

            fb.setViewport(width, h, xOffset, 0);
        }
        else
        {
            const height = w/aspectRatio;
            const yOffset = (h-height)/2;

            fb.setViewport(w, height, 0, yOffset);
        }

        fb.clearFB();
        fb.vp.clearVP(Color.black);
    }
    else
    {
        fb.setViewportDefault();
        fb.vp.clearVP(Color.black);
    }
}

function write2Canvas()
{
    setUpViewing();

    if(useRenderer1)
        render1(scene, fb.vp);
    else
        render2(scene, fb.vp);

    const ctx = document.getElementById("pixels").getContext("2d");
    ctx.putImageData(new ImageData(fb.pixelBuffer, fb.width, fb.height), 0, 0);
}

function write2File()
{
    if(frameNum < 360)
    {
        fb.clearFB();
        render1(scene, fb.vp);
        fb.dumpFB2File(format("SolarSystemv2a_Frame_%03d.ppm", frameNum++));
        makeNextFrame();
    }
}

function makeNextFrame()
{
    updateParameters();
    rotate();
    displayFunc();
}

function updateParameters()
{
    sunAxisRot -= 10;
    planetOrbitRot += 1;
    planetAxisRot -= 5;
    moonOrbitRot += 5;
    moonAxisRot += 10;
}

function rotate()
{
    solarSystem = solarSystem.transform(Matrix.rotateX(ecliptic));
    scene.setPosition(0, scene.getPosition(0).changeModel(solarSystem));

    sun = sun.transform(Matrix.rotateY(sunAxisRot));
    solarSystem.setNestedModel(0, sun);

    planetMoon = planetMoon.transform(Matrix.rotateY(planetOrbitRot)
                        .timesMatrix(Matrix.translate(planetOrbitRadius, 0, 0)));
    solarSystem.setNestedModel(1, planetMoon);

    planet = planet.transform(Matrix.rotateY(planetAxisRot));
    planetMoon.setNestedModel(0, planet);

    moon = moon.transform(Matrix.rotateY(moonOrbitRot)
            .timesMatrix(Matrix.translate(moonOrbitRadius, 0, 0)
            .timesMatrix(Matrix.rotateY(moonAxisRot))));
    planetMoon.setNestedModel(1, moon);
}

function resetInterval(restart)
{
    clearInterval(timerHandle);

    if(restart)
        timerHandle = setInterval(makeNextFrame, 1000/fps);
}

function printHelpMessage()
{
    console.log("Use the 'd' key to toggle debugging information on and off.");
    console.log("Use the 'Alt-d' key combination to print the Scene data structure.");
    console.log("Use the '1' and '2' keys to switch between the two renderers.");
    console.log("Use the 'a' key to toggle antialiasing on and off.");
    console.log("Use the 'g' key to toggle gamma correction on and off.");
    console.log("Use the f/F keys to slow down or speed up the frame rate.");
    console.log("Use the 's/S' key to stop/Start the animation.");
    console.log("Use the 'p' key to toggle between parallel and orthographic projection.");
    console.log("Use the v/V keys to change the camera's field-of-view (keep AR constant).");
    console.log("Use the r/R keys to change the camera's aspect ratio (keep fov constant).");
    console.log("Use the 'l' key to toggle letterboxing viewport on and off.");
    console.log("Use the e/E keys to change the angle of the ecliptic plane.");
    console.log("Use the '+' key to save a \"screenshot\" of the framebuffer.");
    console.log("Use the 'h' key to redisplay this help message.");
}

