/*
 * Renderer 8. The MIT License (MIT).
 * Copyright (c) Roger Kraft (rlkraft@pnw.edu).
 * See LICENSE for details.
*/

import {Scene, Position, Matrix} from "../../renderer/scene/SceneExport.js";
import {Color, Framebuffer} from "../../renderer/framebuffer/FramebufferExport.js";
import * as ModelShading from "../../renderer/scene/util/ModelShading.js";
import { format } from "../../renderer/scene/util/StringFormat.js";

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

const solarSys_p = Position.buildFromName();
const sun_p = Position.buildFromName();
const planetMoon_p = Position.buildFromName();
const planet_p = Position.buildFromName();
const moon_p = Position.buildFromName();

/*
   See the above picture of the tree that this code creates.
*/

// Create the Position that holds the whole solar system.
scene.addPosition(new Position("SolarSystem"));
solarSys_p = scene.getPosition(0);

// Create the sun.
solarSys_p.addNestedPosition(new Position(new Sphere(1.0, 10, 10), "Sun"));
ModelShading.setColor(solarSys_p.getNestedPosition(0).getModel(), Color.yellow);
sun_p = solarSys_p.getNestedPosition(0);

// Create the Position that holds the planet-moon system.
solarSys_p.addNestedPosition(new Position("PlanetMoon"));
planetMoon_p = solarSys_p.getNestedPosition(1);

// Create the planet.
planetMoon_p.addNestedPosition(new Position(new Sphere(0.5, 10, 10), "Planet"));
ModelShading.setColor(planetMoon_p.getNestedPosition(0).getModel(), Color.blue);
planet_p = planetMoon_p.getNestedPosition(0);

// Create the moon.
planetMoon_p.addNestedPosition(new Position(new Sphere(0.2, 10, 10), "Moon"));
ModelShading.setColor(planetMoon_p.getNestedPosition(1).getModel(), Color.green);
moon_p = planetMoon_p.getNestedPosition(1);

// Implement the ActionListener interface.
@Override public void actionPerformed(ActionEvent e)
{
    //System.out.println( e );
    // Push the solar system away from where the camera is.
    solarSys_p.matrix2Identity()
              .mult( Matrix.translate(0, 0, -8) );
    // Rotate the plane of the ecliptic
    // (rotate the solar system's xz-plane about the x-axis).
    solarSys_p.getMatrix().mult( Matrix.rotateX(ecliptic) );
    // Set the model matrices for the nested positions.
    sun_p.matrix2Identity()
         .mult( Matrix.rotateY(sunAxisRot) );
    planetMoon_p.matrix2Identity()
                .mult( Matrix.translate(
                  planetOrbitRadius * Math.cos(planetOrbitRot * Math.PI/180),
                  0,
                  planetOrbitRadius * Math.sin(planetOrbitRot * Math.PI/180)) );
    planet_p.matrix2Identity()
            .mult( Matrix.rotateY(planetAxisRot) );
    moon_p.matrix2Identity()
          .mult( Matrix.translate(
                   moonOrbitRadius * Math.cos(moonOrbitRot * Math.PI/180),
                   0,
                   moonOrbitRadius * Math.sin(moonOrbitRot * Math.PI/180)) )
          .mult( Matrix.rotateY(moonAxisRot) );
    // Update the parameters for the next frame.
    sunAxisRot -= 10.0;
    planetOrbitRot += 1.0;
    planetAxisRot -= 5.0;
    moonOrbitRot += 5.0;
    moonAxisRot += 10.0;

