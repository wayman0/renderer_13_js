/*
 * Renderer 9. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

import {Scene, Model, Matrix, Position, Vertex, LineSegment} from "../../renderer/scene/SceneExport.js";
import {Color, FrameBuffer} from "../../renderer/framebuffer/FramebufferExport.js";
import * as ModelShading from "../../renderer/scene/util/UtilExport.js";
import {rastDebug, render1 as render, renderFB1 as renderFB, setClipDebug, setRastDebug} from "../../renderer/pipeline/PipelineExport.js";
import { format } from "../../renderer/scene/util/UtilExport.js";

/**
   Draw an interactive robot arm with one shoulder,
   two elbow, two wrist, and two finger joints.
<p>
   Here is a simplified version of this program's scene graph.
<p>
<pre>{@code
              Scene
                |
                |
            Position
            / | \   \
           /  |  \   \--------------------\
     Matrix   |   \                        \
      TRS    /  Position                 Position
            /     / |  \                  /  |  \
           /     /  |   \                /   |   \
          / Matrix  |    \          Matrix   |    \
         /   TRS   /    Position     TRS    /  Position
         \        /      / |  \            /    / |   \
          \      /      /  |   \          /    /  |    \
           \    /  Matrix  |    \        / Matrix |     \
            \   \   TRS   /   Position  |   TRS   /   Position
             \   \       /      /  |    |        /     /  |
              \   \     /      /   |    |       /     /   |
               \   \   /  Matrix   |    |      /  Matrix  |
                \   \  \   TRS     |    |     /    TRS   /
                 \   \  \          |    |    /          /
                  \   \  \-----\   |    /   /          /
                   \   \--------\  |   /---/          /
                    \------------\ |  /--------------/
                                 Model
                               armSegment
</pre>
*/
let xTranslation = 0.0;
let yTranslation = 0.0;

let shoulderRotation =  0.0;
let   elbowRotation1 =  15.0;
let   elbowRotation2 = -15.0;
let   wristRotation1 =  0.0;
let   wristRotation2 =  0.0;
let  fingerRotation1 =  0.0;
let  fingerRotation2 =  0.0;

let  shoulderLength = 0.4;
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

//Create the scene graph.
const scene = Scene.buildFromName("Robot Arms 1");

// Create a Position object that will hold the robot arm.
const shoulder_p = Position.buildFromName("arm");

// Add the Position object to the scene.
scene.addPosition(shoulder_p);

// Add the armSegment Model to the Scene's Position.
shoulder_p.setModel(armSegment);

// two elbows
const elbow1_p = Position.buildFromModelName(armSegment, "elbow_1");
const elbow2_p = Position.buildFromModelName(armSegment, "elbow_2");
shoulder_p.addNestedPosition(elbow1_p);
shoulder_p.addNestedPosition(elbow2_p);

// two wrists
const wrist1_p = Position.buildFromModelName(armSegment, "wrist_1");
const wrist2_p = Position.buildFromModelName(armSegment, "wrist_2");
elbow1_p.addNestedPosition(wrist1_p);
elbow2_p.addNestedPosition(wrist2_p);

// two fingers
const finger1_p = Position.buildFromModelName(armSegment, "finger_1");
const finger2_p = Position.buildFromModelName(armSegment, "finger_2");
wrist1_p.addNestedPosition(finger1_p);
wrist2_p.addNestedPosition(finger2_p);

setTransformations();

let fb = new FrameBuffer(1024, 1024);

runOnline();
setUpViewing();

function runOnline()
{
   document.addEventListener("keypress", keyPressed);
   document.addEventListener("keydown", overrideDefault);
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
   else if ('d' == c && e.isAltDown())
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
      ModelShading.setColor(shoulder_p.getModel(), color);
   }
   else if ('C' == c)
   {
      // Change the solid random color of each segment of the robot arm.
      ModelShading.setRandomColor(shoulder_p.getModel());
      ModelShading.setRandomColor(elbow1_p.getModel());
      ModelShading.setRandomColor(elbow2_p.getModel());
      ModelShading.setRandomColor(wrist1_p.getModel());
      ModelShading.setRandomColor(wrist2_p.getModel());
      ModelShading.setRandomColor(finger1_p.getModel());
      ModelShading.setRandomColor(finger2_p.getModel());
   }
   else if ('r' == c)
   {
      // Change the random color at each end of each segment of the robot arm.
      ModelShading.setRainbowPrimitiveColors(shoulder_p.getModel());
   }
   else if ('R' == c)
   {
      // Change the random color at each vertex of the robot arm.
      const c1 = ModelShading.randomColor();
      const c2 = ModelShading.randomColor();
      shoulder_p.getModel().colorList.length = 0;
      shoulder_p.getModel().addColor(c1, c2);
      shoulder_p.getModel().getPrimitive(0).setColorIndices(0, 1);
   }
   else if ('=' == c)
   {
      shoulderRotation = 0.0;
        elbowRotation1 =  15.0;
        elbowRotation2 = -15.0;
        wristRotation1 = 0.0;
        wristRotation2 = 0.0;
       fingerRotation1 = 0.0;
       fingerRotation2 = 0.0;
        shoulderLength = 0.4;
          elbowLength1 = 0.3;
          elbowLength2 = 0.3;
          wristLength1 = 0.2;
          wristLength2 = 0.2;
         fingerLength1 = 0.1;
         fingerLength2 = 0.1;
      xTranslation = 0.0;
      yTranslation = 0.0;
   }
   else if ('x' == c)
   {
      xTranslation += 0.02;
   }
   else if ('X' == c)
   {
      xTranslation -= 0.02;
   }
   else if ('y' == c)
   {
      yTranslation += 0.02;
   }
   else if ('Y' == c)
   {
      yTranslation -= 0.02;
   }
   else if ('s' == c)
   {
      shoulderRotation += 2.0;
   }
   else if ('S' == c)
   {
      shoulderRotation -= 2.0;
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
      shoulderLength += 2.0;
   }
   else if ('S' == c && e.ctrlKey)
   {
      shoulderLength -= 2.0;
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

function overrideDefault(e)
{
   const c = e.key;

   if ('s' == c && e.ctrlKey)
   {
      e.preventDefault();
      shoulderLength += 2.0;
   }
   else if ('S' == c && e.ctrlKey)
   {
      e.preventDefault();
      shoulderLength -= 2.0;
   }
   else if ('e' == c && e.ctrlKey)
   {
      e.preventDefault();
      elbowLength1 += 2.0;
   }
   else if ('E' == c && e.ctrlKey)
   {
      e.preventDefault();
      elbowLength1 -= 2.0;
   }
   else if ('w' == c && e.ctrlKey)
   {
      e.preventDefault();
      wristLength1 += 2.0;
   }
   else if ('W' == c && e.ctrlKey)
   {
      e.preventDefault();
      wristLength1 -= 2.0;
   }
   else if ('f' == c && e.ctrlKey)
   {
      e.preventDefault();
      fingerLength1 += 2.0;
   }
   else if ('F' == c && e.ctrlKey)
   {
      e.preventDefault();
      fingerLength1 -= 2.0;
   }
   else if ('q' == c && e.ctrlKey)
   {
      e.preventDefault();
      elbowLength2 += 2.0;
   }
   else if ('Q' == c && e.ctrlKey)
   {
      e.preventDefault();
      elbowLength2 -= 2.0;
   }
   else if ('z' == c && e.ctrlKey)
   {
      e.preventDefault();
      wristLength2 += 2.0;
   }
   else if ('Z' == c && e.ctrlKey)
   {
      e.preventDefault();
      wristLength2 -= 2.0;
   }
   else if ('a' == c && e.ctrlKey)
   {
      e.preventDefault();
      fingerLength2 += 2.0;
   }
   else if ('A' == c && e.ctrlKey)
   {
      e.preventDefault();
      fingerLength2 -= 2.0;
   }
   else if('d' == c && e.altKey)
   {
      e.preventDefault();
      console.log(scene.toString());
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
   // Set the model matrices for the sub models.
   shoulder_p.matrix2Identity()
             .mult(Matrix.translate(xTranslation,
                                    yTranslation,
                                    -1))
             .mult(Matrix.rotateZ(shoulderRotation))
             .mult(Matrix.scaleXYZ(shoulderLength,
                                shoulderLength,
                                1));
   elbow1_p.matrix2Identity()
           .mult(Matrix.translate(1, 0, 0))
           .mult(Matrix.rotateZ(elbowRotation1))
           .mult(Matrix.scaleXYZ(elbowLength1/shoulderLength,
                              elbowLength1/shoulderLength,
                              1));
   elbow2_p.matrix2Identity()
           .mult(Matrix.translate(1, 0, 0))
           .mult(Matrix.rotateZ(elbowRotation2))
           .mult(Matrix.scaleXYZ(elbowLength2/shoulderLength,
                              elbowLength2/shoulderLength,
                              1));
   wrist1_p.matrix2Identity()
           .mult(Matrix.translate(1, 0, 0))
           .mult(Matrix.rotateZ(wristRotation1))
           .mult(Matrix.scaleXYZ(wristLength1/elbowLength1,
                              wristLength1/elbowLength1,
                              1));
   wrist2_p.matrix2Identity()
           .mult(Matrix.translate(1, 0, 0))
           .mult(Matrix.rotateZ(wristRotation2))
           .mult(Matrix.scaleXYZ(wristLength2/elbowLength2,
                              wristLength2/elbowLength2,
                              1));
   finger1_p.matrix2Identity()
            .mult(Matrix.translate(1, 0, 0))
            .mult(Matrix.rotateZ(fingerRotation1))
            .mult(Matrix.scaleXYZ(fingerLength1/wristLength1,
                               fingerLength1/wristLength1,
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
   console.log("Use the s/S keys to rotate the arm at the shoulder.");
   console.log();
   console.log("Use the e/E keys to rotate the arm at elbow 1.");
   console.log("Use the w/W keys to rotate the arm at wrist 1.");
   console.log("Use the f/F keys to rotate the arm at finger 1.");
   console.log();
   console.log("Use the q/Q keys to rotate the arm at elbow 2.");
   console.log("Use the z/Z keys to rotate the arm at wrist 2.");
   console.log("Use the a/A keys to rotate the arm at finger 2.");
   console.log();
   console.log("Use the ^s/^S keys to extend the length of the arm at the shoulder.");
   console.log();
   console.log("Use the ^e/^E keys to extend the length of the arm at elbow 1.");
   console.log("Use the ^w/^W keys to extend the length of the arm at wrist 1.");
   console.log("Use the ^f/^F keys to extend the length of the arm at finger 1.");
   console.log();
   console.log("Use the ^q/^Q keys to extend the length of the arm at elbow 2.");
   console.log("Use the ^z/^Z keys to extend the length of the arm at wrist 2.");
   console.log("Use the ^a/^A keys to extend the length of the arm at finger 2.");
   console.log();
   console.log("Use the x/X keys to translate the arm along the x-axis.");
   console.log("Use the y/Y keys to translate the arm along the y-axis.");
   console.log();
   console.log("Use the '=' key to reset the robot arm.");
   console.log("Use the 'h' key to redisplay this help message.");
}