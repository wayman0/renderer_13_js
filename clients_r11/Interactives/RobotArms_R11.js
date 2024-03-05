//@ts-check
import {Scene, Position, Model, Vertex, LineSegment, Matrix, Camera} from "../../renderer/scene/SceneExport.js";
import {default as RobotArm2} from "./RobotArm2.js";
import * as ModelShading from "../../renderer/scene/util/ModelShading.js";
import {Color, FrameBuffer} from "../../renderer/framebuffer/FramebufferExport.js";
import {rastDebug, render1, render2, setClipDebug, setRastDebug} from "../../renderer/pipeline/PipelineExport.js";

const xTranslation = [0.0,  0.0];
const yTranslation = [0.5, -0.5];

const shoulderRotation = [0, 0];
const elbowRotation1 = [15, 15];
const wristRotation1 = [0, 0];
const fingerRotation1 = [0, 0];
const elbowRotation2 = [-15, -15];
const wristRotation2 = [0, 0];
const fingerRotation2= [0, 0];

const shoulderLength = [0.4, 0.4];
const elbowLength1 = [0.3, 0.3];
const wristLength1 = [0.2, 0.2];
const fingerLength1 = [0.1, 0.1];
const elbowLength2 = [0.3, 0.3];
const wristLength2 = [0.2, 0.2];
const fingerLength2 = [0.1, 0.1];

let currentArm = 0;
let useRenderer1 = true;

const arm = new Array(2);

const scene = Scene.buildFromCameraName(new Camera(undefined, undefined, undefined, undefined, undefined, false, undefined), "RobotArms_R11");

arm[0] = RobotArm2.buildArm("Arm-0", 0.4, 0.3, 0.2, 0.1, 0.3, 0.2, 0.1);
arm[1] = RobotArm2.buildArm("Arm-1", 0.4, 0.3, 0.2, 0.1, 0.3, 0.2, 0.1);

ModelShading.setColor(arm[0], Color.blue);
ModelShading.setColor(arm[1], Color.red);

scene.addPosition(new Position(arm[0], Matrix.translate(xTranslation[0], 
                                                        yTranslation[0], 
                                                        -1)));
scene.addPosition(new Position(arm[1], Matrix.translate(xTranslation[1], 
                                                        yTranslation[1], 
                                                        -1)));

document.addEventListener("keydown", handleKeyInput);
const resizer = new ResizeObserver(display);
resizer.observe(document.getElementById("resizer"));

printHelpMessage();
display();

function handleKeyInput(e)
{
    const c = e.key;
    const code = e.keyCode;
    const ctrl = e.ctrlKey;
    const alt = e.altKey;
    const shift = e.shiftKey;
    const uCode = 38;
    const dCode = 40;
    const rCode = 39;
    const lCode = 37;

    if(alt)
    {
        e.preventDefault();

        if(shift)
        {
            if(c == 'S')
                shoulderLength[currentArm] -= 0.02;
            else if(c == 'E')
                elbowLength1[currentArm] -= 0.02;
            else if(c == 'W')
                wristLength1[currentArm] -= 0.02;
            else if(c == 'F')
                fingerLength1[currentArm] -= 0.02;
            else if(c == 'Q')
                elbowLength2[currentArm] -= 0.02;
            else if(c == 'Z')
                wristLength2[currentArm] -= 0.02;
            else if(c == 'A')
                fingerLength2[currentArm] -= 0.02;
        }
        else
        {
            if(c == 's')
                shoulderLength[currentArm] += 0.02;
            else if(c == 'e')
                elbowLength1[currentArm] += 0.02;
            else if(c == 'w')
                wristLength1[currentArm] += 0.02;
            else if(c == 'f')
                fingerLength1[currentArm] += 0.02;
            else if(c == 'q')
                elbowLength2[currentArm] += 0.02;
            else if(c == 'z')
                wristLength2[currentArm] += 0.02;
            else if(c == 'a')
                fingerLength2[currentArm] += 0.02; 
        }
    }
    else
    {    
        if('h' == c)
            printHelpMessage();
        else if('d' == c && alt)
        {
            e.preventDefault();
            console.log(scene.toString());
        }
        else if('d' == c)
        {
            scene.debug = !scene.debug;
            setClipDebug(scene.debug);
        }
        else if('D' == c)
            setRastDebug(!rastDebug);
        else if('1' == c)
        {
            useRenderer1 = true;
            console.log("Using pipeline 1");
        }
        else if('2' == c)
        {
            useRenderer1 = false;
            console.log("Using pipeline 2");
        }
        else if('/' == c)
            currentArm = (currentArm + 1) % 2;
        else if('c' == c)
            ModelShading.setRandomColor(arm[currentArm]);
        else if('C' == c)
        {
            ModelShading.setRandomColor(arm[currentArm]);
            ModelShading.setRandomColor(arm[currentArm].elbow1);
            ModelShading.setRandomColor(arm[currentArm].elbow2);
            ModelShading.setRandomColor(arm[currentArm].wrist1);
            ModelShading.setRandomColor(arm[currentArm].wrist2);
            ModelShading.setRandomColor(arm[currentArm].finger1);
            ModelShading.setRandomColor(arm[currentArm].finger2)
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
            arm[currentArm].elbow2.addColor(c3, c4);
            arm[currentArm].wrist1.addColor(c4, c5);
            arm[currentArm].wrist2.addColor(c5, c6);
            arm[currentArm].finger1.addColor(c6, c7);
            arm[currentArm].finger2.addColor(c7, c8);

            arm[currentArm].getPrimitive(0).setColorIndices(0, 1);
            arm[currentArm].elbow1.getPrimitive(0).setColorIndices(0, 1);
            arm[currentArm].elbow2.getPrimitive(0).setColorIndices(0, 1);
            arm[currentArm].wrist1.getPrimitive(0).setColorIndices(0, 1);
            arm[currentArm].wrist2.getPrimitive(0).setColorIndices(0, 1);
            arm[currentArm].finger1.getPrimitive(0).setColorIndices(0, 1);
            arm[currentArm].finger2.getPrimitive(0).setColorIndices(0, 1);
        }
        else if('=' == c)
        {
            xTranslation[currentArm] = 0.0;
            if(0 == currentArm)
                yTranslation[currentArm] = 0.5;
            else 
                yTranslation[currentArm] = -0.5;

            shoulderRotation[currentArm] = 0.0;
            
            elbowRotation1[currentArm] = 15;
            wristRotation1[currentArm] = 0.0;
            fingerRotation1[currentArm] = 0.0;

            elbowRotation2[currentArm] = -15;
            wristRotation2[currentArm] = 0.0;
            fingerRotation2[currentArm] = 0.0;
        

            shoulderLength[currentArm] = .4;

            elbowLength1[currentArm] = .3;
            wristLength1[currentArm] = .2;
            fingerLength1[currentArm] = .1;

            elbowLength2[currentArm] = .3;
            wristLength2[currentArm] = .2;
            fingerLength2[currentArm] = .1;
        }
        else if('x' == c)
            xTranslation[currentArm] += 0.02;
        else if('X' == c)
            xTranslation[currentArm] -= 0.02;
        else if('y' == c)
            yTranslation[currentArm] += 0.02;
        else if('Y' == c)
            yTranslation[currentArm] -= 0.02;
        else if('s' == c)
            shoulderRotation[currentArm] += 0.02;
        else if('S' == c)
            shoulderRotation[currentArm] -= 0.02;
        else if('e' == c)
            elbowRotation1[currentArm] += 2.0;
        else if('E' == c)
            elbowRotation1[currentArm] -= 2.0;
        else if('w' == c)
            wristRotation1[currentArm] += 2.0;
        else if('W' == c)
            wristRotation1[currentArm] -= 2.0;
        else if('f' == c)
            fingerRotation1[currentArm] += 2.0;
        else if('F' == c)
            fingerRotation1[currentArm] -= 2.0;
        else if('q' == c)
            elbowRotation2[currentArm] += 2.0;
        else if('Q' == c)
            elbowRotation2[currentArm] -= 2.0;
        else if('z' == c)
            wristRotation2[currentArm] += 2.0;
        else if('Z' == c)
            wristRotation2[currentArm] -= 2.0;
        else if('a' == c)
            fingerRotation2[currentArm] += 2.0;
        else if('A' == c)
            fingerRotation2[currentArm] -= 2.0;
    }

    arm[currentArm] = arm[currentArm].rebuild(  shoulderRotation[currentArm], 
                                                elbowRotation1[currentArm], 
                                                wristRotation1[currentArm], 
                                                fingerRotation1[currentArm], 
                                                elbowRotation2[currentArm], 
                                                wristRotation2[currentArm], 
                                                fingerRotation2[currentArm],

                                                shoulderLength[currentArm], 
                                                elbowLength1[currentArm], 
                                                wristLength1[currentArm], 
                                                fingerLength1[currentArm], 
                                                elbowLength2[currentArm], 
                                                wristLength2[currentArm], 
                                                fingerLength2[currentArm]);
    
    scene.setPosition(currentArm, new Position(arm[currentArm], 
                                                Matrix.translate(xTranslation[currentArm], 
                                                                 yTranslation[currentArm], 
                                                                 -1)));

    display();
}

function display()
{
    const resizerEl = document.getElementById("resizer");
    const w = resizerEl.offsetWidth;
    const h = resizerEl.offsetHeight;

    const ctx = document.getElementById("pixels").getContext("2d");
    ctx.canvas.width = w;
    ctx.canvas.height = h;

    const fb = new FrameBuffer(w, h);

    if(useRenderer1)
        render1(scene, fb.vp);
    else
        render2(scene, fb.vp);

    ctx.putImageData(new ImageData(fb.pixelBuffer, w, h), 0, 0);
}

function printHelpMessage()
{
    console.log("Use the 'd/D' key to toggle debugging information on and off.");
    console.log("Use the 'Alt-d' key combination to print the Scene data structure.");
    console.log("Use the '1' and '2' keys to switch between the two renderers.");
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
    console.log("Use the alt s/alt S keys to extend the length of the current arm at the shoulder.");
    console.log();
    console.log("Use the alt e/alt E keys to extend the length of the current arm at elbow 1.");
    console.log("Use the alt w/alt W keys to extend the length of the current arm at wrist 1.");
    console.log("Use the alt f/alt F keys to extend the length of the current arm at finger 1.");
    console.log();
    console.log("Use the alt q/alt Q keys to extend the length of the current arm at elbow 2.");
    console.log("Use the alt z/alt Z keys to extend the length of the current arm at wrist 2.");
    console.log("Use the alt a/alt A keys to extend the length of the current arm at finger 2.");
    console.log();
    console.log("Use the x/X keys to translate the current arm along the x-axis.");
    console.log("Use the y/Y keys to translate the current arm along the y-axis.");
    console.log();
    console.log("Use the '=' key to reset the current robot arm.");
    console.log("Use the 'h' key to redisplay this help message.");
}
