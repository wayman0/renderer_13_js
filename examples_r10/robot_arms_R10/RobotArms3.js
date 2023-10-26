/*
 * Renderer 9. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

import {Scene, Model, Matrix, Position, Vertex, LineSegment} from "../../renderer/scene/SceneExport.js";
import {Color, FrameBuffer} from "../../renderer/framebuffer/FramebufferExport.js";
import * as ModelShading from "../../renderer/scene/util/UtilExport.js";
import {rastDebug, render, renderFB, setClipDebug, setRastDebug} from "../../renderer/pipeline/PipelineExport.js";
import { format } from "../../renderer/scene/util/UtilExport.js";

/**
   Draw two interactive robot arms each with one shoulder,
   two elbow, two wrist, and two finger joints.
<p>
   Here is a simplified version of this program's scene graph.
<p>
<pre>{@code
                               Scene
                               /   \
                 /------------/     \-----------------------\
                /                                            \
        Position                                              Position
        / | \   \                                             / | \   \
       /  |  \   \--------------------\                      /  |  \   \--------------------\
 Matrix   /   \                        \               Matrix  /    \                        \
  TRS    /  Position                 Position           TRS   /  Position                 Position
        /     / |  \                  /  |  \                /     / |  \                  /  |  \
       /     /  |   \                /   |   \              /     /  |   \                /   |   \
      / Matrix  |    \          Matrix   |    \            / Matrix  |    \          Matrix   |    \
     |   TRS   /    Position     TRS    /  Position       |   TRS   /    Position     TRS    /  Position
     |        /      / |  \            /    / |   \       |        /      / |  \            /    / |   \
     |       /      /  |   \          /    /  |    \      |       /      /  |   \          /    /  |    \
     |      |  Matrix  |    \        / Matrix |     \     |      |  Matrix  |    \        / Matrix |     \
     |      |   TRS   /   Position  |   TRS   /  Position |      |   TRS   /   Position  |   TRS   /  Position
     |      |        /      /  |    |        /     /   |  |      |        /      /  |    |        /     /   |
     |      |       /      /   |    |       /     /    |  |      |       /      /   |    |       /     /    |
     |      |      |  Matrix   |    |      /  Matrix   |  |      |      /  Matrix  /     |      /  Matrix  /
     |      |      |   TRS     |    |     /    TRS    /   |      |     /    TRS   /     /      /    TRS   /
     |      |      |          /     |    /           /    |      |    /          /     /      /          /
     |      |      |         /      |   |           /    /       /   /          /     /      /          /
     |      |      |        /      /    |          /    /       /   |          /     /      /          /
     |      |      |       /      /     |         /    /       /    |         /     /      |          /
 ArmSegment |  ArmSegment |  ArmSegment |  ArmSegment |  ArmSegment |  ArmSegment  |  ArmSegment     /
            |             |             |             |             |              |                /
        ArmSegment     ArmSegment    ArmSegment   ArmSegment    ArmSegment    ArmSegment      ArmSegment
</pre>
*/

const xTranslation = new Array(0.0,  0.0);
const yTranslation = new Array(0.5, -0.5);

const shoulderRotation = new Array(0.0, 0.0);
const   elbowRotation1 = new Array( 15,  15);
const   elbowRotation2 = new Array(-15, -15);
const   wristRotation1 = new Array(0.0, 0.0);
const   wristRotation2 = new Array(0.0, 0.0);
const  fingerRotation1 = new Array(0.0, 0.0);
const  fingerRotation2 = new Array(0.0, 0.0);

const shoulderLength = new Array(0.4, 0.4);
const   elbowLength1 = new Array(0.3, 0.3);
const   elbowLength2 = new Array(0.3, 0.3);
const   wristLength1 = new Array(0.2, 0.2);
const   wristLength2 = new Array(0.2, 0.2);
const  fingerLength1 = new Array(0.1, 0.1);
const  fingerLength2 = new Array(0.1, 0.1);

let currentArm = 0;


/**
   Create a Model that can be used
   for each segment of a robot arm.
*/
const armSegment = Model.buildName("Arm Segment");
armSegment.addVertex(new Vertex(0, 0, 0),
                     new Vertex(1, 0, 0))
armSegment.addPrimitive(LineSegment.buildVertex(0, 1));
ModelShading.setColor(armSegment, Color.blue);

//Create the scene graph.
const scene = Scene.buildFromName("Robot Arms 4");

// Create two Position objects that will each hold a robot arm.
const arm1_s = Position.buildFromName("arm_1");
const arm2_s = Position.buildFromName("arm_2");

// Add the Position objects to the scene.
scene.addPosition(arm1_s, arm2_s);

//Create two robot arms.

// First arm.
arm1_s.setModel(armSegment);

// two elbows
const arm1_e1 = Position.buildFromName("elbow_1");
const arm1_e2 = Position.buildFromName("elbow_2");
arm1_s.addNestedPosition(arm1_e1);
arm1_s.addNestedPosition(arm1_e2);
arm1_e1.setModel(armSegment);
arm1_e2.setModel(armSegment);

// two wrists
const arm1_w1 = Position.buildFromName("wrist_1");
const arm1_w2 = Position.buildFromName("wrist_2");
arm1_e1.addNestedPosition(arm1_w1);
arm1_e2.addNestedPosition(arm1_w2);
arm1_w1.setModel(armSegment);
arm1_w2.setModel(armSegment);

// two fingers
const arm1_f1 = Position.buildFromName("finger_1");
const arm1_f2 = Position.buildFromName("finger_2");
arm1_w1.addNestedPosition(arm1_f1);
arm1_w2.addNestedPosition(arm1_f2);
arm1_f1.setModel(armSegment);
arm1_f2.setModel(armSegment);

// Second arm.
arm2_s.setModel(armSegment);

// two elbows
const arm2_e1 = Position.buildFromName("elbow_1");
const arm2_e2 = Position.buildFromName("elbow_2");
arm2_s.addNestedPosition(arm2_e1);
arm2_s.addNestedPosition(arm2_e2);
arm2_e1.setModel(armSegment);
arm2_e2.setModel(armSegment);

// two wrists
const arm2_w1 = Position.buildFromName("wrist_1");
const arm2_w2 = Position.buildFromName("wrist_2");
arm2_e1.addNestedPosition(arm2_w1);
arm2_e2.addNestedPosition(arm2_w2);
arm2_w1.setModel(armSegment);
arm2_w2.setModel(armSegment);

// two fingers
const arm2_f1 = Position.buildFromName("finger_1");
const arm2_f2 = Position.buildFromName("finger_2");
arm2_w1.addNestedPosition(arm2_f1);
arm2_w2.addNestedPosition(arm2_f2);
arm2_f1.setModel(armSegment);
arm2_f2.setModel(armSegment);

const arm_p     = new Array(arm1_s,  arm2_s);
const elbow1_p  = new Array(arm1_e1, arm2_e1);
const elbow2_p  = new Array(arm1_e2, arm2_e2);
const wrist1_p  = new Array(arm1_w1, arm2_w1);
const wrist2_p  = new Array(arm1_w2, arm2_w2);
const finger1_p = new Array(arm1_f1, arm2_f1);
const finger2_p = new Array(arm1_f2, arm2_f2);

// Initialize the nested matrices for the sub models.
// First arm.
currentArm = 0;
setTransformations();

//second arm
currentArm = 1;
setTransformations();

// reset the current arm to be 0
currentArm = 0;

let fb = new FrameBuffer(1024, 1024);

runOnline();
setUpViewing();

function runOnline()
{
   document.addEventListener("keypress", keyPressed);
   const resizer = new ResizeObserver(windowResized);
   resizer.observe(document.getElementById("resizer"));
   setUpViewing();
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
      setRastDebug(rastDebug);
   }
   else if ('/' == c)
   {
      currentArm = (currentArm + 1) % 2;
   }
   else if ('c' == c)
   {
      // Change the solid random color of the robot arm.
      const color = ModelShading.randomColor();

      ModelShading.setColor(    arm_p[currentArm].getModel(), color);
      ModelShading.setColor( elbow1_p[currentArm].getModel(), color);
      ModelShading.setColor( elbow2_p[currentArm].getModel(), color);
      ModelShading.setColor( wrist1_p[currentArm].getModel(), color);
      ModelShading.setColor( wrist2_p[currentArm].getModel(), color);
      ModelShading.setColor(finger1_p[currentArm].getModel(), color);
      ModelShading.setColor(finger2_p[currentArm].getModel(), color);
   }
   else if ('C' == c)
   {
      // Change the solid random color of each segment of the robot arm.
      ModelShading.setRandomColor(    arm_p[currentArm].getModel());
      ModelShading.setRandomColor( elbow1_p[currentArm].getModel());
      ModelShading.setRandomColor( elbow2_p[currentArm].getModel());
      ModelShading.setRandomColor( wrist1_p[currentArm].getModel());
      ModelShading.setRandomColor( wrist2_p[currentArm].getModel());
      ModelShading.setRandomColor(finger1_p[currentArm].getModel());
      ModelShading.setRandomColor(finger2_p[currentArm].getModel());
   }
   else if ('r' == c)
   {
      // Change the random color at each end of each segment of the robot arm.
      ModelShading.setRainbowPrimitiveColors(arm_p[currentArm].getModel());
      ModelShading.setRainbowPrimitiveColors(elbow1_p[currentArm].getModel());
      ModelShading.setRainbowPrimitiveColors(elbow2_p[currentArm].getModel());
      ModelShading.setRainbowPrimitiveColors(wrist1_p[currentArm].getModel());
      ModelShading.setRainbowPrimitiveColors(wrist2_p[currentArm].getModel());
      ModelShading.setRainbowPrimitiveColors(finger1_p[currentArm].getModel());
      ModelShading.setRainbowPrimitiveColors(finger2_p[currentArm].getModel());
   }
   else if ('R' == c)
   {
      // Change the random color at each vertex of the robot arm.
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
   else if ('=' == c)
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
   else if ('x' == c)
   {
      xTranslation[currentArm] += 0.02;
   }
   else if ('X' == c)
   {
      xTranslation[currentArm] -= 0.02;
   }
   else if ('y' == c)
   {
      yTranslation[currentArm] += 0.02;
   }
   else if ('Y' == c)
   {
      yTranslation[currentArm] -= 0.02;
   }
   else if ('s' == c)
   {
      shoulderRotation[currentArm] += 2.0;
   }
   else if ('S' == c)
   {
      shoulderRotation[currentArm] -= 2.0;
   }
   else if ('e' == c)
   {
      elbowRotation1[currentArm] += 2.0;
   }
   else if ('E' == c)
   {
      elbowRotation1[currentArm] -= 2.0;
   }
   else if ('w' == c)
   {
      wristRotation1[currentArm] += 2.0;
   }
   else if ('W' == c)
   {
      wristRotation1[currentArm] -= 2.0;
   }
   else if ('f' == c)
   {
      fingerRotation1[currentArm] += 2.0;
   }
   else if ('F' == c)
   {
      fingerRotation1[currentArm] -= 2.0;
   }
   else if ('q' == c)
   {
      elbowRotation2[currentArm] += 2.0;
   }
   else if ('Q' == c)
   {
      elbowRotation2[currentArm] -= 2.0;
   }
   else if ('z' == c)
   {
      wristRotation2[currentArm] += 2.0;
   }
   else if ('Z' == c)
   {
      wristRotation2[currentArm] -= 2.0;
   }
   else if ('a' == c)
   {
      fingerRotation2[currentArm] += 2.0;
   }
   else if ('A' == c)
   {
      fingerRotation2[currentArm] -= 2.0;
   }
   else if ('s' == c && e.ctrlKey)
   {
      shoulderRotation[currentArm] += 2.0;
   }
   else if ('S' == c && e.ctrlKey)
   {
      shoulderRotation[currentArm] -= 2.0;
   }
   else if ('e' == c && e.ctrlKey)
   {
      elbowRotation1[currentArm] += 2.0;
   }
   else if ('E' == c && e.ctrlKey)
   {
      elbowRotation1[currentArm] -= 2.0;
   }
   else if ('w' == c && e.ctrlKey)
   {
      wristRotation1[currentArm] += 2.0;
   }
   else if ('W' == c && e.ctrlKey)
   {
      wristRotation1[currentArm] -= 2.0;
   }
   else if ('f' == c && e.ctrlKey)
   {
      fingerRotation1[currentArm] += 2.0;
   }
   else if ('F' == c && e.ctrlKey)
   {
      fingerRotation1[currentArm] -= 2.0;
   }
   else if ('q' == c && e.ctrlKey)
   {
      elbowRotation2[currentArm] += 2.0;
   }
   else if ('Q' == c && e.ctrlKey)
   {
      elbowRotation2[currentArm] -= 2.0;
   }
   else if ('z' == c && e.ctrlKey)
   {
      wristRotation2[currentArm] += 2.0;
   }
   else if ('Z' == c && e.ctrlKey)
   {
      wristRotation2[currentArm] -= 2.0;
   }
   else if ('a' == c && e.ctrlKey)
   {
      fingerRotation2[currentArm] += 2.0;
   }
   else if ('A' == c && e.ctrlKey)
   {
      fingerRotation2[currentArm] -= 2.0;
   }

   setTransformations();
   setUpViewing();
}

function windowResized()
{
   // Get the new size of the canvas
   const resizer = document.getElementById("resizer");
   const w = resizer?.offsetWidth;
   const h = resizer?.offsetHeight;

   // Create a new FrameBuffer that fits the canvas    
   const bg1 = fb.getBackgroundColorFB();
   const bg2 = fb.getViewport().getBackgroundColorVP();

   //@ts-ignore
   fb = new FrameBuffer(w, h, bg1);
   fb.vp.setBackgroundColorVP(bg2);

   setUpViewing();
}

function setUpViewing()
{
   // get the size of the resizer so we know what size to make the fb
   const resizer = document.getElementById("resizer");
   const w = resizer?.offsetWidth;
   const h = resizer?.offsetHeight;

   //@ts-ignore
   fb = new FrameBuffer(w, h, fb.bgColorFB);
   render(scene, fb.vp);

   // @ts-ignore
   const ctx = document.getElementById("pixels").getContext("2d");
   ctx.canvas.width = w;
   ctx.canvas.height = h;
   
   ctx.putImageData(new ImageData(fb.pixelBuffer, fb.width, fb.height), fb.vp.vp_ul_x, fb.vp.vp_ul_y);
}

function setTransformations()
{
   // Update the nested matrices for the sub models.
   arm_p[currentArm].matrix2Identity()
                    .mult(Matrix.translate(xTranslation[currentArm],
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
                                          wristLength2[currentArm]/elbowLength2[currentArm],
                                          1));
   finger1_p[currentArm].matrix2Identity()
                        .mult(Matrix.translate(1, 0, 0))
                        .mult(Matrix.rotateZ(fingerRotation1[currentArm]))
                        .mult(Matrix.scaleXYZ(fingerLength1[currentArm]/wristLength1[currentArm],
                                           fingerLength1[currentArm]/wristLength1[currentArm],
                                           1));
   finger2_p[currentArm].matrix2Identity()
                        .mult(Matrix.translate(1, 0, 0))
                        .mult(Matrix.rotateZ(fingerRotation2[currentArm]))
                        .mult(Matrix.scaleXYZ(fingerLength2[currentArm]/wristLength2[currentArm],
                                           fingerLength2[currentArm]/wristLength2[currentArm],
                                           1));
}

function printHelpMessage()
{
   console.log("Use the 'd' key to toggle debugging information on and off.");
   console.log("Use the 'Alt-d' key combination to print the Scene data structure.");
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
   console.log("Use the ^s/^S keys to extend the length of the current arm at the shoulder.");
   console.log();
   console.log("Use the ^e/^E keys to extend the length of the current arm at elbow 1.");
   console.log("Use the ^w/^W keys to extend the length of the current arm at wrist 1.");
   console.log("Use the ^f/^F keys to extend the length of the current arm at finger 1.");
   console.log();
   console.log("Use the ^q/^Q keys to extend the length of the current arm at elbow 2.");
   console.log("Use the ^z/^Z keys to extend the length of the current arm at wrist 2.");
   console.log("Use the ^a/^A keys to extend the length of the current arm at finger 2.");
   console.log();
   console.log("Use the x/X keys to translate the current arm along the x-axis.");
   console.log("Use the y/Y keys to translate the current arm along the y-axis.");
   console.log();
   console.log("Use the '=' key to reset the current robot arm.");
   console.log("Use the 'h' key to redisplay this help message.");
}