//@ts-check

import {Scene, Position, Matrix} from "../../renderer/scene/SceneExport.js";
import {FrameBuffer, Color} from "../../renderer/framebuffer/FramebufferExport.js";
import * as ModelShading from "../../renderer/scene/util/ModelShading.js";
import {clipDebug, rastDebug, render1, render2, setClipDebug, setDoAntiAliasing, setRastDebug} from "../../renderer/pipeline/PipelineExport.js";
import {default as RobotArm} from "./RobotArmModelv1.js";

const xTranslation = [0.0,  0.0];
const yTranslation = [0.5, -0.5];

/**@type {RobotArm[]}*/ const arm = new Array(2);
let currentArm = 0;
let useRenderer1 = true;

const scene = new Scene();
let fb = new FrameBuffer(600, 600, Color.gray.darker(.5));

arm[0] = new RobotArm("Shoulder1", 0.4, 0.3, 0.2, 0.1);
arm[1] = new RobotArm("Shoulder2", 0.4, 0.3, 0.2, 0.1);

ModelShading.setColor(arm[0], Color.blue);
ModelShading.setColor(arm[1], Color.red);

scene.addPosition(new Position(arm[0]), 
                  new Position(arm[1]));

scene.getPosition(0).matrix = Matrix.translate(xTranslation[0], yTranslation[0], -1);
scene.getPosition(1).matrix = Matrix.translate(xTranslation[1], yTranslation[1], -1);

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keypress", handleKeyPress);

const resizerEl = document.getElementById("resizer");
const resizer = new ResizeObserver(display);
resizer.observe(resizerEl);

function display()
{
    const w = resizerEl.offsetWidth;
    const h = resizerEl.offsetHeight;

    const ctx = document.getElementById("pixels").getContext("2d");
    ctx.canvas.width = w;
    ctx.canvas.height = h;

    fb = new FrameBuffer(w, h, Color.gray.darker(.5));
    fb.vp.clearVP(Color.black);

    if(useRenderer1)
        render1(scene, fb.vp);
    else 
        render2(scene, fb.vp);

    ctx.putImageData(new ImageData(fb.pixelBuffer, w, h), 0, 0);
}

function handleKeyDown(e)
{
    const ctrl = e.ctrlKey;
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
                arm[currentArm].elbowLength -= 0.02;
            else if(c == "W")
                arm[currentArm].wristLength -= 0.02;
            else if(c == "F")
                arm[currentArm].fingerLength -= 0.02;
        }
        else 
        {
            if(c == 's')
                arm[currentArm].shoulderLength += 0.02;
            else if(c == "e")
                arm[currentArm].elbowLength += 0.02;
            else if(c == "e")
                arm[currentArm].wristLength += 0.02;
            else if(c == "e")
                arm[currentArm].fingerLength += 0.02;
        }
    }

    transform();
    display();
}

function handleKeyPress(e)
{
    const c = e.key;

    if('h' == c)
        printHelpMessage();
    else if('d' == c)
        setClipDebug(!clipDebug);
    else if('D' == c)
        setRastDebug(!rastDebug);
    else if('1' == c)
    {
        useRenderer1 = true;
        console.log("Using Pipeline 1");
    }
    else if('2' == c)
    {
        useRenderer1 = false;
        console.log("Using Pipeline 2");
    }
    else if('/' == c)
        currentArm = (currentArm + 1) %2;
    else if('c' == c)
        ModelShading.setRandomColor(arm[currentArm]);
    else if('C' == c)
    {
        ModelShading.setRandomColor(arm[currentArm]);
        ModelShading.setRandomColor(arm[currentArm].elbow);
        ModelShading.setRandomColor(arm[currentArm].wrist);
        ModelShading.setRandomColor(arm[currentArm].finger);
    }
    else if('r' == c)
        ModelShading.setRainbowPrimitiveColors(arm[currentArm]);
    else if('R' == c)
    {
        const c1 = ModelShading.randomColor();
        const c2 = ModelShading.randomColor();
        const c3 = ModelShading.randomColor();
        const c4 = ModelShading.randomColor();
        const c5 = ModelShading.randomColor();

        arm[currentArm].colorList.length = 0;
        arm[currentArm].elbow.colorList.length = 0;
        arm[currentArm].wrist.colorList.length = 0;
        arm[currentArm].finger.colorList.length = 0;

        arm[currentArm].addColor(c1, c2);
        arm[currentArm].elbow.addColor(c2, c3);
        arm[currentArm].wrist.addColor(c3, c4);
        arm[currentArm].finger.addColor(c4, c5);

        arm[currentArm].getPrimitive(0).setColorIndices(0, 1);
        arm[currentArm].elbow.getPrimitive(0).setColorIndices(0, 1);
        arm[currentArm].wrist.getPrimitive(0).setColorIndices(0, 1);
        arm[currentArm].finger.getPrimitive(0).setColorIndices(0, 1);
    }
    else if('=' == c)
    {
        xTranslation[currentArm] = 0.0;
        if(0 == currentArm)
            yTranslation[0] = 0.5;
        else
            yTranslation[1] = -0.5;

        arm[currentArm].shoulderRotation = 0.0;
        arm[currentArm].elbowRotation = 0.0;
        arm[currentArm].wristRotation = 0.0;
        arm[currentArm].fingerRotation = 0.0;

        arm[currentArm].shoulderLength = 0.0;
        arm[currentArm].elbowLength = 0.0;
        arm[currentArm].wristLength = 0.0;
        arm[currentArm].fingerLength = 0.0;
    }
    else if('x' == c)
        xTranslation[currentArm] += 0.02;
    else if('X' == c)
        xTranslation[currentArm] -= 0.02;
    else if('y' == c)
        yTranslation[currentArm] += 0.02;
    else if('y' == c)
        yTranslation[currentArm] -= 0.02;
    else if ('s' == c)
        arm[currentArm].shoulderRotation += 2.0;
    else if ('S' == c)
       arm[currentArm].shoulderRotation -= 2.0;
    else if ('e' == c)
       arm[currentArm].elbowRotation += 2.0;
    else if ('E' == c)
       arm[currentArm].elbowRotation -= 2.0;
    else if ('w' == c)
       arm[currentArm].wristRotation += 2.0;
    else if ('W' == c)
       arm[currentArm].wristRotation -= 2.0;
    else if ('f' == c)
       arm[currentArm].fingerRotation += 2.0;
    else if ('F' == c)
       arm[currentArm].fingerRotation -= 2.0;

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
    console.log("Use the e/E keys to rotate the arm at the elbow.");
    console.log("Use the w/W keys to rotate the arm at the wrist.");
    console.log("Use the f/F keys to rotate the arm at the finger.");
    console.log();
    console.log("Use the alt s/alt S keys to extend the length of the arm at the shoulder.");
    console.log("Use the alt e/alt E keys to extend the length of the arm at the elbow.");
    console.log("Use the alt w/alt W keys to extend the length of the arm at the wrist.");
    console.log("Use the alt f/alt F keys to extend the length of the arm at the finger.");
    console.log();
    console.log("Use the x/X keys to translate the arm along the x-axis.");
    console.log("Use the y/Y keys to translate the arm along the y-axis.");
    console.log();
    console.log("Use the '=' key to reset the current robot arm.");
    console.log("Use the 'h' key to redisplay this help message.");
}
