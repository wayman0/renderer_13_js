import {Camera, Matrix, Position, Scene} from "../../renderer/scene/SceneExport.js";
import {render1} from "../../renderer/pipeline/PipelineExport.js";
import {FrameBuffer, Viewport, Color} from "../../renderer/framebuffer/FramebufferExport.js";
import {Cone, Octahedron, PanelXZ, Tetrahedron} from "../../renderer/models_L/ModelsExport.js";
import * as ModelShading from "../../renderer/scene/util/ModelShading.js";

const left = -3;
const right = 3;
const bottom = -3;
const top = 3;
const cam = new Camera();
cam.projOrtho(left, right, bottom, top);
const scene = new Scene(cam);

const m0 = new Tetrahedron();
ModelShading.setColor(m0, Color.red);
const p0 = new Position(m0)
p0.matrix = Matrix.translate(-2, 0, 1).timesMatrix(Matrix.scale(2));

const m1 = new Octahedron(5);
ModelShading.setColor(m1, Color.blue);
const p1 = new Position(m1);
p1.matrix = Matrix.translate(2, 2, -1).timesMatrix(Matrix.scale(2));

const m2 = new Cone(4, 4, 2, 5);
ModelShading.setColor(m2, Color.green);
const p2 = new Position(m2);

const floor = new PanelXZ(-5, 5, -5, 5);
ModelShading.setColor(floor, Color.black);
const floorPos = new Position(floor);

scene.addPosition(p0, p1, p2, floorPos);

const resizerEl = document.getElementById("resizer");
const resizer = new ResizeObserver(write2Canvas);

const w = resizerEl.offsetWidth;
const h = resizerEl.offsetHeight;

const fb = new FrameBuffer(w, h, Color.gray.darker(.75));

const vp1 = new Viewport(w/2, h/2, fb, 0,   0,   Color.white);
const vp2 = new Viewport(w/2, h/2, fb, w/2, 0,   Color.white);
const vp3 = new Viewport(w/2, h/2, fb, 0,   h/2, Color.white);

setInterval(run, 1000/40);

function run()
{
    fb.clearFB();

    vp1.clearVP();

    scene.camera.view2Identity();
    let    eyex = 0,    eyey = 3,    eyez = 4; // where the camera is
    let centerx = 0, centery = 3, centerz = 0; // where the camera is pointed
    let     upx = 0,     upy = 1,     upz = 0; // where the top of the camera is pointed
    scene.camera.viewLookAt(   eyex,    eyey,    eyez, 
                            centerx, centery, centerz, 
                                upx,     upy,     upz);
    render1(scene, vp1);

    vp2.clearVP();
    scene.camera.view2Identity();
    eyex=4;    eyey=3;    eyez=0;
    centerx=0; centery=3; centerz=0;
    upx=0;     upy=1;     upz=0;
    scene.camera.viewLookAt(eyex,    eyey,    eyez,
                            centerx, centery, centerz,
                            upx,     upy,     upz);

    render1(scene, vp2);

    vp3.clearVP();
    scene.camera.view2Identity();
    eyex=0;    eyey=6;    eyez=0;
    centerx=0; centery=0; centerz=0;
    upx=0;     upy=0;     upz=-1;
    scene.camera.viewLookAt(eyex,    eyey,    eyez,
                            centerx, centery, centerz,
                            upx,     upy,     upz);
    render1(scene, vp3);

    const mat0 = scene.getPosition(0).matrix.timesMatrix(Matrix.rotateY(5));
    const mat1 = scene.getPosition(1).matrix.timesMatrix(Matrix.rotateX(5));
    const mat2 = scene.getPosition(2).matrix.timesMatrix(Matrix.rotateY(5));

    scene.setPosition(0, scene.getPosition(0).transform(mat0));
    scene.setPosition(1, scene.getPosition(1).transform(mat1));
    scene.setPosition(2, scene.getPosition(2).transform(mat2));

    write2Canvas();
}

function write2Canvas()
{
    const ctx = document.getElementById("pixels").getContext("2d");
    ctx.canvas.width = w;
    ctx.canvas.height = h;

    ctx.putImageData(new ImageData(fb.pixelBuffer, w, h), 0, 0);
}
