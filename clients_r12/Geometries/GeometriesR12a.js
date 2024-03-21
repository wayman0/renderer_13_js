import {Scene, Camera, Position, Model, Matrix} from "../../renderer/scene/SceneExport.js";
import {FrameBuffer, Color} from "../../renderer/framebuffer/FramebufferExport.js";
import {renderFB1, setDoAntiAliasing, setDoGamma} from "../../renderer/pipeline/PipelineExport.js";
import {Axes3D, Box, Cone, ConeFrustum, Cylinder, Octahedron, PanelXZ, ParametricCurve, Sphere, SurfaceOfRevolution, Tetrahedron, Torus, TriangularPrism} from "../../renderer/models_L/ModelsExport.js";
import * as ModelShading from "../../renderer/scene/util/ModelShading.js";
import { format } from "../../renderer/scene/util/StringFormat.js";

const assets = "../../assets/";
let displayFunc; 
let grsImport;
let objImport;
let timerHandle;
let fps = 5;

const right = 2;
const left = -right;
const top = 1;
const bottom = -top;
const cam = new Camera(left, right, bottom, left);
const scene = Scene.buildFromCameraName(cam, "Geometries_R12a");

const xyzAxes = new Axes3D(-6, 6, -6, 0, -7, 7, Color.red);
const xzPlane = new PanelXZ(-6, 6, -7, 7);
ModelShading.setColor(xzPlane, Color.gray.darker(.5));

/**@type {Model[][]} */ const model = new Array(5);
for(let row = 0; row < model.length; row += 1)
    model[row] = new Array(3);

let rot = 0;

try
{
   document;
   displayFunc = write2Canvas;

   grsImport = await import("../../renderer/models_L/GRSModel.js");
   objImport = await import("../../renderer/models_L/OBJModel.js");

   await buildModelArray();

   const resizerEl = document.getElementById("resizer");
   const resizer = new ResizeObserver(write2Canvas);
   resizer.observe(resizerEl);
   
   timerHandle = setInterval(run, 1000/fps);
}
catch(e)
{
   if(e != "ReferenceError: document is not defined")
      console.log(e);
   else
   {
      displayFunc = write2File;
      grsImport = await import("../../renderer/models_L/GRSModelNode.js");
      objImport = await import("../../renderer/models_L/OBJModelNode.js");
   }

   await buildModelArray();
   run();
}


async function buildModelArray()
{
   // row 0 (first row in first image)
    model[0][0] = new TriangularPrism(1.0, 1.0, 10);
    ModelShading.setColor(model[0][0], Color.green.darker().darker());

    model[0][1] = new Cylinder(0.5, 1.0, 30, 30);
    ModelShading.setColor(model[0][1], Color.blue.brighter().brighter());

    model[0][2] = await objImport.default(assets + "great_rhombicosidodecahedron.obj");
    ModelShading.setColor(model[0][2], Color.red);
   // row 1
    model[1][0] = await grsImport.default(assets + "grs/bronto.grs");
    ModelShading.setColor(model[1][0], Color.red);

    model[1][1] = await objImport.default(assets + "horse.obj");
    ModelShading.setColor(model[1][1], Color.pink.darker());

    model[1][2] = new ConeFrustum(0.5, 1.0, 1.0, 10, 10);
    ModelShading.setColor(model[1][2], Color.orange.darker());

   // row 2
    model[2][0] = new Torus(0.75, 0.25, 30, 30);
    ModelShading.setColor(model[2][0], Color.gray);

    model[2][1] = new Octahedron(6);
    ModelShading.setColor(model[2][1], Color.green);

    model[2][2] = new Box(1.0, 1.0, 1.0);
    ModelShading.setRandomPrimitiveColor(model[2][2]);

   // row 3
    model[3][0] = new ParametricCurve(
              (t) => {return 0.3*(Math.sin(t) + 2*Math.sin(2*t)) + 0.1*Math.sin(t/6)},
              (t) => {return 0.3*(Math.cos(t) - 2*Math.cos(2*t)) + 0.1*Math.sin(t/6)},
              (t) => {return 0.3*(-Math.sin(3*t))},
              0, 6*Math.PI, 120);
    ModelShading.setRandomPrimitiveColor(model[3][0]);

    model[3][1] = await objImport.default(assets + "small_rhombicosidodecahedron.obj");
    ModelShading.setColor(model[3][1], Color.magenta);

    model[3][2] = new SurfaceOfRevolution(
              (t) => {return 1.5*(0.5 + 0.15 * Math.sin(10*t+1.0)*Math.sin(5*t+0.5))},
              (t) => {return 1.5*(0.5 + 0.15 * Math.sin(10*t+1.0)*Math.sin(5*t+0.5))},
              (t) => {return 1.5*(0.5 + 0.15 * Math.sin(10*t+1.0)*Math.sin(5*t+0.5))},
              -0.1, 0.9,
              30, 30);
    ModelShading.setColor(model[3][2], Color.blue);

   // row 4 (last row in first image)
    model[4][0] = new Cone(0.5, 1.0, 30, 30);
    ModelShading.setColor(model[4][0], Color.yellow);

    model[4][1] = new Tetrahedron(12, 12);
    ModelShading.setColor(model[4][1], Color.green.brighter().brighter());

    model[4][2] = new Sphere(1.0, 30, 30);
    ModelShading.setColor(model[4][2], Color.cyan.brighter().brighter());

    scene.addPosition(new Position(xzPlane), 
                      new Position(xyzAxes));

    for(let i = model.length -1; i >=0; --i)
    {   
        for(let j = 0; j < model[i].length; ++j)
            scene.addPosition(new Position(model[i][j]));
    }
}

function run()
{
    scene.camera.view2Identity();
    //scene.camera.viewRotateY(-rot);
    scene.camera.viewTranslate(0, 5, 10);

    for(let i = model.length - 1; i >= 0; --i)
    {
        for(let j = 0; j < model[i].length; ++j)
        {
            const mat = Matrix.translate(-4+4*j, 0, 6-3*i)
                            //.timesMatrix(Matrix.rotateX(3*rot))
                            //.timesMatrix(Matrix.rotateY(3*rot));

            model[i][j].matrix = mat;
        }
    }

    rot++;
    displayFunc();
}

function write2Canvas()
{
    const resizerEl = document.getElementById("resizer");

    const w = resizerEl?.offsetWidth;
    const h = resizerEl?.offsetHeight;
 
    const ctx = document.getElementById("pixels").getContext("2d");
    ctx.canvas.width = w;
    ctx.canvas.height = h;
 
    const fb = new FrameBuffer(w, h, Color.black);
 
    renderFB1(scene, fb);
    ctx.putImageData(new ImageData(fb.pixelBuffer,fb.width, fb.height), fb.vp.vp_ul_x, fb.vp.vp_ul_y);
}

function write2File()
{
    const width = 600;
    const height = 300;
    const fb = new FrameBuffer(width, height);

    renderFB1(scene, fb);

    fb.dumpFB2File(format("GeometriesR12_Frame-%03d.ppm", rot))

    if(rot < 360)
        run();
}