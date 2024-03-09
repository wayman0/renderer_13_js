//@ts-check
import {Scene, Position, Matrix, Model, Camera} from '../../renderer/scene/SceneExport.js';
import {Sphere} from "../../renderer/models_L/ModelsExport.js";
import {setColor} from '../../renderer/scene/util/ModelShading.js';
import {Color, FrameBuffer} from '../../renderer/framebuffer/FramebufferExport.js';
import {doAntiAliasing, doGamma, rastDebug, render1, render2, setClipDebug, setDoAntiAliasing, setDoGamma, setRastDebug} from '../../renderer/pipeline/PipelineExport.js';
import { format } from '../../renderer/scene/util/StringFormat.js';

/**
   Draw an animation of a solar system with a sun, planet, and moon.
<p>
   In this version, the planet orbits around the sun at the same rate as the sun
   rotates on its axis. Similarly, the moon orbits around the planet at the same
   rate as the planet rotates on its axis.
<p>
   But the orbit of the planet should be independent of the rotation of the sun,
   and the orbit of the moon should be independent of the rotation of the planet.
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
     Matrix   sun   List<Model>
       R                  |
                          |
                        Model
                       /  |   \
                      /   |    \
               Matrix   planet  List<Model>
                 TR                 |
                                    |
                                  Model
                                /   |   \
                               /    |    \
                          Matrix   moon  List<Model>
                            TR             (empty)
}</pre>
*/

let fps = 20;
let timerHandle;

let planetOrbitRadius = 5.0;
let moonOrbitRadius = 1.0;

let planetOrbitRot = 0.0;
let moonOrbitRot = 0.0;

let moonAxisRot = 0.0;

let ecliptic = 7.0;//angle of the ecliptic plane

let letterbox = true;
let aspectRatio = 1.0;
let fovy = 90;

let frameNum = 0;

/**@type {Scene} */ let scene;
/**@type {Model} */ let sun, planet, moon;
/**@type {FrameBuffer} */ let fb = new FrameBuffer(600, 600, Color.gray.darker().darker());

let perspective = true;
let useRenderer1 = true;

let resizer;
let resizerEl;
/**@type {Function} */let displayFunc;

scene = Scene.buildFromCameraName(new Camera().translate(0, 0, 8), "Solar System 1");

// create the sun (top level) model.
sun = new Sphere(1, 10, 10);
setColor(sun, Color.yellow);

// create a position object that holds the solar system.
scene.addPosition(Position.buildFromModelName(sun, "Solar System 1"));

// create the planet moon model
planet = new Sphere(.5, 10, 10);
setColor(planet, Color.blue);

// create the moon model
moon = new Sphere(.2, 10, 10);
setColor(moon, Color.green);

// add the mooon to the planet
planet.addNestedModel(moon);

// add the planet moon to the sun
sun.addNestedModel(planet);

try
{
    document;

    // set the display function to write to the canvas
    displayFunc = write2Canvas;

    // add a key listener
    document.addEventListener("keypress", handleKeyInput);
    
    // add a click listener
    document.addEventListener("click", updateParameters);

    // create the resize observer
    resizer = new ResizeObserver(displayFunc);
    resizer.observe(document.getElementById("resizer"));    

    // set up the animation rate
    timerHandle = setInterval(updateParameters, 1000/fps);
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
        fb.vp.clearVP();
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
        fb.dumpFB2File(format("SolarSystem_Frame_%03d.ppm", frameNum++))

        updateParameters();
    }
}

function handleKeyInput(e)
{
    const c = e.key;

    if('h' == c)
        printHelpMessage();
    else if('d' == c && e.alt)
    {
        e.preventDefault();
        console.log(scene.toString());
    }
    else if('d' == c)
    {
        scene.debug = !scene.debug;
        setClipDebug(scene.debug);
    }
    else if('D')
        setRastDebug(!rastDebug);
    else if('1' == c)
        useRenderer1 = true;
    else if('2' == c)
        useRenderer1 = false;
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

    updateParameters();
}

function resetInterval(recreate)
{
    clearInterval(timerHandle);

    if(recreate)
        timerHandle = setInterval(displayFunc, 1000/fps);
}
function updateParameters()
{
    planetOrbitRot += 1;
    moonOrbitRot += 5;
    moonAxisRot -= 10;

    rotate();
}

function rotate()
{
    sun = sun.transform(Matrix.rotateX(ecliptic)
           .timesMatrix(Matrix.rotateY(planetOrbitRot)));

    const p = scene.getPosition(0).changeModel(sun);
    scene.setPosition(0, p);

    planet = planet.transform(Matrix.translate(planetOrbitRadius, 0, 0)
                 .timesMatrix(Matrix.rotateY(moonOrbitRot)));
    sun.setNestedModel(0, planet);

    moon = moon.transform(Matrix.translate(moonOrbitRadius, 0, 0)
             .timesMatrix(Matrix.rotateY(moonAxisRot)));
    planet.setNestedModel(0, moon);

    displayFunc();
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
    console.log("Use the 'h' key to redisplay this help message.");
}