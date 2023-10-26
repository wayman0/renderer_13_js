/*
 * Renderer 8. The MIT License (MIT).
 * Copyright (c) Roger Kraft (rlkraft@pnw.edu).
 * See LICENSE for details.
*/

import {Matrix, Position, Scene} from "../../renderer/scene/SceneExport.js";
import {Color, FrameBuffer} from "../../renderer/framebuffer/FramebufferExport.js";
import {Sphere} from "../../renderer/models_L/ModelsExport.js";
import * as ModelShading from "../../renderer/scene/util/UtilExport.js";
import { format } from "../../renderer/scene/util/UtilExport.js";
import { doAntiAliasing, doGamma, rastDebug, renderFB, setClipDebug, setDoAntiAliasing, setDoGamma, setRastDebug } from "../../renderer/pipeline/PipelineExport.js";

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
             |
             |
          Position
         /   |     \
        /    |      \
  Matrix   Model    nested Positions
    R      (sun)          |
                          |
                       Position
                      /   |   \
                     /    |    \
               Matrix   Model   nested Positions
                 TR    (planet)      |
                                     |
                                  Position
                                 /   |    \
                                /    |     \
                            Matrix  Model   nested Positions
                              TR   (moon)       |
                                                |
                                              empty
}</pre>
*/

let planetOrbitRadius = 5.0;
let   moonOrbitRadius = 1.0;

let planetOrbitRot = 0.0;
let   moonOrbitRot = 0.0;

let  moonAxisRot = 0.0;

let ecliptic = 7.0; // angle of the ecliptic plane

const scene = Scene.buildFromName("Solar System");

const sun_p = Position.buildFromName("Sun");
const planetMoon_p = Position.buildFromName("Planet");
const moon_p = Position.buildFromName("Moon");

/**
   This constructor instantiates the Scene object
   and initializes it with appropriate geometry.
   Then this constructor instantiates the GUI.
*/

 /*
   See the above picture of the tree that this code creates.
 */

// Create the sun.
sun_p.setModel(new Sphere(1.0, 10, 10));
ModelShading.setColor(sun_p.getModel(), Color.yellow);
scene.addPosition(sun_p);

// Create the planet.
planetMoon_p.setModel(new Sphere(.5, 10, 10));
sun_p.addNestedPosition(planetMoon_p);
ModelShading.setColor(planetMoon_p.getModel(), Color.blue);

// Create the planet's moon.
moon_p.setModel(new Sphere(.2, 10, 10));
planetMoon_p.addNestedPosition(moon_p);
ModelShading.setColor(moon_p.getModel(), Color.green);

// Push the solar system away from where the camera is.
sun_p.matrix2Identity()
        .mult(Matrix.translate(0, 0, -8));

// Rotate the plane of the ecliptic
// Rotate the sun on it axis.
sun_p.getMatrix().mult(Matrix.rotateX(ecliptic));
sun_p.getMatrix().mult(Matrix.rotateY(planetOrbitRot));

// Place the planet-moon away from the sun and rotate the planet-moon on its axis.
planetMoon_p.matrix2Identity()
            .mult(Matrix.translate(planetOrbitRadius, 0, 0))
            .mult(Matrix.rotateY(moonOrbitRot));

// Place the moon away from the planet and rotate the moon on its axis.
moon_p.matrix2Identity()
        .mult(Matrix.translate(moonOrbitRadius, 0, 0))
        .mult(Matrix.rotateY(moonAxisRot));




runOnline();

function updateParameters()
{
    // Update the parameters for the next frame.
    planetOrbitRot += 1.0;
    moonOrbitRot += 5.0;
    moonAxisRot -= 10.0;
}

function rotate()
{
    // Push the solar system away from where the camera is.
    sun_p.matrix2Identity()
        .mult(Matrix.translate(0, 0, -8));
    // Rotate the plane of the ecliptic
    // Rotate the sun on it axis.
    sun_p.getMatrix().mult(Matrix.rotateX(ecliptic));
    sun_p.getMatrix().mult(Matrix.rotateY(planetOrbitRot));
    // Place the planet-moon away from the sun and rotate the planet-moon on its axis.
    planetMoon_p.matrix2Identity()
                .mult(Matrix.translate(planetOrbitRadius, 0, 0))
                .mult(Matrix.rotateY(moonOrbitRot));
    // Place the moon away from the planet and rotate the moon on its axis.
    moon_p.matrix2Identity()
            .mult(Matrix.translate(moonOrbitRadius, 0, 0))
            .mult(Matrix.rotateY(moonAxisRot));
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