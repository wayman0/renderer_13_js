import {Scene, Camera, Position, Model, Matrix, Vertex, LineSegment, Vector} from "./renderer/scene/SceneExport.js";
import {FrameBuffer, Color} from "./renderer/framebuffer/FramebufferExport.js";
import {render1, setDoNearClipping} from "./renderer/pipeline/PipelineExport.js";
import { format } from "./renderer/scene/util/StringFormat.js";

                // neg model             axis color              pos model
const xColors = [new Color(50, 0, 0), new Color(125, 0, 0), new Color(255, 0, 0)]; // x axis colors
const yColors = [new Color(0, 50, 0), new Color(0, 125, 0), new Color(0, 255, 0)]; // y axis colors
const zColors = [new Color(0, 0, 50), new Color(0, 0, 125), new Color(0, 0, 255)]; // z axis colors

const xVList = [new Vertex(-5, 0, 0), new Vertex(5, 0, 0)];
const yVList = [new Vertex(0, -5, 0), new Vertex(0, 5, 0)];
const zVList = [new Vertex(0, 0, -5), new Vertex(0, 0, 5)];

const vList = [ new Vertex(-0.5, -0.5, -0.5), 
                new Vertex(-0.5,  0.5, -0.5), 
                new Vertex( 0.5,  0.5, -0.5), 
                new Vertex( 0.5, -0.5, -0.5),
                new Vertex(-0.5, -0.5,  0.5), 
                new Vertex(-0.5,  0.5,  0.5), 
                new Vertex( 0.5,  0.5,  0.5), 
                new Vertex( 0.5, -0.5,  0.5)];

const xPList = [LineSegment.buildVertexColor(0, 1, 0)];
const yPList = [LineSegment.buildVertexColor(0, 1, 0)];
const zPList = [LineSegment.buildVertexColor(0, 1, 0)];

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

const mat1 = Matrix.translate(0,   0, -3);
const mat2 = Matrix.translate(-3,  0,  0);
const mat3 = Matrix.translate( 0,  0,  3);
const mat4 = Matrix.translate( 3,  0,  0);
const mat5 = Matrix.translate( 0, -3,  0);
const mat6 = Matrix.translate( 0,  3,  0);

const mod1 = new Model(vList, pList, [zColors[0]], mat1)
const mod2 = new Model(vList, pList, [xColors[0]], mat2);
const mod3 = new Model(vList, pList, [zColors[2]], mat3);
const mod4 = new Model(vList, pList, [xColors[2]], mat4);
const mod5 = new Model(vList, pList, [yColors[0]], mat5);
const mod6 = new Model(vList, pList, [yColors[2]], mat6);

const xAxisMod = new Model(xVList, xPList, [xColors[1]]);
const yAxisMod = new Model(yVList, yPList, [yColors[1]]);
const zAxisMod = new Model(zVList, zPList, [zColors[1]]);

const pos1 = new Position(mod1);
const pos2 = new Position(mod2);
const pos3 = new Position(mod3);
const pos4 = new Position(mod4);
const pos5 = new Position(mod5);
const pos6 = new Position(mod6);

const xAxisPos = new Position(xAxisMod);
const yAxisPos = new Position(yAxisMod);
const zAxisPos = new Position(zAxisMod)

const camera = new Camera(-1, 1, -1, 1);
const scene = new Scene(camera, [pos1, pos2, pos3, pos4, pos5, pos6, xAxisPos, yAxisPos, zAxisPos]);

let xRot = 0, yRot = 0, zRot = 0; // rotations
let    eyeX = 0,    eyeY = 0,    eyeZ = 0; // camera location
let centerX = 0, centerY = 0, centerZ = -3; // where the camera is looking
let     upX = 0,     upY = 1,     upZ = 0; // what up is

const radian90 = 90 * Math.PI / 180;

let run = rotateAroundX;
document.addEventListener("keypress", keyPress);
let timerHandle = setInterval(run, 1000/20);

document.addEventListener("mousedown", rotateAroundZ);
//display();

function resetLookAt()
{
    xRot = 0, yRot = 0, zRot = 0;

    eyeX = 0, eyeY = 0, eyeZ = 0;// eyeZ = 2;
    centerX = 0, centerY = 0, centerZ = -3;
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
    eyeY = Math.sin(xRot);
    eyeZ = Math.cos(xRot);
    */

    // this code rotates where the camera is looking
    // but we need to keep the up vector at a 90 degree angle 'before' the look vector
    xRot += 1 * Math.PI/180;

    centerY = Math.sin(xRot);
    centerZ = Math.cos(xRot);

    upY = Math.sin(radian90 + xRot);
    upZ = Math.cos(radian90 + xRot);

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
    // we don't need to update the up vector because we never change the look y
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
    // but if we rotate around z we don't look anywhere other than z
    //centerX = Math.sin(zRot);
    //centerY = Math.cos(zRot);

    zRot += Math.PI/180; // increment by 1 degree
    // instead we need to change what 'up' is to the camera
    upX = Math.sin(zRot);
    upY = Math.cos(zRot);

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

function lookDownNegY()
{
    centerX = 0;
    centerY = -3;
    centerZ = 0;

    display();
}

function lookDownPosY()
{
    centerX = 0; 
    centerY = 3;
    centerZ = 0;

    display();
}

function keyPress(e)
{
    const c = e.key;

    
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
        //resetLookAt();

        clearInterval(timerHandle);
        timerHandle = setInterval(run, 1000/20);
    }
    

    /*
    if('1' == c)
        lookDownNegZ();
    else if('2' == c)
        lookDownNegX();
    else if('3' == c)
        lookDownPosZ();
    else if('4' == c)
        lookDownPosX();
    else if('5' == c)
        lookDownNegY();
    else if('6' == c)
        lookDownPosY();
    */
}