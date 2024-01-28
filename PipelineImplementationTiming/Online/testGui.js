import {Scene, Position, Matrix, Model, Vertex, LineSegment} from "../../renderer/scene/SceneExport.js";
import {FrameBuffer, Viewport, Color} from "../../renderer/framebuffer/FramebufferExport.js";
import {Sphere, Cube2, TriangularPrism, 
        Cylinder, ConeFrustum, Box, Cone, 
        Octahedron, ParametricCurve, 
        SurfaceOfRevolution, Tetrahedron, 
        Torus, Axes3D, PanelXY, PanelXZ} from "../../renderer/models_L/ModelsExport.js";
import {default as OBJ} from "../../renderer/models_L/OBJModel.js";
import {default as GRS} from "../../renderer/models_L/GRSModel.js";
import * as ModelShading from "../../renderer/scene/util/UtilExport.js";

import * as PipelineFunc from "./Pipeline-func/PipelineExport.js";
import * as PipelineLoop from "./Pipeline-loop/PipelineExport.js";
import * as PipelineStruc from "./Pipeline-struc/PipelineExport.js";

const funcRow = document.getElementById("Func");
const funcCanvasArr = funcRow?.getElementsByClassName("image");
const funcTextArr = funcRow?.getElementsByClassName("text");

const loopRow = document.getElementById("Loop");
const loopCanvasArr = loopRow?.getElementsByClassName("image");
const loopTextArr = loopRow?.getElementsByClassName("text");

const strucRow = document.getElementById("Struc");
const strucCanvasArr = strucRow?.getElementsByClassName("image");
const strucTextArr = strucRow?.getElementsByClassName("text");

const funcTimers = new Array(3);
const loopTimers = new Array(3);
const strucTimers = new Array(3);

const timingHandles = new Array(6);
const scenes = new Array(6);

const zeros = [0, 0, 0, 0, 0, 0];
for(let x = 0; x < funcTimers.length; x += 1)
{
    funcTimers[x] = Array.from(zeros);
    loopTimers[x] = Array.from(zeros);
    strucTimers[x] = Array.from(zeros);
}

buildScene1();
buildScene2();
buildScene3();
buildScene4();
buildScene5();
buildScene6();

const fps = 10;
timingHandles[0] = setInterval(runScene1, 1000/fps);
timingHandles[1] = setInterval(runScene2, 1000/fps);
timingHandles[2] = setInterval(runScene3, 1000/fps);
timingHandles[3] = setInterval(runScene4, 1000/fps);
timingHandles[4] = setInterval(runScene5, 1000/fps);
timingHandles[5] = setInterval(runScene6, 1000/fps);

function runScene1()
{
    rotScene(1);
    displayScene(1);
}

function runScene2()
{
    rotScene(2);
    displayScene(2);
}

function runScene3()
{
    rotScene(3);
    displayScene(3);
}

function runScene4()
{
    rotScene(4);
    displayScene(4);
}

function runScene5()
{
    rotScene(5);
    displayScene(5);
}

function runScene6()
{
    rotScene(6);
    displayScene(6);
}

function buildScene1()
{
    scenes[0] = new Scene();
    const pos = new Position();
    const mod = new Sphere();
    const mat = Matrix.translate(0, 0, -3);

    scenes[0].addPosition(pos);
    pos.setMatrix(mat);
    pos.setModel(mod);

    ModelShading.setRandomColor(mod);
}

function buildScene2()
{
    scenes[1] = new Scene();
    scenes[1].addPosition(new Position());
    scenes[1].getPosition(0).setModel(new OBJ("../../../assets/cessna.obj"));
    scenes[1].getPosition(0).setMatrix(Matrix.translate(0, 0, -3));
    
    ModelShading.setRandomColor(scenes[1].getPosition(0).getModel());
}

function buildScene3()
{
    scenes[2] = new Scene();
    scenes[2].addPosition(new Position());
    scenes[2].getPosition(0).setModel(new Cube2(40, 50, 60));
    scenes[2].getPosition(0).setMatrix(Matrix.translate(0, 0, -3));
    
    ModelShading.setRandomColor(scenes[2].getPosition(0).getModel());
}

function buildScene4()
{
    scenes[3] = new Scene();
    scenes[3].addPosition(new Position());
    scenes[3].getPosition(0).setModel(new OBJ("../../../assets/cow.obj"));
    scenes[3].getPosition(0).setMatrix(Matrix.translate(0, 0, -3));

    ModelShading.setRandomColor(scenes[3].getPosition(0).getModel());
}

function buildScene5()
{   
    const topPos = new Position();

    topPos.setMatrix(Matrix.translate(0, 0, -5));
    topPos.addNestedPosition(new Position());
    topPos.addNestedPosition(new Position());
    topPos.addNestedPosition(new Position());
    topPos.addNestedPosition(new Position());

    topPos.getNestedPositions()[0].setModel(new Sphere());
    topPos.getNestedPositions()[1].setModel(new OBJ("../../../assets/cessna.obj"));
    topPos.getNestedPositions()[2].setModel(new Cube2(40, 50, 60));
    topPos.getNestedPositions()[3].setModel(new OBJ("../../../assets/cow.obj"));

    topPos.getNestedPositions()[0].setMatrix(Matrix.translate(-3,  3, 0));
    topPos.getNestedPositions()[1].setMatrix(Matrix.translate( 3,  3, 0));
    topPos.getNestedPositions()[2].setMatrix(Matrix.translate(-3, -3, 0));
    topPos.getNestedPositions()[3].setMatrix(Matrix.translate( 3, -3, 0));

    ModelShading.setRandomColor(topPos.getNestedPositions()[0].getModel());
    ModelShading.setRandomColor(topPos.getNestedPositions()[1].getModel());
    ModelShading.setRandomColor(topPos.getNestedPositions()[2].getModel());
    ModelShading.setRandomColor(topPos.getNestedPositions()[3].getModel());

    scenes[4] = new Scene()
    scenes[4].addPosition(topPos);


}

function buildScene6()
{
    const position = new Array(5);
    for(let x = 0; x < position.length; x += 1)
        position[x] = new Array(3);

    position[0][0] = Position.buildFromModel(new TriangularPrism());
    ModelShading.setColor(position[0][0].getModel(), Color.green);

    position[0][1] = Position.buildFromModel(new Cylinder(.5, 1, 30, 30));
    ModelShading.setColor(position[0][1].getModel(), Color.blue);

    position[0][2] = Position.buildFromModel(
        new OBJ("../../../assets/great_rhombicosidodecahedron.obj"));
    ModelShading.setColor(position[0][2].getModel(), Color.red);

    position[1][0] = Position.buildFromModel(new GRS("../../../assets/grs/bronto.grs"));
    ModelShading.setColor(position[1][0].getModel(), Color.red);

    position[1][1] = Position.buildFromModel(new OBJ("../../../assets/horse.obj"));
    ModelShading.setColor(position[1][1].getModel(), Color.pink);

    position[1][2] = Position.buildFromModel(new ConeFrustum(0.5, 1.0, 1.0, 10, 10));
    ModelShading.setColor(position[1][2].getModel(), Color.orange);

    // row 2
    position[2][0] = Position.buildFromModel(new Torus(0.75, 0.25, 30, 30));
    ModelShading.setColor(position[2][0].getModel(), Color.gray);

    position[2][1] = Position.buildFromModel(new Octahedron(6));
    ModelShading.setColor(position[2][1].getModel(), Color.green);

    position[2][2] = Position.buildFromModel(new Box(1.0, 1.0, 1.0));
    ModelShading.setRandomPrimitiveColor(position[2][2].getModel());

    // row 3
    position[3][0] = Position.buildFromModel(new ParametricCurve());
    ModelShading.setRandomPrimitiveColor(position[3][0].getModel());

    position[3][1] = Position.buildFromModel(new OBJ("../../../assets/small_rhombicosidodecahedron.obj"));
    ModelShading.setColor(position[3][1].getModel(), Color.magenta);

    position[3][2] = Position.buildFromModel(new SurfaceOfRevolution());
    ModelShading.setColor(position[3][2].getModel(), Color.blue);

    // row 4 (last row in first image)
    position[4][0] = Position.buildFromModel(new Cone(0.5, 1.0, 30, 30));
    ModelShading.setColor(position[4][0].getModel(), Color.yellow);

    position[4][1] = Position.buildFromModel(new Tetrahedron(12, 12));
    ModelShading.setColor(position[4][1].getModel(), Color.green);

    position[4][2] = Position.buildFromModel(new Sphere(1.0, 30, 30));
    ModelShading.setColor(position[4][2].getModel(), Color.cyan);

    const xyzAxes = Position.buildFromModel(
                    new Axes3D(-6, 6, 0, 6, -7, 7, Color.red));
    ModelShading.setColor(xyzAxes.getModel(), Color.orange);

    const topLevelP = Position.buildFromModel(new PanelXZ(-6, 6, -7, 7));
    ModelShading.setColor(topLevelP.getModel(), Color.gray);

    topLevelP.addNestedPosition(xyzAxes);

    for(let i = position.length-1; i >=0; --i)
    {
        for(let j = 0; j < position[i].length; ++j)
        {
            topLevelP.addNestedPosition(position[i][j]);
            position[i][j].setMatrix(Matrix.translate(-4+4*j, 0, 6-3*i));
        }
    }

    topLevelP.setMatrix(Matrix.translate(0, 0, -10));
    topLevelP.getMatrix().mult(Matrix.rotateX(45));

    scenes[5] = new Scene();
    scenes[5].addPosition(topLevelP);
}

function rotScene(sceneNumber)
{
    scenes[sceneNumber-1].positionList.forEach( 
        (pos) => {
                    pos.getMatrix().mult(Matrix.rotateX(5))
                                   .mult(Matrix.rotateY(5))
                                   .mult(Matrix.rotateZ(5));
                 });
}

function displayScene(sceneNumber)
{
    displayFunc(sceneNumber-1);
    displayLoop(sceneNumber-1);
    displayStruc(sceneNumber-1);
}

function displayFunc(sceneIndex)
{
    const scene = scenes[sceneIndex];

    const funcText = funcTextArr[sceneIndex];
    const funcCanvas = funcCanvasArr[sceneIndex];
    const funcWidth = funcCanvas.width;
    const funcHeight = funcCanvas.height;
    const funcFb = new FrameBuffer(funcWidth, funcHeight, Color.black);

    const funcStart = new Date().getTime();
    PipelineFunc.renderFB(scene, funcFb);
    const funcEnd = new Date().getTime();

    funcTimers[0][sceneIndex] += (funcEnd - funcStart);// the running total of rendering time
    funcTimers[1][sceneIndex] += 1; // the running total of times rendered
    funcTimers[2][sceneIndex] = funcTimers[0][sceneIndex]/funcTimers[1][sceneIndex]; // the average rendering time

    funcCanvas.getContext("2d").putImageData(new ImageData(funcFb.pixelBuffer, funcWidth, funcHeight), 0, 0);
    funcText.value = "Func Avg: " + funcTimers[2][sceneIndex];
}

function displayLoop(sceneIndex)
{
    const scene = scenes[sceneIndex];

    const loopText = loopTextArr[sceneIndex];
    const loopCanvas = loopCanvasArr[sceneIndex];
    const loopWidth = loopCanvas.width;
    const loopHeight = loopCanvas.height;
    const loopFb = new FrameBuffer(loopWidth, loopHeight, Color.black);

    const loopStart = new Date().getTime();
    PipelineLoop.renderFB(scene, loopFb);
    const loopEnd = new Date().getTime();

    loopTimers[0][sceneIndex] += (loopEnd - loopStart);// the running total of rendering time
    loopTimers[1][sceneIndex] += 1; // the running total of times rendered
    loopTimers[2][sceneIndex] = loopTimers[0][sceneIndex]/loopTimers[1][sceneIndex]; // the average rendering time

    loopCanvas.getContext("2d").putImageData(new ImageData(loopFb.pixelBuffer, loopWidth, loopHeight), 0, 0);
    loopText.value = "Loop Avg: " + loopTimers[2][sceneIndex];
}

function displayStruc(sceneIndex)
{
    const scene = scenes[sceneIndex];

    const strucText = strucTextArr[sceneIndex];
    const strucCanvas = strucCanvasArr[sceneIndex];
    const strucWidth = strucCanvas.width;
    const strucHeight = strucCanvas.height;
    const strucFb = new FrameBuffer(strucWidth, strucHeight, Color.black);

    const strucStart = new Date().getTime();
    PipelineStruc.renderFB(scene, strucFb);
    const strucEnd = new Date().getTime();

    strucTimers[0][sceneIndex] += (strucEnd - strucStart);// the running total of rendering time
    strucTimers[1][sceneIndex] += 1; // the running total of times rendered
    strucTimers[2][sceneIndex] = strucTimers[0][sceneIndex]/strucTimers[1][sceneIndex]; // the average rendering time

    strucCanvas.getContext("2d").putImageData(new ImageData(strucFb.pixelBuffer, strucWidth, strucHeight), 0, 0);
    strucText.value = "Struc Avg: " + strucTimers[2][sceneIndex];
}

document.addEventListener("click", mousePress);
function mousePress(e)
{
    const elementID = e.target.id;

    if(elementID.includes("1"))
    {
        if(timingHandles[0] == null)
            timingHandles[0] = setInterval(runScene1, 1000/fps);
        else
        {
            clearInterval(timingHandles[0]); 
            timingHandles[0] = null;
        }
    }
    else if(elementID.includes("2"))
    {
        if(timingHandles[1] == null)
            timingHandles[1] = setInterval(runScene2, 1000/fps);
        else
        {
            clearInterval(timingHandles[1]); 
            timingHandles[1] = null;
        }
    }
    else if(elementID.includes("3"))
    {
        if(timingHandles[2] == null)
            timingHandles[2] = setInterval(runScene3, 1000/fps);
        else
        {
            clearInterval(timingHandles[2]); 
            timingHandles[2] = null;
        }
    }
    else if(elementID.includes("4"))
    {
        if(timingHandles[3] == null)
            timingHandles[3] = setInterval(runScene4, 1000/fps);
        else
        {
            clearInterval(timingHandles[3]); 
            timingHandles[3] = null;
        }
    }
    else if(elementID.includes("5"))
    {
        if(timingHandles[4] == null)
            timingHandles[4] = setInterval(runScene5, 1000/fps);
        else
        {
            clearInterval(timingHandles[4]); 
            timingHandles[4] = null;
        }
    }
    else if(elementID.includes("6"))
    {
        if(timingHandles[5] == null)
            timingHandles[5] = setInterval(runScene6, 1000/fps);
        else
        {
            clearInterval(timingHandles[5]); 
            timingHandles[5] = null;
        }
    }
}
