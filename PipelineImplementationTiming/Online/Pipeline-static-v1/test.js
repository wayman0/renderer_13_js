//Import what is necessary for your code
import {Scene, Position, Matrix, Model, Vertex, LineSegment} from "../../../renderer/scene/SceneExport.js";
import {renderFB, setDoAntiAliasing, doAntiAliasing, setDoGamma, doGamma, setDebugScene, render} from "./PipelineExport.js";
import {FrameBuffer, Viewport, Color} from "../../../renderer/framebuffer/FramebufferExport.js";
import {Sphere, Cube2, TriangularPrism, 
        Cylinder, ConeFrustum, Box, Cone, 
        Octahedron, ParametricCurve, 
        SurfaceOfRevolution, Tetrahedron, 
        Torus, Axes3D, PanelXY, PanelXZ} from "../../../renderer/models_L/ModelsExport.js";
import {default as OBJ} from "../../../renderer/models_L/OBJModelNode.js";
import {default as GRS} from "../../../renderer/models_L/GRSModelNode.js";
import * as ModelShading from "../../../renderer/scene/util/UtilExport.js";

//console.log("Sphere Rotate 1 Degree for 360 Degrees");

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

let time = 0;
const fb = new FrameBuffer(600, 600, Color.black);
for(let rot = 0; rot < 360; rot += 1)
{
    spherePos.getMatrix().mult(Matrix.rotateY(1));

    const startTime = new Date().getTime();
    renderFB(scene, fb);
    const endTime = new Date().getTime();

    //console.log(endTime - startTime);
    time += endTime - startTime;
}

console.log("Sphere Avg: " + (time/360));

//console.log("Airplane Rotate 1 Degree 360 Degrees")
time = 0; 
scene = new Scene();

const airplaneMod = await OBJ("../assets/cessna.obj");
const airplanePos = Position.buildFromModel(airplaneMod);
const airplaneMat = Matrix.translate(0, 0, -3);

scene.addPosition(airplanePos);
airplanePos.setMatrix(airplaneMat);
ModelShading.setRandomColor(airplaneMod);

for(let rot = 0; rot < 360; rot += 1)
{
    airplanePos.getMatrix().mult(Matrix.rotateY(1));

    const startTime = new Date().getTime();
    renderFB(scene, fb);
    const endTime = new Date().getTime();

    //console.log(endTime - startTime);
    time += endTime - startTime;
}

console.log("Airplane Avg: " + (time/360));

//console.log("Cube2(40, 50, 60) Rotate 1 Degree 360 Degrees")
time = 0; 
scene = new Scene();

const cubeMod = new Cube2(40, 50, 60);
const cubePos = Position.buildFromModel(cubeMod);
const cubeMat = Matrix.translate(0, 0, -3);

scene.addPosition(cubePos);
cubePos.setMatrix(cubeMat);
ModelShading.setRandomColor(cubeMod);

for(let rot = 0; rot < 360; rot += 1)
{
    cubePos.getMatrix().mult(Matrix.rotateY(1));

    const startTime = new Date().getTime();
    renderFB(scene, fb);
    const endTime = new Date().getTime();

    //console.log(endTime - startTime);
    time += endTime - startTime;
}

console.log("Cube Avg: " + (time/360));

//console.log("Cow Rotate 1 Degree 360 Degrees")
time = 0; 
scene = new Scene();

const cowMod = await OBJ("../assets/cow.obj");
const cowPos = Position.buildFromModel(cowMod);
const cowMat = Matrix.translate(0, 0, -3);

scene.addPosition(cowPos);
airplanePos.setMatrix(cowMat);
ModelShading.setRandomColor(cowMod);

for(let rot = 0; rot < 360; rot += 1)
{
    cowPos.getMatrix().mult(Matrix.rotateY(1));

    const startTime = new Date().getTime();
    renderFB(scene, fb);
    const endTime = new Date().getTime();

    //console.log(endTime - startTime);
    time += endTime - startTime;
}

console.log("Cow Avg: " + (time/360));

//console.log("All Four Rotate 1 Degree 360 Degrees")
time = 0; 
scene = new Scene();

scene.addPosition(spherePos);
scene.addPosition(airplanePos);
scene.addPosition(cowPos);
scene.addPosition(cubePos);

spherePos.setMatrix(   Matrix.translate(-3,  3, -5));
airplanePos.setMatrix( Matrix.translate( 3,  3, -5));
cowPos.setMatrix(      Matrix.translate(-3, -3, -5));
cubePos.setMatrix(     Matrix.translate( 3, -3, -5));

for(let rot = 0; rot < 360; rot += 1)
{
    spherePos.getMatrix().mult(Matrix.rotateY(1));
    airplanePos.getMatrix().mult(Matrix.rotateY(1));
    cowPos.getMatrix().mult(Matrix.rotateY(1));
    cubePos.getMatrix().mult(Matrix.rotateY(1));

    const startTime = new Date().getTime();
    renderFB(scene, fb);
    const endTime = new Date().getTime();

    time += endTime - startTime;
}

console.log("All four Avg: " + (time/360));

time = 0;
scene = new Scene();
const position = new Array(5);
for(let x = 0; x < position.length; x += 1)
    position[x] = new Array(3);

position[0][0] = Position.buildFromModel(new TriangularPrism());
ModelShading.setColor(position[0][0].getModel(), Color.green);

position[0][1] = Position.buildFromModel(new Cylinder(.5, 1, 30, 30));
ModelShading.setColor(position[0][1].getModel(), Color.blue);

position[0][2] = Position.buildFromModel(
    await OBJ("../assets/great_rhombicosidodecahedron.obj"));
ModelShading.setColor(position[0][2].getModel(), Color.red);

position[1][0] = Position.buildFromModel(await GRS("../assets/grs/bronto.grs"));
ModelShading.setColor(position[1][0].getModel(), Color.red);

position[1][1] = Position.buildFromModel(await OBJ("../assets/horse.obj"));
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

position[3][1] = Position.buildFromModel(await OBJ("../assets/small_rhombicosidodecahedron.obj"));
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
const frame = new FrameBuffer(vpWidth, vpHeight);

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

    setDoAntiAliasing(true);
    setDoGamma(true);

    frame.clearFB();
    const startTime = new Date().getTime();
    renderFB(scene, frame);
    const endTime = new Date().getTime();

    time += endTime - startTime;

    topLevelP.getMatrix().mult(Matrix.rotateY(1));
}

console.log("Geometries Avg: " + (time/360));
