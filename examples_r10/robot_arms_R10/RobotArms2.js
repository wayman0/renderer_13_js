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
   Draw two interactive robot arms with
   shoulder, elbow, wrist, and finger joints.
<p>
   Here is a simplified version of this program's scene graph.
<p>
<pre>{@code
                        Scene
                        /   \
                /------/     \------\
               /                     \
        Position                     Position
        / | \                         / |   \
       /  |  \                       /  |    \
 Matrix   |   \                Matrix   |     \
  TRS    /  Position            TRS    /   Position
        /     / |  \                  /     / |  \
       /     /  |   \                /     /  |   \
      / Matrix  |    \              / Matrix  |    \
     /   TRS   /    Position       |   TRS   /    Position
     \        /      / |  \        |        /      / |  \
      \      /      /  |   \       |       /      /  |   \
       \    /  Matrix  |    \      |      /  Matrix  |    \
        \   \   TRS   /   Position |      |   TRS   /   Position
         \   \       /      /  |   |      |        /      /   /
          \   \     /      /   |   |      |       /      /   /
           \   \   /  Matrix   |   |     /       /  Matrix  /
            \   \  \   TRS     |   |    /       /    TRS   /
             \   \  \          |   |   /       /          /
              \   \  \------\  |   |  /       /          /
               \   \---------\ |   | /-------/          /
                \-------------\|   |/------------------/
                               Model
                             armSegment
</pre>
*/

let xTranslation1 = 0.0;
let yTranslation1 = 0.5;
let xTranslation2 =  0.0;
let yTranslation2 = -0.5;

let shoulderRotation1 = 0.0;
let shoulderRotation2 = 0.0;
let    elbowRotation1 = 0.0;
let    elbowRotation2 = 0.0;
let    wristRotation1 = 0.0;
let    wristRotation2 = 0.0;
let   fingerRotation1 = 0.0;
let   fingerRotation2 = 0.0;
 
let shoulderLength1 = 0.4;
let shoulderLength2 = 0.4;
let    elbowLength1 = 0.3;
let    elbowLength2 = 0.3;
let    wristLength1 = 0.2;
let    wristLength2 = 0.2;
let   fingerLength1 = 0.1;
let   fingerLength2 = 0.1;

// Create one Model that can be used
// for each segment of the robot arms.
const v0 = new Vertex(0, 0, 0);
const v1 = new Vertex(1, 0, 0);
const armSegment = Model.buildName("arm_segment");
armSegment.addVertex(v0, v1);
armSegment.addPrimitive(LineSegment.buildVertex(0, 1));
ModelShading.setColor(armSegment, Color.blue);

//   Create the scene graph.
const scene = Scene.buildFromName("Robot Arms 2");

// Create Position objects that will hold the two robot arms.
const shoulder1_p = Position.buildFromName("arm_1");
const shoulder2_p = Position.buildFromName("arm_2");

// Add the Position objects to the scene.
scene.addPosition(shoulder1_p, shoulder2_p);

// Push the positions away from where the camera is.
shoulder1_p.setMatrix(Matrix.translate(xTranslation1, yTranslation1, -1));
shoulder2_p.setMatrix(Matrix.translate(xTranslation2, yTranslation2, -1));

//   Create two robot arms.
// First arm.
shoulder1_p.setModel(armSegment);

const elbow1_p = Position.buildFromModelName(armSegment, "elbow");
shoulder1_p.addNestedPosition(elbow1_p);

const wrist1_p = Position.buildFromModelName(armSegment, "wrist");
elbow1_p.addNestedPosition(wrist1_p);

const finger1_p = Position.buildFromModelName(armSegment, "finger");
wrist1_p.addNestedPosition(finger1_p);

// Second arm.
shoulder2_p.setModel(armSegment);

const elbow2_p = Position.buildFromModelName(armSegment, "elbow");
shoulder2_p.addNestedPosition(elbow2_p);

const wrist2_p = Position.buildFromModelName(armSegment, "wrist");
elbow2_p.addNestedPosition(wrist2_p);

const finger2_p = Position.buildFromModelName(armSegment, "finger");
wrist2_p.addNestedPosition(finger2_p);

// Initialize the nested matrices for the sub models.
setTransformations();

let fb = new FrameBuffer(1024, 1024);

try
{
   document;
   runOnline();
   setUpViewing();
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
         console.log( scene );
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
   else if ('c' == c)
      {
         // Change the solid random color of the robot arm.
         const color = ModelShading.randomColor();

         ModelShading.setColor(shoulder1_p.getModel(), color);
         ModelShading.setColor(elbow1_p.getModel(), color);
         ModelShading.setColor(wrist1_p.getModel(), color);
         ModelShading.setColor(finger1_p.getModel(), color);
   }
   else if ('C' == c)
      {
         // Change the solid random color of each segment of the robot arm.
         ModelShading.setRandomColor(shoulder1_p.getModel());
         ModelShading.setRandomColor(elbow1_p.getModel());
         ModelShading.setRandomColor(wrist1_p.getModel());
         ModelShading.setRandomColor(finger1_p.getModel());
   }
   else if ('r' == c)
      {
         // Change the random color at each end of each segment of the robot arm.
         ModelShading.setRainbowPrimitiveColors(shoulder1_p.getModel());
         ModelShading.setRainbowPrimitiveColors(elbow1_p.getModel());
         ModelShading.setRainbowPrimitiveColors(wrist1_p.getModel());
         ModelShading.setRainbowPrimitiveColors(finger1_p.getModel());
   }
   else if ('R' == c)
      {
         // Change the random color at each vertex of the robot arm.
         const c1 = ModelShading.randomColor();
         const c2 = ModelShading.randomColor();
         const c3 = ModelShading.randomColor();
         const c4 = ModelShading.randomColor();
         const c5 = ModelShading.randomColor();

         shoulder1_p.getModel().colorList.length = 0;
            elbow1_p.getModel().colorList.length = 0;
            wrist1_p.getModel().colorList.length = 0;
           finger1_p.getModel().colorList.length = 0;
         
         shoulder1_p.getModel().addColor(c1, c2);
            elbow1_p.getModel().addColor(c2, c3);
            wrist1_p.getModel().addColor(c3, c4);
           finger1_p.getModel().addColor(c4, c5);
         
         shoulder1_p.getModel().getPrimitive(0).setColorIndices(0, 1);
            elbow1_p.getModel().getPrimitive(0).setColorIndices(0, 1);
            wrist1_p.getModel().getPrimitive(0).setColorIndices(0, 1);
           finger1_p.getModel().getPrimitive(0).setColorIndices(0, 1);
   }
   else if ('=' == c)
      {
         xTranslation1 =  0.0;
         yTranslation1 =  0.5;
         xTranslation2 =  0.0;
         yTranslation2 = -0.5;

        shoulderRotation1 = 0.0;
        shoulderRotation2 = 0.0;
           elbowRotation1 = 0.0;
           elbowRotation2 = 0.0;
           wristRotation1 = 0.0;
           wristRotation2 = 0.0;
          fingerRotation1 = 0.0;
          fingerRotation2 = 0.0;

          shoulderLength1 = 0.4;
          shoulderLength2 = 0.4;
             elbowLength1 = 0.3;
             elbowLength2 = 0.3;
             wristLength1 = 0.2;
             wristLength2 = 0.2;
            fingerLength1 = 0.1;
            fingerLength2 = 0.1;
   }
   else if ('x' == c)
      {
         xTranslation1 += 0.02;
   }
   else if ('X' == c)
      {
         xTranslation1 -= 0.02;
   }
   else if ('y' == c)
      {
         yTranslation1 += 0.02;
   }
   else if ('Y' == c)
      {
         yTranslation1 -= 0.02;
   }
   else if ('u' == c)
      {
         xTranslation2 += 0.02;
   }
   else if ('U' == c)
      {
         xTranslation2 -= 0.02;
   }
   else if ('v' == c)
      {
         yTranslation2 += 0.02;
   }
   else if ('V' == c)
      {
         yTranslation2 -= 0.02;
   }
   else if ('s' == c)
   {
      shoulderRotation1 += 2.0;
   }
   else if ('S' == c)
   {
      shoulderRotation1 -= 2.0;
   }
   else if ('e' == c)
   {
      elbowRotation1 += 2.0;
   }
   else if ('E' == c)
   {
      elbowRotation1 -= 2.0;
   }
   else if ('w' == c)
   {
      wristRotation1 += 2.0;
   }
   else if ('W' == c)
   {
      wristRotation1 -= 2.0;
   }
   else if ('f' == c)
   {
      fingerRotation1 += 2.0;
   }
   else if ('F' == c)
   {
      fingerRotation1 -= 2.0;
   }
   else if ('b' == c)
   {
      shoulderRotation2 += 2.0;
   }
   else if ('B' == c)
   {
      shoulderRotation2 -= 2.0;
   }
   else if ('q' == c)
   {
      elbowRotation2 += 2.0;
   }
   else if ('Q' == c)
   {
      elbowRotation2 -= 2.0;
   }
   else if ('z' == c)
   {
      wristRotation2 += 2.0;
   }
   else if ('Z' == c)
   {
      wristRotation2 -= 2.0;
   }
   else if ('a' == c)
   {
      fingerRotation2 += 2.0;
   }
   else if ('A' == c)
   {
      fingerRotation2 -= 2.0;
   }
   else if ('s' == c && e.ctrlKey)
   {
      shoulderLength1 += 2.0;
   }
   else if ('S' == c && e.ctrlKey)
   {
      shoulderLength1 -= 2.0;
   }
   else if ('e' == c && e.ctrlKey)
   {
      elbowLength1 += 2.0;
   }
   else if ('E' == c && e.ctrlKey)
   {
      elbowLength1 -= 2.0;
   }
   else if ('w' == c && e.ctrlKey)
   {
      wristLength1 += 2.0;
   }
   else if ('W' == c && e.ctrlKey)
   {
      wristLength1 -= 2.0;
   }
   else if ('f' == c && e.ctrlKey)
   {
      fingerLength1 += 2.0;
   }
   else if ('F' == c && e.ctrlKey)
   {
      fingerLength1 -= 2.0;
   }
   else if ('b' == c && e.ctrlKey)
   {
      shoulderLength2 += 2.0;
   }
   else if ('B' == c && e.ctrlKey)
   {
      shoulderLength2 -= 2.0;
   }
   else if ('q' == c && e.ctrlKey)
   {
      elbowLength2 += 2.0;
   }
   else if ('Q' == c && e.ctrlKey)
   {
      elbowLength2 -= 2.0;
   }
   else if ('z' == c && e.ctrlKey)
   {
      wristLength2 += 2.0;
   }
   else if ('Z' == c && e.ctrlKey)
   {
      wristLength2 -= 2.0;
   }
   else if ('a' == c && e.ctrlKey)
   {
      fingerLength2 += 2.0;
   }
   else if ('A' == c && e.ctrlKey)
   {
      fingerLength2 -= 2.0;
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
   // First arm.
   shoulder1_p.matrix2Identity()
              .mult(Matrix.translate(xTranslation1,
                                     yTranslation1,
                                     -1))
              .mult(Matrix.rotateZ(shoulderRotation1))
              .mult(Matrix.scaleXYZ(shoulderLength1,
                                 shoulderLength1,
                                 1));

   elbow1_p.matrix2Identity()
           .mult(Matrix.translate(1, 0, 0))
           .mult(Matrix.rotateZ(elbowRotation1))
           .mult(Matrix.scaleXYZ(elbowLength1/shoulderLength1,
                              elbowLength1/shoulderLength1,
                              1));

   wrist1_p.matrix2Identity()
           .mult(Matrix.translate(1, 0, 0))
           .mult(Matrix.rotateZ(wristRotation1))
           .mult(Matrix.scaleXYZ(wristLength1/elbowLength1,
                              wristLength1/elbowLength1,
                              1));

   finger1_p.matrix2Identity()
            .mult(Matrix.translate(1, 0, 0))
            .mult(Matrix.rotateZ(fingerRotation1))
            .mult(Matrix.scaleXYZ(fingerLength1/wristLength1,
                               fingerLength1/wristLength1,
                               1));

   // Second arm.
   shoulder2_p.matrix2Identity()
              .mult(Matrix.translate(xTranslation2,
                                     yTranslation2,
                                     -1))
              .mult(Matrix.rotateZ(shoulderRotation2))
              .mult(Matrix.scaleXYZ(shoulderLength2,
                                 shoulderLength2,
                                  1));

   elbow2_p.matrix2Identity()
           .mult(Matrix.translate(1, 0, 0))
           .mult(Matrix.rotateZ(elbowRotation2))
           .mult(Matrix.scaleXYZ(elbowLength2/shoulderLength2,
                              elbowLength2/shoulderLength2,
                              1));

   wrist2_p.matrix2Identity()
           .mult(Matrix.translate(1, 0, 0))
           .mult(Matrix.rotateZ(wristRotation2))
           .mult(Matrix.scaleXYZ(wristLength2/elbowLength2,
                              wristLength2/elbowLength2,
                              1));

   finger2_p.matrix2Identity()
            .mult(Matrix.translate(1, 0, 0))
            .mult(Matrix.rotateZ(fingerRotation2))
            .mult(Matrix.scaleXYZ(fingerLength2/wristLength2,
                               fingerLength2/wristLength2,
                               1));
}

function printHelpMessage()
{
   console.log("Use the 'd' key to toggle debugging information on and off.");
   console.log("Use the 'Alt-d' key combination to print the Scene data structure.");
   console.log("Use the 'c' key to change the random solid arm color.");
   console.log("Use the 'C' key to randomly change arm segment colors.");
   console.log("Use the 'r' key to randomly change arm segment end colors.");
   console.log("Use the 'R' key to randomly change arm hinge colors.");
   console.log();
   console.log("Use the s/S keys to rotate arm 1 at its shoulder.");
   console.log("Use the e/E keys to rotate arm 1 at its elbow.");
   console.log("Use the w/W keys to rotate arm 1 at its wrist.");
   console.log("Use the f/F keys to rotate arm 1 at its finger.");
   console.log();
   console.log("Use the b/B keys to rotate arm 2 at its shoulder.");
   console.log("Use the q/Q keys to rotate arm 2 at its elbow.");
   console.log("Use the z/Z keys to rotate arm 2 at its wrist.");
   console.log("Use the a/A keys to rotate arm 2 at its finger.");
   console.log();
   console.log("Use the ^s/^S keys to extend the length of arm 1 at its shoulder.");
   console.log("Use the ^e/^E keys to extend the length of arm 1 at its elbow.");
   console.log("Use the ^w/^W keys to extend the length of arm 1 at its wrist.");
   console.log("Use the ^f/^F keys to extend the length of arm 1 at its finger.");
   console.log();
   console.log("Use the ^b/^B keys to extend the length of arm 2 at its shoulder.");
   console.log("Use the ^q/^Q keys to extend the length of arm 2 at its elbow.");
   console.log("Use the ^z/^Z keys to extend the length of arm 2 at its wrist.");
   console.log("Use the ^a/^A keys to extend the length of arm 2 at its finger.");
   console.log();
   console.log("Use the x/X keys to translate arm 1 along the x-axis.");
   console.log("Use the y/Y keys to translate arm 1 along the y-axis.");
   console.log("Use the u/U keys to translate arm 2 along the x-axis.");
   console.log("Use the v/V keys to translate arm 2 along the y-axis.");
   console.log();
   console.log("Use the '=' key to reset the robot arms.");
   console.log("Use the 'h' key to redisplay this help message.");
}

function runOffline()
{
   fb = new FrameBuffer(1024, 1024);

   // rotate the shoulder
   for(let rot = -45; rot <= 45; rot += 5)
   {
      shoulder1_p.matrix2Identity()
                  .mult(Matrix.translate(xTranslation1, yTranslation1, -1))
                  .mult(Matrix.rotateZ(rot))
                  .mult(Matrix.scaleXYZ(shoulderLength1,
                                     shoulderLength1,
                                     1));
      
      shoulder2_p.matrix2Identity()
                  .mult(Matrix.translate(xTranslation2, yTranslation2, -1))
                  .mult(Matrix.rotateZ(rot))
                  .mult(Matrix.scaleXYZ(shoulderLength2,
                                     shoulderLength2,
                                      1));

      renderFB(scene, fb);
      fb.dumpFB2File(format("RobotArms_RotateShoulder-%02d.ppm", rot));
      fb.clearFB();
   }

   // rotate the elbow
   for(let rot = -45; rot <= 45; rot += 5)
   {
      elbow1_p.matrix2Identity()
               .mult(Matrix.translate(1, 0, 0))
               .mult(Matrix.rotateZ(rot))
               .mult(Matrix.scaleXYZ(elbowLength1/shoulderLength1,
                                     elbowLength1/shoulderLength1,
                                     1));
      debugger;
      elbow2_p.matrix2Identity()
               .mult(Matrix.translate(1, 0, 0))
               .mult(Matrix.rotateZ(rot))
               .mult(Matrix.scaleXYZ(elbowLength2/shoulderLength2,
                                     elbowLength2/shoulderLength2,
                                     1));
      renderFB(scene, fb);
      fb.dumpFB2File(format("RobotArms_RotateElbow-%02d.ppm", rot));
      fb.clearFB();
   }
   
   // rotate the wrist
   for(let rot = -45; rot <= 45; rot += 5)
   {
      wrist1_p.matrix2Identity()
               .mult(Matrix.translate(1, 0, 0))
               .mult(Matrix.rotateZ(rot))
               .mult(Matrix.scaleXYZ(wristLength1/elbowLength1,
                                     wristLength1/elbowLength1,
                                     1));
      
      wrist2_p.matrix2Identity()
               .mult(Matrix.translate(1, 0, 0))
               .mult(Matrix.rotateZ(rot))
               .mult(Matrix.scaleXYZ(wristLength2/elbowLength2,
                                     wristLength2/elbowLength2,
                                     1));
      renderFB(scene, fb);
      fb.dumpFB2File(format("RobotArms_RotateWrist-%02d.ppm", rot));
      fb.clearFB();
   }

   // rotate the finger
   for(let rot = -45; rot <= 45; rot += 5)
   {
      finger1_p.matrix2Identity()
               .mult(Matrix.translate(1, 0, 0))
               .mult(Matrix.rotateZ(rot))
               .mult(Matrix.scaleXYZ(fingerLength1/wristLength1,
                                     fingerLength1/wristLength1,
                                     1));

      finger2_p.matrix2Identity()
               .mult(Matrix.translate(1, 0, 0))
               .mult(Matrix.rotateZ(rot))
               .mult(Matrix.scaleXYZ(fingerLength2/wristLength2,
                                     fingerLength2/wristLength2,
                                     1));

      renderFB(scene, fb);
      fb.dumpFB2File(format("RobotArms_RotateFinger-%02d.ppm", rot));
      fb.clearFB();
   }
}