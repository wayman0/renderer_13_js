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

    return model;
}

const xTranslation = new Array(0.0,  0.0);
const yTranslation = new Array(0.5, -0.5);

const shoulderRotation = new Array(0.0, 0.0);
const elbowRotation1   = new Array( 15,  15);
const elbowRotation2   = new Array(-15, -15);
const wristRotation1   = new Array(0.0, 0.0);
const wristRotation2   = new Array(0.0, 0.0);
const fingerRotation1  = new Array(0.0, 0.0);
const fingerRotation2  = new Array(0.0, 0.0);

const shoulderLength = new Array(0.4, 0.4);
const elbowLength1   = new Array(0.3, 0.3);
const elbowLength2   = new Array(0.3, 0.3);
const wristLength1   = new Array(0.2, 0.2);
const wristLength2   = new Array(0.2, 0.2);
const fingerLength1  = new Array(0.1, 0.1);
const fingerLength2  = new Array(0.1, 0.1);

const scene = Scene.buildFromName("RobotArms_R10");
const currentArm = 0;

const arm1_s = Position.buildFromName("arm_1");
const arm2_s = Position.buildFromName("arm_2");

scene.addPosition(arm1_s, arm2_s);

// first arm
arm1_s.setModel(buildArmSegment(Model.buildName("Arm-1, shoulder"), Color.blue));

// two elbows
const arm1_e1 = Position.buildFromName("Elbow_1");
const arm1_e2 = Position.buildFromName("Elbow_2");
arm1_s.addNestedPosition(arm1_e1)
arm1_e2.addNestedPosition(arm1_e2);
arm1_e1.setModel(buildArmSegment(Model.buildName("Arm1, elbow1"), Color.blue));
arm1_e2.setModel(buildArmSegment(Model.buildName("Arm1, elbow2"), Color.blue));

//two wrists
const arm1_w1 = Position.buildFromName("wrist_1");
const arm1_w2 = Position.buildFromName("wrist_2");
arm1_e1.addNestedPosition(arm1_w1)
arm1_e2.addNestedPosition(arm1_w2);
arm1_w1.setModel(buildArmSegment(Model.buildName("Arm1, wrist1"), Color.blue));
arm1_w2.setModel(buildArmSegment(Model.buildName("Arm1, wrist2"), Color.blue));

//two fingers
const arm1_f1 = Position.buildFromName("finger_1");
const arm1_f2 = Position.buildFromName("finger_2");
arm1_w1.addNestedPosition(arm1_f1);
arm1_w2.addNestedPosition(arm1_f2);
arm1_f1.setModel(buildArmSegment(Model.buildName("Arm1, finger1"), Color.blue));
arm1_f2.setModel(buildArmSegment(Model.buildName("Arm1, finger2"), Color.blue));

//second arm
arm2_s.setModel(buildArmSegment(Model.buildName("Arm-2, shoulder"), Color.red));

// two elbows
const arm2_e1 = Position.buildFromName("Elbow_1");
const arm2_e2 = Position.buildFromName("Elbow_2");
arm2_s.addNestedPosition(arm2_e1)
arm2_e2.addNestedPosition(arm2_e2);
arm2_e1.setModel(buildArmSegment(Model.buildName("Arm2, elbow1"), Color.red));
arm2_e2.setModel(buildArmSegment(Model.buildName("Arm2, elbow2"), Color.red));

//two wrists
const arm2_w1 = Position.buildFromName("wrist_1");
const arm2_w2 = Position.buildFromName("wrist_2");
arm2_e1.addNestedPosition(arm2_w1)
arm2_e2.addNestedPosition(arm2_w2);
arm2_w1.setModel(buildArmSegment(Model.buildName("Arm2, wrist1"), Color.red));
arm2_w2.setModel(buildArmSegment(Model.buildName("Arm2, wrist2"), Color.red));

//two fingers
const arm2_f1 = Position.buildFromName("finger_1");
const arm2_f2 = Position.buildFromName("finger_2");
arm2_w1.addNestedPosition(arm2_f1);
arm2_w2.addNestedPosition(arm2_f2);
arm2_f1.setModel(buildArmSegment(Model.buildName("Arm2, finger1"), Color.red));
arm2_f2.setModel(buildArmSegment(Model.buildName("Arm2, finger2"), Color.red));

const arm_p     = new Array(arm1_s,  arm2_s);
const elbow1_p  = new Array(arm1_e1, arm2_e1);
const elbow2_p  = new Array(arm1_e2, arm2_e2);
const wrist1_p  = new Array(arm1_w1, arm2_w1);
const wrist2_p  = new Array(arm1_w2, arm2_w2);
const finger1_p = new Array(arm1_f1, arm2_f1);
const finger2_p = new Array(arm1_f2, arm2_f2);

// initilaize the nested matrices for the sub models
//first arm
arm_p[0].matrix2Identity()
        .mult(Matrix.translate(xTranslation[0], yTranslation[0], -1))
        .mult(Matrix.scaleXYZ(shoulderLength[0], shoulderLength[0], 1))

elbow1_p[0].matrix2Identity()
            .mult(Matrix.translate(1, 0, 0))
            .mult(Matrix.rotateZ(elbowRotation1[0]))
            .mult(Matrix.scaleXYZ(elbowLength1[0]/shoulderLength[0], 
                                  elbowLength1[0]/shoulderLength[0], 
                                  1));

elbow2_p[0].matrix2Identity()
            .mult(Matrix.translate(1, 0, 0))
            .mult(Matrix.rotateZ(elbowRotation2[0]))
            .mult(Matrix.scaleXYZ(elbowLength2[0]/shoulderLength[0], 
                                  elbowLength2[0]/shoulderLength[0], 
                                  1));
                      
wrist1_p[0].matrix2Identity()
            .mult(Matrix.translate(1, 0, 0))
            .mult(Matrix.scaleXYZ(wristLength1[0]/elbowLength1[0],
                                  wristLength1[0]/elbowLength1[0],
                                  1));
                 
wrist2_p[0].matrix2Identity()
           .mult(Matrix.translate(1, 0, 0))
           .mult(Matrix.scaleXYZ(wristLength2[0]/elbowLength2[0],
                                 wristLength2[0]/elbowLength2[0],
                                 1));

finger1_p[0].matrix2Identity()
            .mult(Matrix.translate(1, 0, 0))
            .mult(Matrix.scaleXYZ(fingerLength1[0]/wristLength1[0],
                                  fingerLength1[0]/wristLength1[0],
                                  1));

finger2_p[0].matrix2Identity()
            .mult(Matrix.translate(1, 0, 0))
            .mult(Matrix.scaleXYZ(fingerLength2[0]/wristLength2[0],
                                  fingerLength2[0]/wristLength2[0],
                                  1));

// Second arm.
arm_p[1].matrix2Identity()
        .mult(Matrix.translate(xTranslation[1], yTranslation[1], -1))
        .mult(Matrix.scaleXYZ(shoulderLength[1],
                              shoulderLength[1],
                              1));

elbow1_p[1].matrix2Identity()
           .mult(Matrix.translate(1, 0, 0))
           .mult(Matrix.rotateZ(elbowRotation1[1]))
           .mult(Matrix.scaleXYZ(elbowLength1[1]/shoulderLength[1],
                                 elbowLength1[1]/shoulderLength[1],
                                 1));

elbow2_p[1].matrix2Identity()
           .mult(Matrix.translate(1, 0, 0))
           .mult(Matrix.rotateZ(elbowRotation2[1]))
           .mult(Matrix.scaleXYZ(elbowLength2[1]/shoulderLength[1],
                                 elbowLength2[1]/shoulderLength[1],
                                 1));

wrist1_p[1].matrix2Identity()
           .mult(Matrix.translate(1, 0, 0))
           .mult(Matrix.scaleXYZ(wristLength1[1]/elbowLength1[1],
                                 wristLength1[1]/elbowLength1[1],
                                 1));
wrist2_p[1].matrix2Identity()
           .mult(Matrix.translate(1, 0, 0))
           .mult(Matrix.scaleXYZ(wristLength2[1]/elbowLength2[1],
                                 wristLength2[1]/elbowLength2[1],
                                 1));

finger1_p[1].matrix2Identity()
            .mult(Matrix.translate(1, 0, 0))
            .mult(Matrix.scaleXYZ(fingerLength1[1]/wristLength1[1],
                                  fingerLength1[1]/wristLength1[1],
                                  1));

finger2_p[1].matrix2Identity()
            .mult(Matrix.translate(1, 0, 0))
            .mult(Matrix.scaleXYZ(fingerLength2[1]/wristLength2[1],
                                  fingerLength2[1]/wristLength2[1],
                                  1));
                 



try
{
    document;
    runOnline();
}
catch(e)
{
    runOffline();
}

function runOnline()
{
    document.addEventListener("keypress", keyPressed);
    const resizer = new ResizeObserver(windowResized);
    resizer.observe(document.getElementById("resizer"));
}

function keyPressed(e)
{
    const c = e.key;

    if('d' == c)
    else if('D' == c)
    else if('/' == c)
    else if('' == c)
    else if('' == c)
    else if('' == c)
    else if('' == c)
    else if('' == c)
    else if('' == c)
    else if('' == c)
    else if('' == c)
    else if('' == c)
    else if('' == c)
    else if('' == c)
    else if('' == c)
    else if('' == c)
    else if('' == c)
    else if('' == c)
    else if('' == c)
    else if('' == c)
    else if('' == c)
    else if('' == c)
    else if('' == c)
    else if('' == c)
    else if('' == c)
    else if('' == c)
    else if('' == c)
}

function printHelpMessage()
{
    console.log("Use the 'd' key to toggle debugging information on and off.");
    console.log("Use the 'D' key to print the Scene data structure.");
    console.log("Use the '/' key to toggle between the two robot arms.");
    console.log();
    console.log("Use the 'c' key to change the random solid arm color.");
    console.log("Use the 'C' key to randomly change arm segment colors.");
    console.log("Use the 'r' key to randomly change arm segment end colors.");
    console.log("Use the 'R' key to randomly change arm hinge colors.");
    console.log();
    console.log("Use the s/S keys to rotate the current arm at the shoulder.");
    console.log();
    console.log("Use the e/E keys to rotate the current arm at elbow 1.");
    console.log("Use the w/W keys to rotate the current arm at wrist 1.");
    console.log("Use the f/F keys to rotate the current arm at finger 1.");
    console.log();
    console.log("Use the q/Q keys to rotate the current arm at elbow 2.");
    console.log("Use the z/Z keys to rotate the current arm at wrist 2.");
    console.log("Use the a/A keys to rotate the current arm at finger 2.");
    console.log();
    console.log("Use the alt + s/S keys to extend the length of the current arm at the shoulder.");
    console.log();
    console.log("Use the alt + e/E keys to extend the length of the current arm at elbow 1.");
    console.log("Use the alt + w/W keys to extend the length of the current arm at wrist 1.");
    console.log("Use the alt + f/F keys to extend the length of the current arm at finger 1.");
    console.log();
    console.log("Use the alt + q/Q keys to extend the length of the current arm at elbow 2.");
    console.log("Use the alt + z/Z keys to extend the length of the current arm at wrist 2.");
    console.log("Use the alt + a/A keys to extend the length of the current arm at finger 2.");
    console.log();
    console.log("Use the x/X keys to translate the current arm along the x-axis.");
    console.log("Use the y/Y keys to translate the current arm along the y-axis.");
    console.log();
    console.log("Use the '=' key to reset the current robot arm.");
    console.log("Use the '+' key to save a \"screenshot\" of the framebuffer.");
    console.log("Use the 'h' key to redisplay this help message.");
}

function windowresized()
{

}

function runOffline()
{
    let fb = new FrameBuffer(1000, 1000);

    setDoAntiAliasing(true);
    render(scene, fb.vp);
    fb.dumpFB2File("Robot Arm.ppm");


    // rotate just the shoulder position to
    // demonstrate how nested positions works
    for(let x = -45; x <= 45; x += 5)
    {
        fb.clearFBDefault();
        arm1_s.setMatrix(
            Matrix.translate(0, -.5, -1)
                  .mult(Matrix.rotateZ(x))
                  .mult(Matrix.scaleXYZ(shoulderLength[0], shoulderLength[0], 1)));

        arm2_s.setMatrix(
            Matrix.translate(0, .5, -1)
                    .mult(Matrix.rotateZ(x))
                    .mult(Matrix.scaleXYZ(shoulderLength[1], shoulderLength[1], 1)));

        render(scene, fb.vp);
        fb.dumpFB2File(format("Robot Arm Rotate Shoulder %03d.ppm", x));
    }

    for(let x = -45; x <= 45; x += 5)
    {
        fb.clearFBDefault();

        arm1_e1.setMatrix(
            Matrix.translate(0, 1, 0)
                  .mult(Matrix.rotateZ(x))
                  .mult(Matrix.scaleXYZ(elbowLength1[0] / shoulderLength[0], elbowLength1[0] / shoulderLength[0], 1)));

        arm1_e2.setMatrix(
            Matrix.translate(0, 1, 0)
                  .mult(Matrix.rotateZ(-x))
                  .mult(Matrix.scaleXYZ(elbowLength2[0] / shoulderLength[0], elbowLength2[0] / shoulderLength[0], 1)));

        render(scene, fb.vp);
        fb.dumpFB2File(format("Robot Arm Rotate Wrist 1 %03d, Rotate Wrist 2 -%03d.ppm", x, x));
    }

    for(let x = -45; x <= 45; x += 5)
    {
        fb.clearFBDefault();

        arm1_w1.setMatrix(
            Matrix.translate(0, 1, 0)
                  .mult(Matrix.rotateZ(x))
                  .mult(Matrix.scaleXYZ(wristLength1[0] / elbowLength1[0], wristLength1[0] / elbowLength1[0], 1)));

        arm1_w2.setMatrix(
            Matrix.translate(0, 1, 0)
                  .mult(Matrix.rotateZ(-x))
                  .mult(Matrix.scaleXYZ(wristLength2[0] / elbowLength2[0], wristLength2[0] / elbowLength2[0], 1)));

        render(scene, fb.vp);
        fb.dumpFB2File(format("Robot Arm Rotate Wrist 1 %03d, Rotate Wrist 2 -%03d.ppm", x, x));
    }

    for(let x = -45; x <= 45; x += 5)
    {
        fb.clearFBDefault();
        arm1_f1.setMatrix(
            Matrix.translate(0, 1, 0)
                  .mult(Matrix.rotateZ(x))
                  .mult(Matrix.scaleXYZ(fingerLength1[0] / wristLength1[0], fingerLength1[0] / wristLength1[0], 1)));

        arm1_f1.setMatrix(
          Matrix.translate(0, 1, 0)
                .mult(Matrix.rotateZ(-x))
                .mult(Matrix.scaleXYZ(fingerLength2[0] / wristLength2[0], fingerLength2[0] / wristLength2[0], 1)));

        render(scene, fb.vp);
        fb.dumpFB2File(format("Robot Arm Rotate Wrist 1 %03d, Rotate Wrist 2 -%03d.ppm", x, x));
    }
}








