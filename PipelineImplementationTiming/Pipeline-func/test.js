//Import what is necessary for your code
import {Scene, Position, Matrix, Model, Vertex, LineSegment} from "../../renderer/scene/SceneExport.js";
import {renderFB, setDoAntiAliasing, doAntiAliasing, setDoGamma, doGamma} from "../../renderer/pipeline/PipelineExport.js";
import {FrameBuffer, Viewport, Color} from "../../renderer/framebuffer/FramebufferExport.js";
import {Sphere} from "../../renderer/models_L/ModelsExport.js";
import {default as OBJ} from "../../renderer/models_L/OBJModelNode.js";
import * as ModelShading from "../../renderer/scene/util/UtilExport.js";

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

console.log(time/360);

console.log("Airplane Rotate 1 Degree 360 Degrees")
time = 0; 
scene = new Scene();

const airplaneMod = await OBJ("cessna.obj");

