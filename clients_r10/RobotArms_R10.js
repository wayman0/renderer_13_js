/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import {Scene, Matrix, Model, Position, Vertex} from "../renderer/scene/SceneExport.js";
import {FrameBuffer, Viewport, Color} from "../renderer/framebuffer/FramebufferExport.js";
import {render, renderFB, setRastDebug, setDoAntiAliasing} from "../renderer/pipeline/PipelineExport.js";
import {LineSegment} from "../renderer/scene/primitives/PrimitiveExport.js";
import {format} from "../renderer/scene/util/UtilExport.js";

/**
 * @param {Model} model the arm segment model to be made
 * @param {Color} color the color of the arm segment
 */
function buildArmSegment(model, color)
{
    model.addVertex(new Vertex(0, 0, 0),
                    new Vertex(0, 1, 0));
    model.addColor(color);
    model.addPrimitive(LineSegment.buildVertexColor(0, 1, 0));
}

let shoulderLength = .4;
let elbowLength = .3;
let wristLength = .2;
let fingerLength = .1;

// build the finger structure
let arm1Finger1Mod = Model.buildName("Arm 1: Finger 1");
buildArmSegment(arm1Finger1Mod,  new Color(0, Math.trunc(3/3 * 255), Math.trunc(0/3 * 255)));
let arm1Finger1Pos = Position.buildFromModelName(arm1Finger1Mod, "Arm 1 Finger 1 Position");
arm1Finger1Pos.setMatrix(Matrix.translate(0, 1, 0)
                                .mult(Matrix.rotateZ(-15))
                                .mult(Matrix.scaleXYZ(fingerLength / wristLength, fingerLength/wristLength, 1)));


let arm1Finger2Mod = Model.buildName("Arm 1: Finger 2");
buildArmSegment(arm1Finger2Mod,  new Color(0, Math.trunc(3/3 * 255), Math.trunc(0/3 * 255)));
let arm1Finger2Pos = Position.buildFromModelName(arm1Finger2Mod, "Arm 1 Finger 2 Position");
arm1Finger2Pos.setMatrix(Matrix.translate(0, 1, 0)
                                .mult(Matrix.rotateZ(15))
                                .mult(Matrix.scaleXYZ(fingerLength / wristLength, fingerLength / wristLength, 1)));

// build the wrist structure
let arm1Wrist1Mod = Model.buildName("Arm 1: Wrist 1");
buildArmSegment(arm1Wrist1Mod,   new Color(0, Math.trunc(2/3 * 255), Math.trunc(1/3 * 255)));
let arm1Wrist1Pos = Position.buildFromModelName(arm1Wrist1Mod, "Arm 1 Wrist 1 Position");
arm1Wrist1Pos.addNestedPosition(arm1Finger1Pos);
arm1Wrist1Pos.setMatrix(Matrix.translate(0, 1, 0)
                                .mult(Matrix.rotateZ(-15)
                                .mult(Matrix.scaleXYZ(wristLength / elbowLength, wristLength / elbowLength, 1))));

let arm1Wrist2Mod = Model.buildName("Arm 1: Wrist 2");
buildArmSegment(arm1Wrist2Mod,   new Color(0, Math.trunc(2/3 * 255), Math.trunc(1/3 * 255)));
let arm1Wrist2Pos = Position.buildFromModelName(arm1Wrist2Mod, "Arm 1 Wrist 2 Position");
arm1Wrist2Pos.addNestedPosition(arm1Finger2Pos);
arm1Wrist2Pos.setMatrix(Matrix.translate(0, 1, 0)
                                .mult(Matrix.rotateZ(15)
                                .mult(Matrix.scaleXYZ(wristLength / elbowLength, wristLength / elbowLength, 1))));


// build the elbow structure
let arm1Elbow1Mod = Model.buildName("Arm 1: Elbow 1");
buildArmSegment(arm1Elbow1Mod,   new Color(0, Math.trunc(1/3 * 255), Math.trunc(2/3 * 255)));
let arm1Elbow1Pos = Position.buildFromModelName(arm1Elbow1Mod, "Arm 1 Elbow 1 Position");
arm1Elbow1Pos.addNestedPosition(arm1Wrist1Pos);
arm1Elbow1Pos.setMatrix(Matrix.translate(0, 1, 0)
                                .mult(Matrix.rotateZ(-15)
                                .mult(Matrix.scaleXYZ(elbowLength / shoulderLength, elbowLength / shoulderLength, 1))));

let arm1Elbow2Mod = Model.buildName("Arm 1: Elbow 2");
buildArmSegment(arm1Elbow2Mod,   new Color(0, Math.trunc(1/3 * 255), Math.trunc(2/3 * 255)));
let arm1Elbow2Pos = Position.buildFromModelName(arm1Elbow2Mod, "Arm 1 elbow 2 Position");
arm1Elbow2Pos.addNestedPosition(arm1Wrist2Pos);
arm1Elbow2Pos.setMatrix(Matrix.translate(0, 1, 0)
                                .mult(Matrix.rotateZ(15)
                                .mult(Matrix.scaleXYZ(elbowLength / shoulderLength, elbowLength / shoulderLength, 1))));

// build the shoulder structure
let arm1ShoulderMod = Model.buildName("Arm 1: Shoulder");
buildArmSegment(arm1ShoulderMod, new Color(0, Math.trunc(0/3 * 255), Math.trunc(3/3 * 255)));
let arm1ShoulderPos = Position.buildFromModelName(arm1ShoulderMod, "Arm 1 Shoulder Position");
arm1ShoulderPos.addNestedPosition(arm1Elbow1Pos, arm1Elbow2Pos);
arm1ShoulderPos.setMatrix(Matrix.translate(-.5, -.5, -1)
                                .mult(Matrix.scaleXYZ(shoulderLength, shoulderLength, 1)));


// build the second arm
// build the finger structure
let arm2Finger1Mod = Model.buildName("Arm 1: Finger 1");
buildArmSegment(arm2Finger1Mod,  new Color(Math.trunc(3/3 * 255), Math.trunc(0/3 * 255), 0));
let arm2Finger1Pos = Position.buildFromModelName(arm2Finger1Mod, "Arm 1 Finger 1 Position");
arm2Finger1Pos.setMatrix(Matrix.translate(0, 1, 0)
                                .mult(Matrix.rotateZ(-15))
                                .mult(Matrix.scaleXYZ(fingerLength / wristLength, fingerLength/wristLength, 1)));


let arm2Finger2Mod = Model.buildName("Arm 1: Finger 2");
buildArmSegment(arm2Finger2Mod,  new Color(Math.trunc(3/3 * 255), Math.trunc(0/3 * 255), 0));
let arm2Finger2Pos = Position.buildFromModelName(arm2Finger2Mod, "Arm 1 Finger 2 Position");
arm2Finger2Pos.setMatrix(Matrix.translate(0, 1, 0)
                                .mult(Matrix.rotateZ(15))
                                .mult(Matrix.scaleXYZ(fingerLength / wristLength, fingerLength / wristLength, 1)));

// build the wrist structure
let arm2Wrist1Mod = Model.buildName("Arm 1: Wrist 1");
buildArmSegment(arm2Wrist1Mod,   new Color(Math.trunc(2/3 * 255), Math.trunc(1/3 * 255), 0));
let arm2Wrist1Pos = Position.buildFromModelName(arm2Wrist1Mod, "Arm 1 Wrist 1 Position");
arm2Wrist1Pos.addNestedPosition(arm2Finger1Pos);
arm2Wrist1Pos.setMatrix(Matrix.translate(0, 1, 0)
                                .mult(Matrix.rotateZ(-15)
                                .mult(Matrix.scaleXYZ(wristLength / elbowLength, wristLength / elbowLength, 1))));

let arm2Wrist2Mod = Model.buildName("Arm 1: Wrist 2");
buildArmSegment(arm2Wrist2Mod,   new Color(Math.trunc(2/3 * 255), Math.trunc(1/3 * 255), 0));
let arm2Wrist2Pos = Position.buildFromModelName(arm2Wrist2Mod, "Arm 1 Wrist 2 Position");
arm2Wrist2Pos.addNestedPosition(arm2Finger2Pos);
arm2Wrist2Pos.setMatrix(Matrix.translate(0, 1, 0)
                                .mult(Matrix.rotateZ(15)
                                .mult(Matrix.scaleXYZ(wristLength / elbowLength, wristLength / elbowLength, 1))));


// build the elbow structure
let arm2Elbow1Mod = Model.buildName("Arm 1: Elbow 1");
buildArmSegment(arm2Elbow1Mod,   new Color(Math.trunc(1/3 * 255), Math.trunc(2/3 * 255), 0));
let arm2Elbow1Pos = Position.buildFromModelName(arm2Elbow1Mod, "Arm 1 Elbow 1 Position");
arm2Elbow1Pos.addNestedPosition(arm2Wrist1Pos);
arm2Elbow1Pos.setMatrix(Matrix.translate(0, 1, 0)
                                .mult(Matrix.rotateZ(-15)
                                .mult(Matrix.scaleXYZ(elbowLength / shoulderLength, elbowLength / shoulderLength, 1))));

let arm2Elbow2Mod = Model.buildName("Arm 1: Elbow 2");
buildArmSegment(arm2Elbow2Mod,   new Color(Math.trunc(1/3 * 255), Math.trunc(2/3 * 255), 0));
let arm2Elbow2Pos = Position.buildFromModelName(arm2Elbow2Mod, "Arm 1 elbow 2 Position");
arm2Elbow2Pos.addNestedPosition(arm2Wrist2Pos);
arm2Elbow2Pos.setMatrix(Matrix.translate(0, 1, 0)
                                .mult(Matrix.rotateZ(15)
                                .mult(Matrix.scaleXYZ(elbowLength / shoulderLength, elbowLength / shoulderLength, 1))));

// build the shoulder structure
let arm2ShoulderMod = Model.buildName("Arm 1: Shoulder");
buildArmSegment(arm2ShoulderMod, new Color(Math.trunc(0/3 * 255), Math.trunc(3/3 * 255), 0));
let arm2ShoulderPos = Position.buildFromModelName(arm2ShoulderMod, "Arm 1 Shoulder Position");
arm2ShoulderPos.addNestedPosition(arm2Elbow1Pos, arm2Elbow2Pos);
arm2ShoulderPos.setMatrix(Matrix.translate(.5, -.5, -1)
                                .mult(Matrix.scaleXYZ(shoulderLength, shoulderLength, 1)));

let scene = new Scene();
scene.addPosition(arm1ShoulderPos, arm2ShoulderPos);


let fb = new FrameBuffer(1000, 1000);

setDoAntiAliasing(true);
render(scene, fb.vp);
fb.dumpFB2File("Robot Arm.ppm");


// rotate just the shoulder position to
// demonstrate how nested positions works
for(let x = -45; x <= 45; x += 5)
{
    fb.clearFBDefault();
    arm1ShoulderPos.setMatrix(
        Matrix.translate(0, -.5, -1)
              .mult(Matrix.rotateZ(x))
              .mult(Matrix.scaleXYZ(shoulderLength, shoulderLength, 1)));

    arm2ShoulderPos.setMatrix(
        Matrix.translate(0, .5, -1)
                .mult(Matrix.rotateZ(x))
                .mult(Matrix.scaleXYZ(shoulderLength, shoulderLength, 1)));

    render(scene, fb.vp);
    fb.dumpFB2File(format("Robot Arm Rotate Shoulder %03d.ppm", x));
}

for(let x = -45; x <= 45; x += 5)
{
    fb.clearFBDefault();

    arm1Elbow1Pos.setMatrix(
        Matrix.translate(0, 1, 0)
              .mult(Matrix.rotateZ(x))
              .mult(Matrix.scaleXYZ(elbowLength / shoulderLength, elbowLength / shoulderLength, 1)));

    arm1Elbow2Pos.setMatrix(
        Matrix.translate(0, 1, 0)
              .mult(Matrix.rotateZ(-x))
              .mult(Matrix.scaleXYZ(elbowLength / shoulderLength, elbowLength / shoulderLength, 1)));

    render(scene, fb.vp);
    fb.dumpFB2File(format("Robot Arm Rotate Wrist 1 %03d, Rotate Wrist 2 -%03d.ppm", x, x));
}

for(let x = -45; x <= 45; x += 5)
{
    fb.clearFBDefault();

    arm1Wrist1Pos.setMatrix(
        Matrix.translate(0, 1, 0)
              .mult(Matrix.rotateZ(x))
              .mult(Matrix.scaleXYZ(wristLength / elbowLength, wristLength / elbowLength, 1)));

    arm1Wrist2Pos.setMatrix(
        Matrix.translate(0, 1, 0)
              .mult(Matrix.rotateZ(-x))
              .mult(Matrix.scaleXYZ(wristLength / elbowLength, wristLength / elbowLength, 1)));

    render(scene, fb.vp);
    fb.dumpFB2File(format("Robot Arm Rotate Wrist 1 %03d, Rotate Wrist 2 -%03d.ppm", x, x));
}

for(let x = -45; x <= 45; x += 5)
{
    fb.clearFBDefault();
    arm1Finger1Pos.setMatrix(
        Matrix.translate(0, 1, 0)
              .mult(Matrix.rotateZ(x))
              .mult(Matrix.scaleXYZ(fingerLength / wristLength, fingerLength / wristLength, 1)));

    arm1Finger2Pos.setMatrix(
      Matrix.translate(0, 1, 0)
            .mult(Matrix.rotateZ(-x))
            .mult(Matrix.scaleXYZ(fingerLength / wristLength, fingerLength / wristLength, 1)));

    render(scene, fb.vp);
    fb.dumpFB2File(format("Robot Arm Rotate Wrist 1 %03d, Rotate Wrist 2 -%03d.ppm", x, x));
}








