import {Scene, Camera, Position, Model, Matrix, Vertex, LineSegment, Vector} from "./renderer/scene/SceneExport.js";
import {FrameBuffer, Color} from "./renderer/framebuffer/FramebufferExport.js";
import {render1, setDoNearClipping} from "./renderer/pipeline/PipelineExport.js";
import { format } from "./renderer/scene/util/StringFormat.js";

const vList = [ new Vertex(-0.5, -0.5, -0.5), 
                new Vertex(-0.5,  0.5, -0.5), 
                new Vertex( 0.5,  0.5, -0.5), 
                new Vertex( 0.5, -0.5, -0.5),
                new Vertex(-0.5, -0.5,  0.5), 
                new Vertex(-0.5,  0.5,  0.5), 
                new Vertex( 0.5,  0.5,  0.5), 
                new Vertex( 0.5, -0.5,  0.5)];

const pList = [ LineSegment.buildVertexColor(0, 1, 0), 
                LineSegment.buildVertexColor(1, 2, 0), 
                LineSegment.buildVertexColor(2, 3, 0), 
                LineSegment.buildVertexColor(3, 0, 0),
                LineSegment.buildVertexColor(4, 5, 0),
                LineSegment.buildVertexColor(5, 6, 0),
                LineSegment.buildVertexColor(6, 7, 0),
                LineSegment.buildVertexColor(7, 4, 0),
                LineSegment.buildVertexColor(0, 4, 0),
                LineSegment.buildVertexColor(1, 5, 0),
                LineSegment.buildVertexColor(2, 6, 0),
                LineSegment.buildVertexColor(3, 7, 0)];

const mod1 = new Model(vList, pList, [Color.blue]);
const pos1 = new Position(mod1);

const camera1 = new Camera(-1, 1, -1, 1);
const camera2 = new Camera(-1, 1, -1, 1);
const camera3 = new Camera(-1, 1, -1, 1);
const scene = new Scene();
scene.addPosition(pos1);

let xRot = 0, yRot = 0, zRot = 0; // rotations

const radian90 = 90 * Math.PI / 180;

let timerHandle1 = setInterval(rotateAroundX, 1000/50);
let timerHandle2 = setInterval(rotateAroundY, 1000/50);
let timerHandle3 = setInterval(rotateAroundZ, 1000/50);

function display1()
{
    scene.camera = camera1;

    const resizer = document.getElementById("resizer");
    const w = resizer.offsetWidth;
    const h = resizer.offsetHeight;

    const ctx = document.getElementById("pixels1").getContext("2d");
    ctx.canvas.width = w;
    ctx.canvas.height = h;

    const fb = new FrameBuffer(w, h, Color.black);

    render1(scene, fb.vp);

    ctx.putImageData(new ImageData(fb.pixelBuffer, w, h,), 0, 0);

    //console.log(format( "   eyeX: %3.5f,    eyeY: %3.5f,    eyeZ: %3.5f\n" + 
    //                    "centerX: %3.5f, centerY: %3.5f, centerZ: %3.5f\n" + 
    //                    "    upX: %3.5f,     upY: %3.5f,     upZ: %3.5f", 
    //                    eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ));
}

function display2()
{
    scene.camera = camera2;

    const resizer = document.getElementById("resizer");
    const w = resizer.offsetWidth;
    const h = resizer.offsetHeight;

    const ctx = document.getElementById("pixels2").getContext("2d");
    ctx.canvas.width = w;
    ctx.canvas.height = h;

    const fb = new FrameBuffer(w, h, Color.black);

    render1(scene, fb.vp);

    ctx.putImageData(new ImageData(fb.pixelBuffer, w, h,), 0, 0);

    //console.log(format( "   eyeX: %3.5f,    eyeY: %3.5f,    eyeZ: %3.5f\n" + 
    //                    "centerX: %3.5f, centerY: %3.5f, centerZ: %3.5f\n" + 
    //                    "    upX: %3.5f,     upY: %3.5f,     upZ: %3.5f", 
    //                    eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ));
}

function display3()
{
    scene.camera = camera3;

    const resizer = document.getElementById("resizer");
    const w = resizer.offsetWidth;
    const h = resizer.offsetHeight;

    const ctx = document.getElementById("pixels3").getContext("2d");
    ctx.canvas.width = w;
    ctx.canvas.height = h;

    const fb = new FrameBuffer(w, h, Color.black);

    render1(scene, fb.vp);

    ctx.putImageData(new ImageData(fb.pixelBuffer, w, h,), 0, 0);

    //console.log(format( "   eyeX: %3.5f,    eyeY: %3.5f,    eyeZ: %3.5f\n" + 
    //                    "centerX: %3.5f, centerY: %3.5f, centerZ: %3.5f\n" + 
    //                    "    upX: %3.5f,     upY: %3.5f,     upZ: %3.5f", 
    //                    eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ));
}

function rotateAroundX()
{
    // this code moves the camera in a circle
    xRot += Math.PI/180; // increase by 1 radian

    let eyeX = 0;
    let eyeY = 3 * Math.sin(xRot);
    let eyeZ = 3 * Math.cos(xRot);
    
    let centerX = 0; 
    let centerY = 0;
    let centerZ = 0;

    let upX = 0;
    let upY = Math.sin(radian90 + xRot);
    let upZ = Math.cos(radian90 + xRot);

    camera1.viewLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ);
    display1();
}

function rotateAroundY()
{
    // this code moves the camera in a circle
    yRot += Math.PI/180; // increase by 1 radian

    let eyeX = 3 * Math.sin(yRot);
    let eyeY = 0;
    let eyeZ = 3 * Math.cos(yRot);

    let centerX = 0; 
    let centerY = 0; 
    let centerZ = 0; 

    let upX = 0; 
    let upY = 1; 
    let upZ = 0;

    camera2.viewLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ);
    display2();
}

function rotateAroundZ()
{
    // this code moves the camera in a circle
    zRot += Math.PI/180; // rotate by 1 radian

    let eyeX = 0//3 * Math.cos(zRot);
    let eyeY = 0//3 * Math.sin(zRot);
    let eyeZ = 3; 

    let centerX = 0; 
    let centerY = 0; 
    let centerZ = 0; 

    let upX =  Math.cos(radian90 + zRot);
    let upY =  Math.sin(radian90 + zRot);
    let upZ = 0; 

    camera3.viewLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ);
    display3();
}