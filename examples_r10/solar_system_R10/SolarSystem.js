/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import {Matrix, Position, Scene, Model, LineSegment, Primitive} from "../../renderer/scene/SceneExport.js";
import {FrameBuffer, Color} from "../../renderer/framebuffer/FramebufferExport.js";
import * as ModelShading from "../../renderer/scene/util/UtilExport.js";
import {renderFB} from "../../renderer/pipeline/PipelineExport.js";
import {Sphere} from "../../renderer/models_L/ModelsExport.js";

const ecliptic = 23.5;

const planetRad = 3;
const moonRad = 1;

/**
 *
 * @param {Model} mod
 */
function buildAxis(mod)
{
    const axis = Model.buildName(mod.getName + ": Axis");
    axis.addVertex(mod.vertexList[100], mod.vertexList[101]);
    axis.addPrimitive(LineSegment.buildVertex(0, 1));

    return axis;
}

const scene = Scene.buildFromName("Solar System");

const moonMod = new Sphere(.2, 10, 10);
ModelShading.setColor(moonMod, Color.Gray);
const moonMat = Matrix.translate(moonRad, 0, 0);
const moonPos = new Position(moonMod, moonMat, "Moon Position");

const moonAxis = buildAxis(moonMod);
ModelShading.setColor(moonAxis, Color.gray);
const moonAxisMat = Matrix.scale(3);
const moonAxisPos = new Position(moonAxis, moonAxisMat, "Moon Axis Position");

const planetMod = new Sphere(.3, 10, 10);
ModelShading.setColor(planetMod, Color.blue);
const planetMat = Matrix.translate(planetRad, 0, 0);
const planetPos = new Position(planetMod, planetMat, "Planet Position");

const planetAxis = buildAxis(planetMod);
ModelShading.setColor(planetAxis, Color.blue);
const planetAxisMat = Matrix.scale(3);
const planetAxisPos = new Position(planetAxis, planetAxisMat, "Planet Axis Position");

const sunMod = new Sphere(1, 10, 10);
ModelShading.setColor(sunMod, Color.Yellow);
const sunMat = Matrix.translate(0, 0, -8).mult(Matrix.rotateX(ecliptic));
const sunPos = new Position(sunMod, sunMat, "Sun Position");

const sunAxis = buildAxis(sunMod);
ModelShading.setColor(sunAxis, Color.yellow);
const sunAxisMat = Matrix.scale(3);
const sunAxisPos = new Position(sunAxis, sunAxisMat, "Sun Axis Position");

moonPos.addNestedPosition(moonAxisPos);
planetPos.addNestedPosition(planetAxisPos);
sunPos.addNestedPosition(sunAxisPos);

planetPos.addNestedPosition(moonPos);
sunPos.addNestedPosition(planetPos);

scene.addPosition(sunPos);

let fb = new FrameBuffer(1024, 1024);

renderFB(scene, fb);
fb.dumpFB2File("Solar System.ppm");

for(let x = 0; x <= 72; x += 1)
{
    fb.clearFBDefault();

    // accumulate the rotations over time
    // instead of resetting the matrixes
    sunPos.getMatrix().mult(Matrix.rotateY(5));
    planetPos.getMatrix().mult(Matrix.rotateY(5));
    moonPos.getMatrix().mult(Matrix.rotateY(10));

    renderFB(scene, fb);
    fb.dumpFB2File("SolarSystem--Frame0" + x + ".ppm");
}

/*
for(let x = 0; x <= 72; x += 1)
{
    fb.clearFBDefault();

    // reset the matrixes every frame
    // instead of accumulating
    sunPos.setMatrix(Matrix.translate(0, 0, -8).mult(Matrix.rotateX(ecliptic)).mult(Matrix.rotateY(5 * x)));
    planetPos.setMatrix(Matrix.translate(planetRad, 0, 0).mult(Matrix.rotateY(5 * x)));
    moonPos.setMatrix(Matrix.translate(moonRad, 0, 0).mult(Matrix.rotateY(10*x)));

    renderFB(scene, fb);
    fb.dumpFB2File("SolarSystem(ResetMatrix)-Frame0" + x + ".ppm");
}
*/



