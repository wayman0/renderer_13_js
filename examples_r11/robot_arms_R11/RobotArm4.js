//@ts-check

import {Scene, Position, Matrix, Model, Vertex, LineSegment} from "../../renderer/scene/SceneExport.js";
import {FrameBuffer, Color} from "../../renderer/framebuffer/FramebufferExport.js";
import {clipDebug, rastDebug, render1, render2, setClipDebug, setRastDebug} from "../../renderer/pipeline/PipelineExport.js";
import * as ModelShading from "../../renderer/scene/util/ModelShading.js";

let xTranslation = 0.0;
let yTranslation = 0.0;

let shoulderRotation = 0.0;
let elbowRotation = 0.0;
let wristRotation = 0.0;
let fingerRotation = 0.0;

let shoulderLength = 0.4;
let elbowLength = 0.3;
let wristLength = 0.2;
let fingerLength = 0.1;

let useRenderer1 = true;

const resizerEl = document.getElementById("resizer");
const resizer = new ResizeObserver(display);
resizer.observe(resizerEl);

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keypress", handleKeyPress);

let fb = new FrameBuffer(600, 600, Color.black);
const scene = new Scene();
const shoulder = Model.buildName("Shoulder");
const elbow = Model.buildName("Elbow");
const wrist = Model.buildName("Wrist");
const finger = Model.buildName("Finger");

const armP = new Position();
armP.matrix = Matrix.translate(0, 0, -1);

scene.addPosition(armP);

const v0 = new Vertex(0, 0, 0);
const v1 = new Vertex(1, 0, 0);

shoulder.addVertex(v0, v1);
elbow.addVertex(v0, v1);
wrist.addVertex(v0, v1);
finger.addVertex(v0, v1);

shoulder.addPrimitive(LineSegment.buildVertex(0, 1));
elbow.addPrimitive(LineSegment.buildVertex(0, 1));
wrist.addPrimitive(LineSegment.buildVertex(0, 1));
finger.addPrimitive(LineSegment.buildVertex(0, 1));

ModelShading.setColor(shoulder, Color.blue);
ModelShading.setColor(elbow, Color.red);
ModelShading.setColor(wrist,  Color.green.darker());
ModelShading.setColor(finger, Color.magenta.darker());

armP.model = shoulder;
shoulder.addNestedModel(elbow);
elbow.addNestedModel(wrist);
wrist.addNestedModel(finger);

transform();

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
                shoulderLength -= 0.02;
            else if(c == "E")
                elbowLength -= 0.02;
            else if(c == "W")
                wristLength -= 0.02;
            else if(c == "F")
                fingerLength -= 0.02;
        }
        else
        {
            if(c == "s")
                shoulderLength += 0.02;
            else if(c == "e")
                elbowLength += 0.02;
            else if(c == "w")
                wristLength += 0.02;
            else if(c == "f")
                fingerLength += 0.02;
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
        setRastDebug(rastDebug);
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
    else if('c' == c)
        ModelShading.setRandomColor(shoulder);
    else if('C' == c)
    {
        ModelShading.setRandomColor(shoulder);
        ModelShading.setRandomColor(elbow);
        ModelShading.setRandomColor(wrist);
        ModelShading.setRandomColor(finger);
    }
    else if('r' == c)
        ModelShading.setRainbowPrimitiveColors(shoulder);
    else if('R' == c)
    {
        const c1 = ModelShading.randomColor();
        const c2 = ModelShading.randomColor();
        const c3 = ModelShading.randomColor();
        const c4 = ModelShading.randomColor(); 
        const c5 = ModelShading.randomColor();

        shoulder.colorList.length = 0;
        elbow.colorList.length = 0;
        wrist.colorList.length = 0;
        finger.colorList.length = 0;

        shoulder.addColor(c1, c2);
        elbow.addColor(c2, c3);
        wrist.addColor(c3, c4);
        finger.addColor(c4, c5);

        shoulder.getPrimitive(0).setColorIndices(0, 1);        
        elbow.getPrimitive(0).setColorIndices(0, 1);
        wrist.getPrimitive(0).setColorIndices(0, 1);
        finger.getPrimitive(0).setColorIndices(0, 1);        
    }
    else if('=' == c)
    {
        xTranslation = 0;
        yTranslation = 0;

        shoulderRotation = 0;
        elbowRotation = 0;
        wristRotation = 0;
        fingerRotation = 0;

        shoulderLength = .4;
        elbowLength = .3;
        wristLength = .2;
        fingerLength = .1;
    }
    else if('x' == c)
        xTranslation += 0.02;
    else if('X' == c)
        xTranslation -= 0.02;
    else if('y' == c)
        yTranslation += 0.02;
    else if('Y' == c)
        yTranslation -= 0.02;
    else if('s' == c)
        shoulderRotation += 2.0;
    else if('S' == c)
        shoulderRotation -= 2.0;
    else if('e' == c)
        elbowRotation += 2.0;
    else if('E' == c)
        elbowRotation -= 2.0;
    else if('w' == c)
        wristRotation += 2.0;
    else if('W' == c)
        wristRotation -= 2.0;
    else if('f' == c)
        fingerRotation += 2.0;
    else if('F' == c)
        fingerRotation -= 2.0;

    transform();
    display();
}

function transform()
{
    shoulder.matrix = Matrix.translate(xTranslation, yTranslation, 0)
                             .timesMatrix(Matrix.rotateZ(shoulderRotation))
                             .timesMatrix(Matrix.scaleXYZ(shoulderLength,
                                                 shoulderLength, 1));

    elbow.matrix = Matrix.translate(1, 0, 0)
                          .timesMatrix(Matrix.rotateZ(elbowRotation))
                          .timesMatrix(Matrix.scaleXYZ(elbowLength/shoulderLength,
                                              elbowLength/shoulderLength,
                                              1));

    wrist.matrix = Matrix.translate(1, 0, 0)
                          .timesMatrix(Matrix.rotateZ(wristRotation))
                          .timesMatrix(Matrix.scaleXYZ(wristLength/elbowLength,
                                              wristLength/elbowLength,
                                              1));

    finger.matrix = Matrix.translate(1, 0, 0)
                           .timesMatrix(Matrix.rotateZ(fingerRotation))
                           .timesMatrix(Matrix.scaleXYZ(fingerLength/wristLength,
                                               fingerLength/wristLength,
                                               1));
}

function printHelpMessage()
{
    console.log("Use the 'd' key to toggle debugging information on and off.");
    console.log("Use the '1' and '2' keys to switch between the two renderers.");
    console.log("Use the 'c' key to change the random solid arm color.");
    console.log("Use the 'C' key to randomly change arm segment colors.");
    console.log("Use the 'r' key to randomly change arm segment end colors.");
    console.log("Use the 'R' key to randomly change arm hinge colors.");
    console.log("Use the s/S keys to rotate the arm at the shoulder.");
    console.log("Use the e/E keys to rotate the arm at the elbow.");
    console.log("Use the w/W keys to rotate the arm at the wrist.");
    console.log("Use the f/F keys to rotate the arm at the finger.");
    console.log("Use the alt s/alt S keys to extend the length of the arm at the shoulder.");
    console.log("Use the alt e/alt E keys to extend the length of the arm at the elbow.");
    console.log("Use the alt w/alt W keys to extend the length of the arm at the wrist.");
    console.log("Use the alt f/alt F keys to extend the length of the arm at the finger.");
    console.log("Use the x/X keys to translate the arm along the x-axis.");
    console.log("Use the y/Y keys to translate the arm along the y-axis.");
    console.log("Use the '=' key to reset the robot arm.");
    console.log("Use the 'h' key to redisplay this help message.");
}





