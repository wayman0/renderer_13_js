//Import what is necessary for your code
import {Scene, Position, Matrix, Model, Vertex, LineSegment} from "../../renderer/scene/SceneExport.js";
import {renderFB, setRastDebug, setNearDebug, setClipDebug, setDebugScene, setDebugPosition, setDoNearClipping, setDoAntiAliasing, doAntiAliasing, setDoGamma, doGamma} from "./PipelineExport.js";
import {FrameBuffer, Viewport, Color} from "../../renderer/framebuffer/FramebufferExport.js";
import {Sphere, Cube2} from "../../renderer/models_L/ModelsExport.js";
import {default as OBJ} from "../../renderer/models_L/OBJModelNode.js";
import * as ModelShading from "../../renderer/scene/util/UtilExport.js";

const mod = new Model();
mod.addVertex(new Vertex(-1, 0, 0),
              new Vertex(1, 0, 0));
mod.addPrimitive(new LineSegment([0, 1], [0, 0]))

const pos = new Position();
const mat = Matrix.translate(0, 0, -3);
const scene = new Scene();
const fb = new FrameBuffer(500, 500, Color.black);

scene.addPosition(pos);
pos.setModel(mod);
pos.setMatrix(mat);
ModelShading.setRainbowPrimitiveColors(mod);

scene.debug = true;
pos.debug = true;

setClipDebug(true);
setDebugPosition(true);
setDebugScene(true);
setDoNearClipping(true);
setNearDebug(true);
setRastDebug(true);

renderFB(scene, fb);

fb.dumpFB2File("check.ppm");

/*
console.log("Sphere Rotate 1 Degree for 360 Degrees");

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

    console.log(endTime - startTime);
    time += endTime - startTime;
}

console.log("Sphere Avg: " + (time/360));

console.log("Airplane Rotate 1 Degree 360 Degrees")
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

    console.log(endTime - startTime);
    time += endTime - startTime;
}

console.log("Airplane Avg: " + (time/360));

console.log("Cube2(40, 50, 60) Rotate 1 Degree 360 Degrees")
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

    console.log(endTime - startTime);
    time += endTime - startTime;
}

console.log("Cube Avg: " + (time/360));

console.log("Cow Rotate 1 Degree 360 Degrees")
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

    console.log(endTime - startTime);
    time += endTime - startTime;
}

console.log("Cow Avg: " + (time/360));

console.log("All Four Rotate 1 Degree 360 Degrees")
time = 0; 
scene = new Scene();

scene.debug = true;

spherePos.debug = true;
airplanePos.debug = true;
cowPos.debug = true;
cubePos.debug = true;

setClipDebug(true);
setDebugPosition(true);
setDebugScene(true);
setDoNearClipping(true);
setNearDebug(true);
setRastDebug(true);

scene.addPosition(spherePos);
scene.addPosition(airplanePos);
scene.addPosition(cowPos);
scene.addPosition(cubePos);

spherePos.setMatrix(   Matrix.translate(-3,  3, -5));
airplanePos.setMatrix( Matrix.translate( 3,  3, -5));
cowPos.setMatrix(      Matrix.translate(-3, -3, -5));
cubePos.setMatrix(     Matrix.translate( 3, -3, -5));

fb.clearFB();
fb.dumpFB2File("Struc All 4.ppm");

for(let rot = 0; rot < 360; rot += 1)
{
    scene.positionList.forEach( 
        (pos) => 
        {
            pos.getMatrix().mult(Matrix.rotateY(1));

            const startTime = new Date().getTime();
            renderFB(scene, fb);
            const endTime = new Date().getTime();

            console.log(endTime - startTime);
            time += endTime - startTime;
        })
}

console.log("All 4 Avg: " + (time/360));
*/