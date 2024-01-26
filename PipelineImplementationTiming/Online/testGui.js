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

const funcCanvasArr = new Array(6);
const loopCanvasArr = new Array(6);
const strucCanvasArr = new Array(6);

const funcDivArr = new Array(6);
const loopDivArr = new Array(6);
const strucDivArr = new Array(6);

const funcText = new Array(6);
const loopText = new Array(6);
const strucText = new Array(6);

const funcTimers = new Array(4);
const loopTimers = new Array(4);
const strucTimers = new Array(4);

for(let x = 0; x < funcTimers.length; x += 1)
{
    funcTimers[x] = new Array(6);
    loopTimers[x] = new Array(6);
    strucTimers[x] = new Array(6);
}

const scene1Timer = setInterval(displayScene1, 1000/5);
function displayScene1()
{
    const sceneIndex = 1;

    const funcCanvas = funcCanvasArr[sceneIndex-1];
    const funcWidth = funcCanvas.width;
    const funcHeight = funcCanvas.height;
    const funcFb = new FrameBuffer(funcWidth, funcHeight, Color.black);

    const loopCanvas = funcCanvasArr[sceneIndex-1];
    const loopWidth = funcCanvas.width;
    const loopHeight = funcCanvas.height;
    const loopFb = new FrameBuffer(loopWidth, loopHeight, Color.black);

    const strucCanvas = funcCanvasArr[sceneIndex-1];
    const strucWidth = funcCanvas.width;
    const strucHeight = funcCanvas.height;
    const strucFb = new FrameBuffer(strucWidth, strucHeight, Color.black);


    //render the scenes with the different pipelines
    
    

}

const scene2Timer = setInterval(displayScene1, 1000/5);
function displayScene2()
{
    const sceneIndex = 2;

}

const scene3Timer = setInterval(displayScene1, 1000/5);
function displayScene3()
{
    const sceneIndex = 3;
 
}

const scene4Timer = setInterval(displayScene1, 1000/5);
function displayScene4()
{
    const sceneIndex = 4;

}

const scene5Timer = setInterval(displayScene1, 1000/5);
function displayScene5()
{    
    const sceneIndex = 5;
    
}

const scene6Timer = setInterval(displayScene1, 1000/5);
function displayScene6()
{
    const sceneIndex = 6;
 
}