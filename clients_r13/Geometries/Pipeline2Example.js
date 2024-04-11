import {Scene, Position, Matrix, Model} from "../../renderer/scene/SceneExport.js";
import {FrameBuffer, Color} from "../../renderer/framebuffer/FramebufferExport.js";
import {Cube, Sphere} from "../../renderer/models_L/ModelsExport.js";
import {render1, render2, scene1, scene2, scene3, scene4, scene5, scene6} from "../../renderer/pipeline/PipelineExport.js";
import * as ModelShading from "../../renderer/scene/util/ModelShading.js";

const scene = new Scene();
// add a sphere model and translate it so it gets a little bit clipped and near clipped
scene.addPosition(new Position(new Sphere(), Matrix.translate(-1, 0, -1)))
ModelShading.setRandomColor(scene.getPosition(0).model);

//displayScenes();
setInterval(rotate, 1000/20);

function rotate()
{
    scene.getPosition(0).matrix.mult(Matrix.rotateY(1));// rotate the sphere 
    
    displayScenes();
}

// top canvas gets the regular scene
// render the scene using render1 and render 2
// take each scene from render2 and use render1 on it
// then right the render1 rendering of renderer2 scene to appropriate canvas
function displayScenes()
{
    // what the render1 does
    const resizer = document.getElementById("resizer");
    const w = resizer.offsetWidth;
    const h = resizer.offsetHeight;

    const ctx = document.getElementById("pixels").getContext("2d");
    ctx.canvas.width = w; 
    ctx.canvas.height = h;

    const fb = new FrameBuffer(w, h, Color.black);

    // make the individual scene stages
    // and draw the image
    render2(scene, fb.vp);
    ctx.putImageData(new ImageData(fb.pixelBuffer, w, h), 0, 0);

    const resArr = document.getElementsByClassName("res");
    const canvArr = document.getElementsByClassName("pix");
    const ctxArr = new Array(resArr.length);
    /**@type{Scene[]} */ const sceneArr = [scene1, scene2, scene3, scene4, scene5, scene6];

    display1(resArr[0], canvArr[0], ctxArr[0], sceneArr[0]);
    display2(resArr[1], canvArr[1], ctxArr[1], sceneArr[1]);
    display3(resArr[2], canvArr[2], ctxArr[2], sceneArr[2]);
    display4(resArr[3], canvArr[3], ctxArr[3], sceneArr[3]);
    display5(resArr[4], canvArr[4], ctxArr[4], sceneArr[4]);
    display6(resArr[5], canvArr[5], ctxArr[5], sceneArr[5]);
}


/**
 * Stage 1 Model 2 World
 * 
 * @param {HTMLDivElement} res 
 * @param {HTMLCanvasElement} canv 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Scene} sc 
 */
function display1(res, canv, ctx, sc)
{
    //sc.getPosition(0).model.matrix.mult(Matrix.translate(1, 0, -3));

    display(res, canv, ctx, sc);
}

/**
 * Stage 2 World 2 View
 * 
 * @param {HTMLDivElement} res 
 * @param {HTMLCanvasElement} canv 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Scene} sc 
 */
function display2(res, canv, ctx, sc)
{
    //sc.getPosition(0).model.matrix.mult(Matrix.translate(1, 0, -3));

    display(res, canv, ctx, sc);
}

/**
 * Stage 3 View to Camera
 * 
 * @param {HTMLDivElement} res 
 * @param {HTMLCanvasElement} canv 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Scene} sc 
 */
function display3(res, canv, ctx, sc)
{
    //sc.getPosition(0).model.matrix.mult(Matrix.translate(1, 0, -3));

    display(res, canv, ctx, sc);
}

/**
 * Stage 4 Near Clip
 * 
 * @param {HTMLDivElement} res 
 * @param {HTMLCanvasElement} canv 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Scene} sc 
 */
function display4(res, canv, ctx, sc)
{
    // translate the model so we can see the near clip
    sc.getPosition(0).model.matrix.mult(Matrix.translate(1, 0, -1));

    display(res, canv, ctx, sc);
}

/**
 * Stage 5 Project
 * 
 * @param {HTMLDivElement} res 
 * @param {HTMLCanvasElement} canv 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Scene} sc 
 */
function display5(res, canv, ctx, sc)
{
    // translate the model back and rotate so we can see the projection from 3d to 2d
    sc.getPosition(0).model.matrix.mult(Matrix.translate(0, 0, -1)
                                  .mult(Matrix.rotateY(90)));

    display(res, canv, ctx, sc);
}

/**
 * Stage 6 Clip
 * 
 * @param {HTMLDivElement} res 
 * @param {HTMLCanvasElement} canv 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Scene} sc 
 */
function display6(res, canv, ctx, sc)
{
    // translate the model to show the clipping
    sc.getPosition(0).model.matrix.mult(Matrix.rotateY(-90));

    display(res, canv, ctx, sc);
}

function display(res, canv, ctx, sc)
{
    const w = res.offsetWidth;
    const h = res.offsetHeight;

    const fb = new FrameBuffer(w, h, Color.black);

    ctx = canv.getContext("2d");
    canv.width = w;
    canv.height = h;

    render1(sc, fb.vp);
    ctx.putImageData(new ImageData(fb.pixelBuffer, w, h), 0, 0);
}

