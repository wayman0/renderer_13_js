/*
 * Renderer 8. The MIT License (MIT).
 * Copyright (c) Roger Kraft (rlkraft@pnw.edu).
 * See LICENSE for details.
*/

import {Scene, Position, Matrix} from "../../renderer/scene/SceneExport.js";
import {Color, FrameBuffer} from "../../renderer/framebuffer/FramebufferExport.js";
import {Sphere} from "../../renderer/models_L/ModelsExport.js";
import * as ModelShading from "../../renderer/scene/util/ModelShading.js";
import { format } from "../../renderer/scene/util/StringFormat.js";
import { doAntiAliasing, doGamma, rastDebug, renderFB, setClipDebug, setDoAntiAliasing, setDoGamma, setRastDebug } from "../../renderer/pipeline/PipelineExport.js";

/**
   Draw an animation of a solar system with a sun, planet, and moon.
<p>
   In this version, the orbit of the planet is independent of the
   rotation of the sun, and the orbit of the moon is independent
   of the rotation of the planet. This version has the exact same
   scene graph structure as v2a, but this version uses different matrices.
<pre>{@code
           Scene
             |
             |
          Position
         /   |     \
        /    |      \
  Matrix   Model    nested Positions
    I     (empty)    /           \
                    /             \
               Position            Position
               /     \             /   |   \
              /       \           /    |    \
         Matrix     Model     Matrix  Model  nested Positions
           R        (sun)       T    (empty)  /            \
                                             /              \
                                            /                \
                                      Position            Position
                                      /     \              /     \
                                     /       \            /       \
                                 Matrix     Model      Matrix     Model
                                   R       (planet)      TR      (moon)
}</pre>
*/

let planetOrbitRadius = 5.0;
let   moonOrbitRadius = 1.0;

let planetOrbitRot = 0.0;
let   moonOrbitRot = 0.0;

let    sunAxisRot = 0.0;
let planetAxisRot = 0.0;
let   moonAxisRot = 0.0;

let ecliptic = 7.0; // angle of the ecliptic plane

const scene = Scene.buildFromName("Solar System 2b");

const solarSys_p = Position.buildFromName("Solar System");
const sun_p = Position.buildFromName("Sun");
const planetMoon_p = Position.buildFromName("PlanetMoon");
const planet_p = Position.buildFromName("Planet");
const moon_p = Position.buildFromName("Moon");

/*
   See the above picture of the tree that this code creates.
*/

// Create the Position that holds the whole solar system.
scene.addPosition(solarSys_p);

// Create the sun.
sun_p.setModel(new Sphere(1, 10, 10));
ModelShading.setColor(sun_p.getModel(), Color.yellow);
solarSys_p.addNestedPosition(sun_p);

// Create the Position that holds the planet-moon system.
solarSys_p.addNestedPosition(planetMoon_p);

// Create the planet.
planet_p.setModel(new Sphere(.4, 10, 10));
ModelShading.setColor(planet_p.getModel(), Color.blue);
planetMoon_p.addNestedPosition(planet_p);

// Create the moon.
moon_p.setModel(new Sphere(.2, 10, 10));
ModelShading.setColor(moon_p.getModel(), Color.green);
planetMoon_p.addNestedPosition(moon_p);

// Push the solar system away from where the camera is.
solarSys_p.matrix2Identity()
          .mult(Matrix.translate(0, 0, -8));

// Rotate the plane of the ecliptic
// (rotate the solar system's xz-plane about the x-axis).
solarSys_p.getMatrix().mult(Matrix.rotateX(ecliptic));

// Set the model matrices for the nested positions.
sun_p.matrix2Identity()
     .mult(Matrix.rotateY(sunAxisRot));

planetMoon_p.matrix2Identity()
            .mult(Matrix.translate(
                           planetOrbitRadius * Math.cos(planetOrbitRot * Math.PI/180),
                           0,
                           planetOrbitRadius * Math.sin(planetOrbitRot * Math.PI/180)));

planet_p.matrix2Identity()
        .mult(Matrix.rotateY(planetAxisRot));

moon_p.matrix2Identity()
      .mult(Matrix.translate(
                        moonOrbitRadius * Math.cos(moonOrbitRot * Math.PI/180),
                        0,
                        moonOrbitRadius * Math.sin(moonOrbitRot * Math.PI/180)))
      .mult( Matrix.rotateY(moonAxisRot));

try
{
    document;
    runOnline();
}
catch(e)
{
    runOffline();
}

function updateParameters()
{
   // Update the parameters for the next frame.
   sunAxisRot -= 10.0;
   planetOrbitRot += 1.0;
   planetAxisRot -= 5.0;
   moonOrbitRot += 5.0;
   moonAxisRot += 10.0;
}

function rotate()
{
   // Push the solar system away from where the camera is.
   solarSys_p.matrix2Identity()
             .mult(Matrix.translate(0, 0, -8));

   // Rotate the plane of the ecliptic
   // (rotate the solar system's xz-plane about the x-axis).
   solarSys_p.getMatrix().mult(Matrix.rotateX(ecliptic));

   // Set the model matrices for the nested positions.
   sun_p.matrix2Identity()
        .mult(Matrix.rotateY(sunAxisRot));

   planetMoon_p.matrix2Identity()
               .mult(Matrix.translate(
                              planetOrbitRadius * Math.cos(planetOrbitRot * Math.PI/180),
                              0,
                              planetOrbitRadius * Math.sin(planetOrbitRot * Math.PI/180)));

   planet_p.matrix2Identity()
           .mult(Matrix.rotateY(planetAxisRot));

   moon_p.matrix2Identity()
         .mult(Matrix.translate(
                           moonOrbitRadius * Math.cos(moonOrbitRot * Math.PI/180),
                           0,
                           moonOrbitRadius * Math.sin(moonOrbitRot * Math.PI/180)))
         .mult( Matrix.rotateY(moonAxisRot));    
}

function runOnline()
{
    document.addEventListener("keypress", keyPressed);
    const resizer = new ResizeObserver(display);
    resizer.observe(document.getElementById("resizer"));

    let timer = null;

    displayNextFrame();

    function displayNextFrame()
    {
        timer = setInterval(function()
        {
            const startTime = new Date().getTime();
            updateParameters();
            rotate();
            display();
            const stopTime = new Date().getTime();
            //console.log("Wall clock time: " + (stopTime - startTime));
        }, 1000/50);
    }

    function display()
    {
        const resizer = document.getElementById("resizer");
        const w = resizer?.offsetWidth;
        const h = resizer?.offsetHeight;

        const ctx = document.getElementById("pixels").getContext("2d");
        if(ctx == null)
        {
            console.log("ctx is null");
            return;
        }

        ctx.canvas.width = w;
        ctx.canvas.height = h;

        const fb = new FrameBuffer(w, h);
        renderFB(scene, fb);

        ctx.putImageData(new ImageData(fb.pixelBuffer, fb.width, fb.height), fb.vp.vp_ul_x, fb.vp.vp_ul_y);   
    }

    function keyPressed(e)
    {
        const c = e.key;

        if ('h' == c)
        {
            printHelpMessage();
            return;
        }
        else if ('d' == c && e.altKey)
        {
            console.log();
            console.log(scene.toString());
        }
        else if ('d' == c)
        {
            scene.debug = ! scene.debug;
            setClipDebug(scene.debug);
        }
        else if ('D' == c)
        {
            setRastDebug(!rastDebug);
        }
        else if ('a' == c)
        {
            setDoAntiAliasing(!doAntiAliasing);
            console.log("Anti-aliasing is turned ");
            console.log(doAntiAliasing ? "On" : "Off");
        }
        else if ('g' == c)
        {
            setDoGamma(doGamma);
            console.log("Gamma correction is turned ");
            console.log(doGamma ? "On" : "Off");
        }
        else if ('s' == c)
        {
            // Stop the animation.
            clearInterval(timer);
        }
        else if ('S' == c)
        {
            // Start the animation.
            displayNextFrame();
        }
        else if ('p' == c)
        {
            scene.getCamera().perspective = ! scene.getCamera().perspective;
            const p = scene.getCamera().perspective ? "perspective" : "orthographic";
            console.log("Using " + p + " projection");
        }
        else if ('e' == c)
        {
            ecliptic -= 1;
            console.log("ecliptic = " + ecliptic);
        }
        else if ('E' == c)
        {
            ecliptic += 1;
            console.log("ecliptic = " + ecliptic);
        }

        // Set up the camera's view volume.
        if (scene.getCamera().perspective)
            scene.getCamera().projPerspective(-1, 1, -1, 1, 1);
        else
            scene.getCamera().projOrtho(-6, 6, -6, 6, -1);
    }

    function printHelpMessage()
    {
        console.log("Use the 'd' key to toggle debugging information on and off.");
        console.log("Use the 'Alt-d' key combination to print the Scene data structure.");
        console.log("Use the 'a' key to toggle antialiasing on and off.");
        console.log("Use the 'g' key to toggle gamma correction on and off.");
        console.log("Use the 's/S' key to stop/Start the animation.");
        console.log("Use the 'p' key to toggle between parallel and orthographic projection.");
        console.log("Use the e/E keys to change the angle of the ecliptic plane.");
        console.log("Use the '+' key to save a \"screenshot\" of the framebuffer.");
        console.log("Use the 'h' key to redisplay this help message.");
    }
    
}

function runOffline()
{
    const fb = new FrameBuffer(1000, 1000, Color.black);

    for(let r = 0; r < 360; r += 1)
    {
        updateParameters();
        rotate();

        renderFB(scene, fb);
        fb.dumpFB2File(format("SolarSystem-Frame%03d.ppm", r));

        fb.clearFB();
    }
}