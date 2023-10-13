/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import {Scene, Matrix, Model, Position, Vertex} from "../renderer/scene/SceneExport.js";
import {FrameBuffer, Viewport, Color} from "../renderer/framebuffer/FramebufferExport.js";
import {render, renderFB, setRastDebug, setDoAntiAliasing, setClipDebug} from "../renderer/pipeline/PipelineExport.js";
import {LineSegment} from "../renderer/scene/primitives/PrimitiveExport.js";
import {format} from "../renderer/scene/util/UtilExport.js";
import * as ModelShading from "../renderer/scene/util/UtilExport.js";

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

let shoulderLength = new Array(0.4, 0.4);
const elbowLength1   = new Array(0.3, 0.3);
const elbowLength2   = new Array(0.3, 0.3);
const wristLength1   = new Array(0.2, 0.2);
const wristLength2   = new Array(0.2, 0.2);
const fingerLength1  = new Array(0.1, 0.1);
const fingerLength2  = new Array(0.1, 0.1);

const scene = Scene.buildFromName("RobotArms_R10");
let currentArm = 0;

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

    if('h' == c)
        printHelpMessage();
    else if('d' == c)
    {
        scene.debug = !scene.debug;
        setClipDebug(scene.debug);
    }
    else if('D' == c)
        console.log(scene.toString());
    else if('/' == c)
        currentArm = (currentArm + 1) %2
    else if('c' == c)
    {
        const color = ModelShading.randomColor();
        ModelShading.setColor(    arm_p[currentArm].getModel(), color);
        ModelShading.setColor( elbow1_p[currentArm].getModel(), color);
        ModelShading.setColor( elbow2_p[currentArm].getModel(), color);
        ModelShading.setColor( wrist1_p[currentArm].getModel(), color);
        ModelShading.setColor( wrist2_p[currentArm].getModel(), color);
        ModelShading.setColor(finger1_p[currentArm].getModel(), color);
        ModelShading.setColor(finger2_p[currentArm].getModel(), color);
    }
    else if('C' == c)
    {
        ModelShading.setRandomColor(    arm_p[currentArm].getModel());
        ModelShading.setRandomColor( elbow1_p[currentArm].getModel());
        ModelShading.setRandomColor( elbow2_p[currentArm].getModel());
        ModelShading.setRandomColor( wrist1_p[currentArm].getModel());
        ModelShading.setRandomColor( wrist2_p[currentArm].getModel());
        ModelShading.setRandomColor(finger1_p[currentArm].getModel());
        ModelShading.setRandomColor(finger2_p[currentArm].getModel());
    }
    else if('r' == c)
    {
        ModelShading.setRainbowPrimitiveColors(    arm_p[currentArm].getModel());
        ModelShading.setRainbowPrimitiveColors( elbow1_p[currentArm].getModel());
        ModelShading.setRainbowPrimitiveColors( elbow2_p[currentArm].getModel());
        ModelShading.setRainbowPrimitiveColors( wrist1_p[currentArm].getModel());
        ModelShading.setRainbowPrimitiveColors( wrist2_p[currentArm].getModel());
        ModelShading.setRainbowPrimitiveColors(finger1_p[currentArm].getModel());
        ModelShading.setRainbowPrimitiveColors(finger2_p[currentArm].getModel());
    }
    else if('R' == c)
    {
        const c1 = ModelShading.randomColor();
        const c2 = ModelShading.randomColor();
        const c3 = ModelShading.randomColor();
        const c4 = ModelShading.randomColor();
        const c5 = ModelShading.randomColor();
        const c6 = ModelShading.randomColor();
        const c7 = ModelShading.randomColor();
        const c8 = ModelShading.randomColor();
            arm_p[currentArm].getModel().colorList.length = 0;
         elbow1_p[currentArm].getModel().colorList.length = 0;
         elbow2_p[currentArm].getModel().colorList.length = 0;
         wrist1_p[currentArm].getModel().colorList.length = 0;
         wrist2_p[currentArm].getModel().colorList.length = 0;
        finger1_p[currentArm].getModel().colorList.length = 0;
        finger2_p[currentArm].getModel().colorList.length = 0;

            arm_p[currentArm].getModel().addColor(c1, c2);
         elbow1_p[currentArm].getModel().addColor(c2, c3);
         elbow2_p[currentArm].getModel().addColor(c2, c4);
         wrist1_p[currentArm].getModel().addColor(c3, c5);
         wrist2_p[currentArm].getModel().addColor(c4, c6);
        finger1_p[currentArm].getModel().addColor(c5, c7);
        finger2_p[currentArm].getModel().addColor(c6, c8);

            arm_p[currentArm].getModel().getPrimitive(0).setColorIndices(0, 1);
         elbow1_p[currentArm].getModel().getPrimitive(0).setColorIndices(0, 1);
         elbow2_p[currentArm].getModel().getPrimitive(0).setColorIndices(0, 1);
         wrist1_p[currentArm].getModel().getPrimitive(0).setColorIndices(0, 1);
         wrist2_p[currentArm].getModel().getPrimitive(0).setColorIndices(0, 1);
        finger1_p[currentArm].getModel().getPrimitive(0).setColorIndices(0, 1);
        finger2_p[currentArm].getModel().getPrimitive(0).setColorIndices(0, 1);
    }
    else if('x' == c)
        xTranslation[currentArm] += .02;
    else if('X' == c)
        xTranslation[currentArm] -= .02;
    else if('y' == c)
        yTranslation[currentArm] += .02;
    else if('Y' == c)
        yTranslation[currentArm] -= .02;
    else if('s' == c)
        shoulderRotation[currentArm] += 2;
    else if('S' == c)
        shoulderRotation[currentArm] -= 2;
    else if('e' == c)
        elbowRotation1[currentArm] += 2;
    else if('E' == c)
        elbowRotation1[currentArm] -= 2;
    else if('w' == c)
        wristRotation1[currentArm] += 2;
    else if('W' == c)
        wristRotation1[currentArm] -= 2;
    else if('f' == c)
        fingerRotation1[currentArm] += 2;
    else if('F' == c)
        fingerRotation1[currentArm] -= 2;
    else if('q' == c)
        elbowRotation2[currentArm] += 2;
    else if('Q' == c)
        elbowRotation2[currentArm] -= 2;
    else if('z' == c)
        wristRotation1[currentArm] += 2;
    else if('Z' == c)
        wristRotation2[currentArm] -= 2;
    else if('a' == c)
        fingerRotation2[currentArm] += 2;
    else if('A' == c)
        fingerRotation2[currentArm] -= 2;
    else if('s' == c && e.altKey)
        shoulderLength[currentArm] += .02;
    else if('S' == c && e.altKey)
        shoulderLength[currentArm] -= .02;
    else if('e' == c && e.altKey)
        elbowLength1[currentArm] += .02;
    else if('E' == c && e.altKey)
        elbowLength1[currentArm] -= .02;
    else if('w' == c && e.altKey)
        wristLength1[currentArm] += .02;
    else if('W' == c && e.altKey)
        wristLength1[currentArm] -= .02;
    else if('f' == c && e.altKey)
        fingerLength1[currentArm] += .02;
    else if('F' == c && e.altKey)
        fingerLength1[currentArm] -= .02;
    else if('q' == c && e.altKey)
        elbowLength2[currentArm] += .02;
    else if('Q' == c && e.altKey)
        elbowLength2[currentArm] -= .02;
    else if('z' == c && e.altKey)
        wristLength2[currentArm] += .02;
    else if('Z' == c && e.altKey)
        wristLength2[currentArm] -= .02;
    else if('a' == c && e.altKey)
        fingerLength2[currentArm] += .02;
    else if('A' == c && e.altKey)
        fingerLength2[currentArm] -= .02;
    else if('=' == c)
    {
        xTranslation[currentArm] = 0.0;
        if (0 == currentArm)
           yTranslation[0] =  0.5;
        else
           yTranslation[1] = -0.5;

        shoulderRotation[currentArm] = 0.0;
          elbowRotation1[currentArm] =  15.0;
          elbowRotation2[currentArm] = -15.0;
          wristRotation1[currentArm] = 0.0;
          wristRotation2[currentArm] = 0.0;
         fingerRotation1[currentArm] = 0.0;
         fingerRotation2[currentArm] = 0.0;

          shoulderLength[currentArm] = 0.4;
            elbowLength1[currentArm] = 0.3;
            elbowLength2[currentArm] = 0.3;
            wristLength1[currentArm] = 0.2;
            wristLength2[currentArm] = 0.2;
           fingerLength1[currentArm] = 0.1;
           fingerLength2[currentArm] = 0.1;
    }

    setTransformations();
    setUpViewing();
}

function setTransformations()
{
    arm_p[currentArm].matrix2Identity()
                    .mult(Matrix.translate( xTranslation[currentArm], 
                                            yTranslation[currentArm], 
                                            -1))
                    .mult(Matrix.rotateZ(shoulderRotation[currentArm]))
                    .mult(Matrix.scaleXYZ(shoulderLength[currentArm],
                                          shoulderLength[currentArm], 
                                          1));
    
    elbow1_p[currentArm].matrix2Identity()
                        .mult(Matrix.translate(1, 0, 0))
                        .mult(Matrix.rotateZ(elbowRotation1[currentArm]))
                        .mult(Matrix.scaleXYZ(elbowLength1[currentArm]/shoulderLength[currentArm],
                                              elbowLength1[currentArm]/shoulderLength[currentArm],
                                              1));
    
    elbow2_p[currentArm].matrix2Identity()
                        .mult(Matrix.translate(1, 0, 0))
                        .mult(Matrix.rotateZ(elbowRotation2[currentArm]))
                        .mult(Matrix.scaleXYZ(elbowLength2[currentArm]/shoulderLength[currentArm],
                                              elbowLength2[currentArm]/shoulderLength[currentArm],
                                              1));
                              
    wrist1_p[currentArm].matrix2Identity()
                        .mult(Matrix.translate(1, 0, 0))
                        .mult(Matrix.rotateZ(wristRotation1[currentArm]))
                        .mult(Matrix.scaleXYZ(wristLength1[currentArm]/elbowLength1[currentArm],
                                              wristLength1[currentArm]/elbowLength1[currentArm],
                                              1));
                              
    wrist2_p[currentArm].matrix2Identity()
                        .mult(Matrix.translate(1, 0, 0))
                        .mult(Matrix.rotateZ(wristRotation2[currentArm]))
                        .mult(Matrix.scaleXYZ(wristLength2[currentArm]/elbowLength2[currentArm],
                                              wristLength2[currentArm]/shoulderLength[currentArm],
                                              1));

}

function setUpViewing()
{

}

function windowResized()
{

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








