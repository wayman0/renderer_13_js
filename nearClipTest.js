import {Scene, Position, Matrix} from "./renderer/scene/SceneExport.js";
import {FrameBuffer, Color} from "./renderer/framebuffer/FramebufferExport.js";
import {Cylinder, PanelXZ, TriangularPrism} from "./renderer/models_L/ModelsExport.js";
import {doNearClipping, render1, setDoNearClipping} from "./renderer/pipeline/PipelineExport.js";
import * as ModelShading from "./renderer/scene/util/ModelShading.js";

let angleNumber = 0;
let aspectRatio = 2;
let fovy = 90;
let cameraX = 0;
let cameraY = 3;
let cameraZ = 10;
let cameraRotX = 0;
let cameraRotY = 0;
let cameraRotZ = 0;

const scene = new Scene();

const model1 = new TriangularPrism(1.0, 1.0, 10);
const model2 = new Cylinder(.5, 1, 30, 30);
model1.matrix = Matrix.translate(-4, 0, 3);
model2.matrix = Matrix.translate(0, 0, 3);
ModelShading.setColor(model1, Color.green.darker().darker());
ModelShading.setColor(model2, Color.blue);

const xzPlane = new Position(new PanelXZ(-6, 6, -7, 7));

scene.addPosition(new Position(model1), new Position(model2), xzPlane);

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keypress", handleKeyPress);
setInterval(run, 1000/30);

function run()
{
    angleNumber = (angleNumber + 1) % 360;

    scene.getPosition(0).model.matrix = Matrix.translate(-4, 0, 3)
                                              .mult(Matrix.rotateX(3 * angleNumber))
                                              .mult(Matrix.rotateY(3 * angleNumber));
    
    scene.getPosition(1).model.matrix = Matrix.translate(0, 0, 3)
                                              .mult(Matrix.rotateX(3 * angleNumber))
                                              .mult(Matrix.rotateY(3 * angleNumber));
    display();
}

function display()
{
    scene.camera.projPerspectiveFOVY(fovy, aspectRatio);
    
    scene.camera.view2Identity();
    scene.camera.viewTranslate(cameraX, cameraY, cameraZ);
    scene.camera.viewRotateX(cameraRotX);
    scene.camera.viewRotateY(cameraRotY);
    scene.camera.viewRotateZ(cameraRotZ);

    const resizerEl = document.getElementById("resizer");
    const width = resizerEl.offsetWidth;
    const height = resizerEl.offsetHeight;

    const ctx = document.getElementById("pixels").getContext("2d");
    ctx.canvas.width = width;
    ctx.canvas.height = height;

    const fb = new FrameBuffer(width, height);
        
    render1(scene, fb.vp);
    
    ctx.putImageData(new ImageData(fb.pixelBuffer, fb.width, fb.height), 0, 0);
}

function handleKeyPress(e)
{
    const c = e.key;

    if('b' == c)
    {
        setDoNearClipping(!doNearClipping);
        const clipStr = doNearClipping?"On":"Off";
        console.log("Near Plane Clipping is turned: " + clipStr);
    }
    else if('=' == c)
    {
        cameraRotX = 0.0;
        cameraRotY = 0.0;
        cameraRotZ = 0.0;
    }
    else if('x' == c)
        cameraX -= 1;
    else if('X' == c)
        cameraX += 1;
    else if('y' == c)
        cameraY -= 1;
    else if('Y' == c)   
        cameraY += 1
    else if('z' == c)
        cameraZ -= 1;
    else if('Z' == c)
        cameraZ += 1;

    display();
}

function handleKeyDown(e)
{
    const c = e.key;
    const alt = e.altKey;

    if(alt)
    {
        e.preventDefault();
        
        if('x' == c)
            cameraRotX -= 1;
        else if('X' == c)
            cameraRotX += 1;
        else if('y' == c)
            cameraRotY -= 1;
        else if('Y' == c)   
            cameraRotY += 1
        else if('z' == c)
            cameraRotZ -= 1;
        else if('Z' == c)
            cameraRotZ += 1;

        display();
    }
}
