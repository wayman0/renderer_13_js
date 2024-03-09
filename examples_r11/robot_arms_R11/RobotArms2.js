//@ts-check

import {Scene, Position, Matrix} from "../../renderer/scene/SceneExport.js";
import {FrameBuffer, Color} from "../../renderer/framebuffer/FramebufferExport.js";
import * as ModelShading from "../../renderer/scene/util/ModelShading.js";
import {clipDebug, rastDebug, render1, render2, setClipDebug, setRastDebug} from "../../renderer/pipeline/PipelineExport.js";
import {default as RobotArm} from "./RobotArmModelv2.js";

const xTranslation = [0.0,  0.0];
const yTranslation = [0.5, -0.5];

let useRenderer1 = true;
let currentArm = 0;

/**@type {RobotArm[]} */  const arm = [ new RobotArm("shoulder1", .4, .3, .2, .1, .3, .2, .1), 
                                        new RobotArm("shoulder2", .4, .3, .2, .1, .3, .2, .1)];
/**@type {Scene} */       const scene = new Scene();
/**@type {FrameBuffer} */ let fb = new FrameBuffer(600, 600, Color.black);

arm[0].elbowRotation1 = 15;
arm[0].elbowRotation2 = -15;
arm[1].elbowRotation1 = 15;
arm[1].elbowRotation2 = -15;

arm[0].updateMatrices();
arm[1].updateMatrices();

ModelShading.setColor(arm[0], Color.blue);
ModelShading.setColor(arm[1], Color.red);

scene.addPosition(new Position(arm[0]), 
                  new Position(arm[1]));

scene.getPosition(0).matrix = Matrix.translate(xTranslation[0], yTranslation[0], -1);
scene.getPosition(1).matrix = Matrix.translate(xTranslation[1], yTranslation[1], -1);

const resizerEl = document.getElementById("resizer");
const resizer = new ResizeObserver(display);
resizer.observe(resizerEl);

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keypress", handleKeyPress);

function display()
{
    const w = resizerEl.offsetWidth;
    const h = resizerEl.offsetHeight;

    const ctx = document.getElementById("pixels").getContext("2d");
    
    ctx.canvas.width = w;
    ctx.canvas.height = h;
    fb = new FrameBuffer(w, h, Color.black);

    if(useRenderer1)
        render1(scene, fb.vp);
    else
        render2(scene, fb.vp);

    ctx.putImageData(new ImageData(fb.pixelBuffer, w, h), 0, 0);
}

function handleKeyDown(e)
{
    const alt = e.altKey;
    const shift = e.shiftKey;
    const c = e.key;

    if(alt)
    {
        e.preventDefault();

        if(shift)
        {
            if(c == "S")
                arm[currentArm].shoulderLength -= 0.02;
            else if(c == "E")
                arm[currentArm].elbowLength1 -= 0.02;
            else if(c == "W")
                arm[currentArm].wristLength1 -= 0.02;
            else if(c == "F")
                arm[currentArm].fingerLength1 -= 0.02;
            else if(c == "Q")
                arm[currentArm].elbowLength2 -= 0.02;
            else if(c == "Z")
                arm[currentArm].wristLength2 -= 0.02;
            else if(c == "A")
                arm[currentArm].fingerLength2 -= 0.02;
        }
        else
        {
            if(c == "s")
                arm[currentArm].shoulderLength += 0.02;
            else if(c == "e")
                arm[currentArm].elbowLength1 += 0.02;
            else if(c == "w")
                arm[currentArm].wristLength1 += 0.02;
            else if(c == "f")
                arm[currentArm].fingerLength1 += 0.02;
            else if(c == "q")
                arm[currentArm].elbowLength2 += 0.02;
            else if(c == "z")
                arm[currentArm].wristLength2 += 0.02;
            else if(c == "a")
                arm[currentArm].fingerLength2 += 0.02;
        }
    }

    transform();
    display();
}

function handleKeyPress(e)
{
    const c = e.key;

    if ('h' == c)
        printHelpMessage();
    else if ('d' == c)
        setClipDebug(!clipDebug)
    else if ('D' == c)
        setRastDebug(!rastDebug);
    else if ('1' == c)
    {
        useRenderer1 = true;
        console.log("Using Pipeline 1.");
    }
    else if ('2' == c)
    {
        useRenderer1 = false;
        console.log("Using Pipeline 2.");
    }
    else if ('/' == c)
        currentArm = (currentArm + 1) % 2;
    else if ('c' == c)
        // Change the solid random color of the robot arm.
        ModelShading.setRandomColor(arm[currentArm]);
    else if ('C' == c)
    {
        // Change the solid random color of each segment of the robot arm.
        ModelShading.setRandomColor(arm[currentArm]);
        ModelShading.setRandomColor(arm[currentArm].elbow1);
        ModelShading.setRandomColor(arm[currentArm].elbow2);
        ModelShading.setRandomColor(arm[currentArm].wrist1);
        ModelShading.setRandomColor(arm[currentArm].wrist2);
        ModelShading.setRandomColor(arm[currentArm].finger1);
        ModelShading.setRandomColor(arm[currentArm].finger2);
    }
    else if ('r' == c)
        // Change the random color at each end of each segment of the robot arm.
        ModelShading.setRainbowPrimitiveColors(arm[currentArm]);
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

        arm[currentArm].colorList.length = 0;
        arm[currentArm].elbow1.colorList.length = 0;
        arm[currentArm].elbow2.colorList.length = 0;
        arm[currentArm].wrist1.colorList.length = 0;
        arm[currentArm].wrist2.colorList.length = 0;
        arm[currentArm].finger1.colorList.length = 0;
        arm[currentArm].finger2.colorList.length = 0;
               
        arm[currentArm].addColor(c1, c2);
        arm[currentArm].elbow1.addColor(c2, c3);
        arm[currentArm].elbow2.addColor(c2, c4);
        arm[currentArm].wrist1.addColor(c3, c5);
        arm[currentArm].wrist2.addColor(c4, c6);
        arm[currentArm].finger1.addColor(c5, c7);
        arm[currentArm].finger2.addColor(c6, c8);
               
        arm[currentArm].getPrimitive(0).setColorIndices(0, 1);
        arm[currentArm].elbow1.getPrimitive(0).setColorIndices(0, 1);
        arm[currentArm].elbow2.getPrimitive(0).setColorIndices(0, 1);
        arm[currentArm].wrist1.getPrimitive(0).setColorIndices(0, 1);
        arm[currentArm].wrist2.getPrimitive(0).setColorIndices(0, 1);
        arm[currentArm].finger1.getPrimitive(0).setColorIndices(0, 1);
        arm[currentArm].finger2.getPrimitive(0).setColorIndices(0, 1);
    }
    else if ('=' == c)
    {
        xTranslation[currentArm] = 0.0;
        if (0 == currentArm)
            yTranslation[0] = 0.5;
        else
            yTranslation[1] = -0.5;

        arm[currentArm].shoulderRotation  = 0.0;

        arm[currentArm].elbowRotation1 = 15.0;
        arm[currentArm].wristRotation1 = 0.0;
        arm[currentArm].fingerRotation1 = 0.0;

        arm[currentArm].elbowRotation2 = -15.0;
        arm[currentArm].wristRotation2 = 0.0;
        arm[currentArm].fingerRotation2 = 0.0;

        arm[currentArm].shoulderLength  = 0.4;

        arm[currentArm].elbowLength1 = 0.3;
        arm[currentArm].wristLength1 = 0.2;
        arm[currentArm].fingerLength1 = 0.1;

        arm[currentArm].elbowLength2 = 0.3;
        arm[currentArm].wristLength2 = 0.2;
        arm[currentArm].fingerLength2 = 0.1;
    }
    else if ('x' == c)
        xTranslation[currentArm] += 0.02;
    else if ('X' == c)
        xTranslation[currentArm] -= 0.02;
    else if ('y' == c)
        yTranslation[currentArm] += 0.02;
    else if ('Y' == c)
        yTranslation[currentArm] -= 0.02;
    else if ('s' == c)
        arm[currentArm].shoulderRotation += 2.0;
    else if ('S' == c)
        arm[currentArm].shoulderRotation -= 2.0;
    else if ('e' == c)
        arm[currentArm].elbowRotation1 += 2.0;
    else if ('E' == c)
        arm[currentArm].elbowRotation1 -= 2.0;
    else if ('w' == c)
        arm[currentArm].wristRotation1 += 2.0;
    else if ('W' == c)
        arm[currentArm].wristRotation1 -= 2.0;
    else if ('f' == c)
        arm[currentArm].fingerRotation1 += 2.0;
    else if ('F' == c)
        arm[currentArm].fingerRotation1 -= 2.0;
    else if ('q' == c)
        arm[currentArm].elbowRotation2 += 2.0;
    else if ('Q' == c)
        arm[currentArm].elbowRotation2 -= 2.0;
    else if ('z' == c)
        arm[currentArm].wristRotation2 += 2.0;
    else if ('Z' == c)
        arm[currentArm].wristRotation2 -= 2.0;
    else if ('a' == c)
        arm[currentArm].fingerRotation2 += 2.0;
    else if ('A' == c)
        arm[currentArm].fingerRotation2 -= 2.0;
    
    transform();
    display();
}

function transform()
{
    scene.getPosition(currentArm).matrix = Matrix.translate(xTranslation[currentArm], yTranslation[currentArm], -1);
    arm[currentArm].updateMatrices();
}

function printHelpMessage()
{
    console.log("Use the 'd' key to toggle debugging information on and off.");
    console.log("Use the '1' and '2' keys to switch between the two renderers.");
    console.log("Use the '/' key to toggle between the the two robot arms.");
    console.log();
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
    console.log("Use the alt s/alt S keys to extend the length of the arm at the shoulder.");
    console.log();
    console.log("Use the alt e/alt E keys to extend the length of the arm at elbow 1.");
    console.log("Use the alt w/alt W keys to extend the length of the arm at wrist 1.");
    console.log("Use the alt f/alt F keys to extend the length of the arm at finger 1.");
    console.log();
    console.log("Use the alt q/alt Q keys to extend the length of the arm at elbow 2.");
    console.log("Use the alt z/alt Z keys to extend the length of the arm at wrist 2.");
    console.log("Use the alt a/alt A keys to extend the length of the arm at finger 2.");
    console.log();
    console.log("Use the x/X keys to translate the arm along the x-axis.");
    console.log("Use the y/Y keys to translate the arm along the y-axis.");
    console.log();
    console.log("Use the '=' key to reset the current robot arm.");
    console.log("Use the 'h' key to redisplay this help message.");
}