//Import what is necessary for your code
import {Scene, Position, Matrix, Model, Vertex, LineSegment} from "../renderer/scene/SceneExport.js";
import {FrameBuffer, Viewport, Color} from "../renderer/framebuffer/FramebufferExport.js";
import {Sphere, Cube2, TriangularPrism, 
        Cylinder, ConeFrustum, Box, Cone, 
        Octahedron, ParametricCurve, 
        SurfaceOfRevolution, Tetrahedron, 
        Torus, Axes3D, PanelXY, PanelXZ} from "../renderer/models_L/ModelsExport.js";
import {default as OBJ} from "../renderer/models_L/OBJModel.js";
import {default as GRS} from "../renderer/models_L/GRSModel.js";
import * as ModelShading from "../renderer/scene/util/UtilExport.js";

import * as PipelineFunc from "./Pipeline-func/PipelineExport.js";
import * as PipelineLoop from "./Pipeline-loop/PipelineExport.js";
import * as PipelineStruc from "./Pipeline-struc/PipelineExport.js";
import * as PipelineStatic1 from "./Pipeline-static-v1/PipelineExport.js";
import * as PipelineStatic2 from "./Pipeline-static-v2/PipelineExport.js";

//alert("Sphere Rotate 1 Degree for 360 Degrees");

//Create a default sphere from the Models import
const sphereMod = new Sphere();
//Set the sphere to be a random color using the Model Shading import
ModelShading.setRandomColor(sphereMod);

//Create a position to hold the model
const spherePos = Position.buildFromModel(sphereMod);
//Set the position to be translated back 3 units
spherePos.setMatrix(Matrix.translate(0, 0, -3));

//Create an empy scene
let scene = new Scene();
//Add the sphere position to the scene
scene.addPosition(spherePos);

let funcTimer = 0;
let funcStart = 0;
let funcStop = 0;

let loopTimer = 0;
let loopStart = 0;
let loopStop = 0;

let strucTimer = 0;
let strucStart = 0; 
let strucStop = 0;

let static1Timer = 0; 
let static1Start = 0;
let static1Stop = 0;

let static2Timer = 0;
let static2Start = 0;
let static2Stop = 0;

let fb = new FrameBuffer(600, 600, Color.black);
for(let rot = 0; rot < 360; rot += 1)
{
    spherePos.getMatrix().mult(Matrix.rotateY(1));

    funcStart = new Date().getTime();
    PipelineFunc.renderFB(scene, fb);
    funcStop = new Date().getTime();
    funcTimer += funcStop - funcStart;

    loopStart = new Date().getTime();
    PipelineLoop.renderFB(scene, fb);
    loopStop = new Date().getTime();
    loopTimer += loopStop - loopStart;

    strucStart = new Date().getTime();
    PipelineStruc.renderFB(scene, fb);
    strucStop = new Date().getTime();
    strucTimer += strucStop - strucStart;

    static1Start = new Date().getTime();
    PipelineStatic1.renderFB(scene, fb);
    static1Stop = new Date().getTime();
    static1Timer += static1Stop - static1Start;

    static2Start = new Date().getTime();
    PipelineStatic2.renderFB(scene, fb);
    static2Stop = new Date().getTime();
    static2Timer += static2Stop - static2Start;
}

console.log("Sphere Rotation: ");
console.log("\tFunc Avg:  "  + (funcTimer/360));
console.log("\tLoop Avg:  "  + (loopTimer/360));
console.log("\tStruc Avg: "  + (strucTimer/360));
console.log("\tStatic 1 Avg: " + (static1Timer/360));
console.log("\tStatic 2 Avg: " + (static2Timer/360));



//alert("Airplane Rotate 1 Degree 360 Degrees")
scene = new Scene();

const airplaneMod = new OBJ("../../../assets/cessna.obj");
const airplanePos = Position.buildFromModel(airplaneMod);
const airplaneMat = Matrix.translate(0, 0, -3);

scene.addPosition(airplanePos);
airplanePos.setMatrix(airplaneMat);
ModelShading.setRandomColor(airplaneMod);

funcTimer = 0;
funcStart = 0;
funcStop = 0;

loopTimer = 0;
loopStart = 0;
loopStop = 0;

strucTimer = 0;
strucStart = 0; 
strucStop = 0;

static1Timer = 0; 
static1Start = 0;
static1Stop = 0;

static2Timer = 0;
static2Start = 0;
static2Stop = 0;

fb = new FrameBuffer(600, 600, Color.black);
for(let rot = 0; rot < 360; rot += 1)
{
    airplanePos.getMatrix().mult(Matrix.rotateY(1));

    funcStart = new Date().getTime();
    PipelineFunc.renderFB(scene, fb);
    funcStop = new Date().getTime();
    funcTimer += funcStop - funcStart;

    loopStart = new Date().getTime();
    PipelineLoop.renderFB(scene, fb);
    loopStop = new Date().getTime();
    loopTimer += loopStop - loopStart;

    strucStart = new Date().getTime();
    PipelineStruc.renderFB(scene, fb);
    strucStop = new Date().getTime();
    strucTimer += strucStop - strucStart;

    static1Start = new Date().getTime();
    PipelineStatic1.renderFB(scene, fb);
    static1Stop = new Date().getTime();
    static1Timer += static1Stop - static1Start;

    static2Start = new Date().getTime();
    PipelineStatic2.renderFB(scene, fb);
    static2Stop = new Date().getTime();
    static2Timer += static2Stop - static2Start;
}

console.log("Airplane Rotation: ");
console.log("\tFunc Avg:  "  + (funcTimer/360));
console.log("\tLoop Avg:  "  + (loopTimer/360));
console.log("\tStruc Avg: "  + (strucTimer/360));
console.log("\tStatic 1 Avg: " + (static1Timer/360));
console.log("\tStatic 2 Avg: " + (static2Timer/360));


scene = new Scene();

const cubeMod = new Cube2(40, 50, 60);
const cubePos = Position.buildFromModel(cubeMod);
const cubeMat = Matrix.translate(0, 0, -3);

scene.addPosition(cubePos);
cubePos.setMatrix(cubeMat);
ModelShading.setRandomColor(cubeMod);

funcTimer = 0;
funcStart = 0;
funcStop = 0;

loopTimer = 0;
loopStart = 0;
loopStop = 0;

strucTimer = 0;
strucStart = 0; 
strucStop = 0;

static1Timer = 0; 
static1Start = 0;
static1Stop = 0;

static2Timer = 0;
static2Start = 0;
static2Stop = 0;

fb = new FrameBuffer(600, 600, Color.black);
for(let rot = 0; rot < 360; rot += 1)
{
    cubePos.getMatrix().mult(Matrix.rotateY(1));

    funcStart = new Date().getTime();
    PipelineFunc.renderFB(scene, fb);
    funcStop = new Date().getTime();
    funcTimer += funcStop - funcStart;

    loopStart = new Date().getTime();
    PipelineLoop.renderFB(scene, fb);
    loopStop = new Date().getTime();
    loopTimer += loopStop - loopStart;

    strucStart = new Date().getTime();
    PipelineStruc.renderFB(scene, fb);
    strucStop = new Date().getTime();
    strucTimer += strucStop - strucStart;

    static1Start = new Date().getTime();
    PipelineStatic1.renderFB(scene, fb);
    static1Stop = new Date().getTime();
    static1Timer += static1Stop - static1Start;

    static2Start = new Date().getTime();
    PipelineStatic2.renderFB(scene, fb);
    static2Stop = new Date().getTime();
    static2Timer += static2Stop - static2Start;
}

console.log("Cube Rotation: ");
console.log("\tFunc Avg:  "  + (funcTimer/360));
console.log("\tLoop Avg:  "  + (loopTimer/360));
console.log("\tStruc Avg: "  + (strucTimer/360));
console.log("\tStatic 1 Avg: " + (static1Timer/360));
console.log("\tStatic 2 Avg: " + (static2Timer/360));
scene = new Scene();

const cowMod = new OBJ("../../../assets/cow.obj");
const cowPos = Position.buildFromModel(cowMod);
const cowMat = Matrix.translate(0, 0, -3);

scene.addPosition(cowPos);
airplanePos.setMatrix(cowMat);
ModelShading.setRandomColor(cowMod);

funcTimer = 0;
funcStart = 0;
funcStop = 0;

loopTimer = 0;
loopStart = 0;
loopStop = 0;

strucTimer = 0;
strucStart = 0; 
strucStop = 0;

static1Timer = 0; 
static1Start = 0;
static1Stop = 0;

static2Timer = 0;
static2Start = 0;
static2Stop = 0;

fb = new FrameBuffer(600, 600, Color.black);
for(let rot = 0; rot < 360; rot += 1)
{
    cowPos.getMatrix().mult(Matrix.rotateY(1));

    funcStart = new Date().getTime();
    PipelineFunc.renderFB(scene, fb);
    funcStop = new Date().getTime();
    funcTimer += funcStop - funcStart;

    loopStart = new Date().getTime();
    PipelineLoop.renderFB(scene, fb);
    loopStop = new Date().getTime();
    loopTimer += loopStop - loopStart;

    strucStart = new Date().getTime();
    PipelineStruc.renderFB(scene, fb);
    strucStop = new Date().getTime();
    strucTimer += strucStop - strucStart;

    static1Start = new Date().getTime();
    PipelineStatic1.renderFB(scene, fb);
    static1Stop = new Date().getTime();
    static1Timer += static1Stop - static1Start;

    static2Start = new Date().getTime();
    PipelineStatic2.renderFB(scene, fb);
    static2Stop = new Date().getTime();
    static2Timer += static2Stop - static2Start;
}

console.log("Cow Rotation: ");
console.log("\tFunc Avg:  "  + (funcTimer/360));
console.log("\tLoop Avg:  "  + (loopTimer/360));
console.log("\tStruc Avg: "  + (strucTimer/360));
console.log("\tStatic 1 Avg: " + (static1Timer/360));
console.log("\tStatic 2 Avg: " + (static2Timer/360));

scene = new Scene();

scene.addPosition(spherePos);
scene.addPosition(airplanePos);
scene.addPosition(cowPos);
scene.addPosition(cubePos);

spherePos.setMatrix(   Matrix.translate(-3,  3, -5));
airplanePos.setMatrix( Matrix.translate( 3,  3, -5));
cowPos.setMatrix(      Matrix.translate(-3, -3, -5));
cubePos.setMatrix(     Matrix.translate( 3, -3, -5));

funcTimer = 0;
funcStart = 0;
funcStop = 0;

loopTimer = 0;
loopStart = 0;
loopStop = 0;

strucTimer = 0;
strucStart = 0; 
strucStop = 0;

static1Timer = 0; 
static1Start = 0;
static1Stop = 0;

static2Timer = 0;
static2Start = 0;
static2Stop = 0;

for(let rot = 0; rot < 360; rot += 1)
{
    spherePos.getMatrix().mult(Matrix.rotateY(1));
    airplanePos.getMatrix().mult(Matrix.rotateY(1));
    cowPos.getMatrix().mult(Matrix.rotateY(1));
    cubePos.getMatrix().mult(Matrix.rotateY(1));

    funcStart = new Date().getTime();
    PipelineFunc.renderFB(scene, fb);
    funcStop = new Date().getTime();
    funcTimer += funcStop - funcStart;

    loopStart = new Date().getTime();
    PipelineLoop.renderFB(scene, fb);
    loopStop = new Date().getTime();
    loopTimer += loopStop - loopStart;

    strucStart = new Date().getTime();
    PipelineStruc.renderFB(scene, fb);
    strucStop = new Date().getTime();
    strucTimer += strucStop - strucStart;

    static1Start = new Date().getTime();
    PipelineStatic1.renderFB(scene, fb);
    static1Stop = new Date().getTime();
    static1Timer += static1Stop - static1Start;

    static2Start = new Date().getTime();
    PipelineStatic2.renderFB(scene, fb);
    static2Stop = new Date().getTime();
    static2Timer += static2Stop - static2Start;
}

console.log("All four Rotation: ");
console.log("\tFunc Avg:  "  + (funcTimer/360));
console.log("\tLoop Avg:  "  + (loopTimer/360));
console.log("\tStruc Avg: "  + (strucTimer/360));
console.log("\tStatic 1 Avg: " + (static1Timer/360));
console.log("\tStatic 2 Avg: " + (static2Timer/360));

scene = new Scene();
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
    for(let j = 0; j < position[i].length; ++j)
        topLevelP.addNestedPosition(position[i][j]);

scene.addPosition(topLevelP);
topLevelP.setMatrix(Matrix.translate(0, 0, -10));
topLevelP.getMatrix().mult(Matrix.rotateX(45));

const right = 2;
const left = -right;
const top = 1;
const bot = -top;
const near = 1;
scene.getCamera().projPerspective(left, right, bot, top, near);

const vpWidth = 1800;
const vpHeight = 900;
fb = new FrameBuffer(vpWidth, vpHeight);

funcTimer = 0;
funcStart = 0;
funcStop = 0;

loopTimer = 0;
loopStart = 0;
loopStop = 0;

strucTimer = 0;
strucStart = 0; 
strucStop = 0;

static1Timer = 0; 
static1Start = 0;
static1Stop = 0;

static2Timer = 0;
static2Start = 0;
static2Stop = 0;

for(let k = 0; k < 360; ++k)
{
    for(let i = 0; i < position.length; ++i)
    {
        for(let j = 0; j < position[i].length; ++j)
        {
            position[i][j].matrix2Identity()
                          .mult(Matrix.translate(-4+4*j, 0, 6-3*i))
                          .mult(Matrix.rotateX(3*k))
                          .mult(Matrix.rotateY(3*k));
        }
    }

    funcStart = new Date().getTime();
    PipelineFunc.renderFB(scene, fb);
    funcStop = new Date().getTime();
    funcTimer += funcStop - funcStart;

    loopStart = new Date().getTime();
    PipelineLoop.renderFB(scene, fb);
    loopStop = new Date().getTime();
    loopTimer += loopStop - loopStart;

    strucStart = new Date().getTime();
    PipelineStruc.renderFB(scene, fb);
    strucStop = new Date().getTime();
    strucTimer += strucStop - strucStart;

    static1Start = new Date().getTime();
    PipelineStatic1.renderFB(scene, fb);
    static1Stop = new Date().getTime();
    static1Timer += static1Stop - static1Start;
    
    static2Start = new Date().getTime();
    PipelineStatic2.renderFB(scene, fb);
    static2Stop = new Date().getTime();
    static2Timer += static2Stop - static2Start;

    topLevelP.getMatrix().mult(Matrix.rotateY(1));
}

console.log("Geometries Rotation: ");
console.log("\tFunc Avg:  "  + (funcTimer/360));
console.log("\tLoop Avg:  "  + (loopTimer/360));
console.log("\tStruc Avg: "  + (strucTimer/360));
console.log("\tStatic 1 Avg: " + (static1Timer/360));
console.log("\tStatic 2 Avg: " + (static2Timer/360));
