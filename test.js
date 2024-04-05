import {Scene, Camera, Position, Model, Matrix, Vertex, LineSegment} from "./renderer/scene/SceneExport.js";
import {FrameBuffer, Color} from "./renderer/framebuffer/FramebufferExport.js";
import {model2viewModel, render1} from "./renderer/pipeline/PipelineExport.js";
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

const mat1 = Matrix.translate(0,  0, -3);
const mat2 = Matrix.translate(-3, 0,  0);
const mat3 = Matrix.translate( 0, 0,  3);
const mat4 = Matrix.translate( 3, 0,  0);

const mod1 = new Model(vList, pList, [Color.red],   mat1)
const mod2 = new Model(vList, pList, [Color.green], mat2);
const mod3 = new Model(vList, pList, [Color.blue],  mat3);
const mod4 = new Model(vList, pList, [Color.white], mat4);

const pos1 = new Position(mod1);
const pos2 = new Position(mod2);
const pos3 = new Position(mod3);
const pos4 = new Position(mod4)

const camera = new Camera(-1, 1, -1, 1);
const scene = new Scene(camera, [pos1, pos2, pos3, pos4]);


let xRot = 0, yRot = 0, zRot = 0;
let eyeX = 0, eyeY = 0, eyeZ = 0; // eyeZ = 2;
let centerX = 0, centerY = 0, centerZ = 0.0;
let upX = 0, upY = 1, upZ = 0.0;

let run = rotateAroundX;
document.addEventListener("keypress", keyPress);
//let timerHandle = setInterval(run, 1000/20);

display();

function resetLookAt()
{
    xRot = 0, yRot = 0, zRot = 0;

    eyeX = 0, eyeY = 0, eyeZ = 0;// eyeZ = 2;
    centerX = 0, centerY = 0, centerZ = 0;
    upX = 0, upY = 1, upZ = 0.0;   
}

function display()
{
    scene.camera.viewLookAt(eyeX, eyeY, eyeZ, 
                            centerX, centerY, centerZ, 
                            upX, upY, upZ);

    const resizer = document.getElementById("resizer");
    const w = resizer.offsetWidth;
    const h = resizer.offsetHeight;

    const ctx = document.getElementById("pixels").getContext("2d");
    ctx.canvas.width = w;
    ctx.canvas.height = h;

    const fb = new FrameBuffer(w, h, Color.black);

    render1(scene, fb.vp);

    ctx.putImageData(new ImageData(fb.pixelBuffer, w, h,), 0, 0);

    console.log(format( "   eyeX: %3.5f,    eyeY: %3.5f,    eyeZ: %3.5f\n" + 
                        "centerX: %3.5f, centerY: %3.5f, centerZ: %3.5f\n" + 
                        "    upX: %3.5f,     upY: %3.5f,     upZ: %3.5f", 
                        eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ));
}

function rotateAroundX()
{
    /*
    // this code moves the camera in a circle
    xRot += Math.PI/180; // increase by 1 radian
    eyeY = Math.cos(xRot);
    eyeZ = Math.sin(xRot);
    */

    // this code rotates where the camera is looking
    xRot += Math.PI/180;
    centerY = Math.cos(xRot);
    centerZ = Math.sin(xRot);

    /*
    // this changes what 'up' is to the camera and doesn't do a rotation
    xRot += Math.PI/180;
    upY = Math.cos(xRot);
    upZ = Math.sin(xRot);
    */

    display();
}

function rotateAroundY()
{
    /*
    // this code moves the camera in a circle
    yRot += Math.PI/180; // increase by 1 radian
    eyeX = Math.sin(yRot);
    eyeZ = Math.cos(yRot);
    */

    // this code rotates where the camera is looking
    yRot += Math.PI/180;
    centerX = Math.sin(yRot);
    centerZ = Math.cos(yRot);

    /*
    // this changes what 'up' is to the camear and doesnt do a rotation
    yRot += Math.PI/180;
    upX = Math.sin(yRot);
    upZ = Math.cos(yRot);
    */

    display();
}

function rotateAroundZ()
{
    /*
    // this code moves the camera in a circle
    zRot += Math.PI/180; // rotate by 1 radian
    eyeX = Math.cos(zRot);
    eyeY = Math.sin(zRot);
    */

    // this code rotates where the camera is looking
    zRot += Math.PI/180;
    centerX = Math.cos(zRot);
    centerY = Math.sin(zRot);

    /*
    // this changes what 'up' is to the camera and doesn't do a rotation
    zRot += Math.PI/180;
    upX = Math.cos(zRot);
    upY = Math.cos(zRot);
    */

    display();
}

function lookDownNegZ()
{
    centerX = 0;
    centerY = 0;
    centerZ = -3;

    display();
}

function lookDownPosZ()
{
    centerX = 0;
    centerY = 0;
    centerZ = 3;

    display();
}

function lookDownNegX()
{
    centerX = -3;
    centerY = 0; 
    centerZ = 0;

    display();
}

function lookDownPosX()
{
    centerX = 3;
    centerY = 0; 
    centerZ = 0;

    display();
}


function keyPress(e)
{
    const c = e.key;

    /*
    if('x' == c)
        run = rotateAroundX;
    else if('y' == c)
        run = rotateAroundY;
    else if('z' == c)
        run = rotateAroundZ;

    if('s' == c)
        clearInterval(timerHandle);
    else
    {
        resetLookAt();

        clearInterval(timerHandle);
        timerHandle = setInterval(run, 1000/20);
    }
    */

    if('1' == c)
        lookDownNegZ();
    else if('2' == c)
        lookDownNegX();
    else if('3' == c)
        lookDownPosZ();
    else if('4' == c)
        lookDownPosX();
}