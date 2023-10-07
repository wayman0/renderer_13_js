/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import {renderFB} from "../renderer/pipeline/PipelineExport.js";
import {Matrix} from "../renderer/scene/SceneExport.js";
import {FrameBuffer} from "../renderer/framebuffer/FramebufferExport.js";
import {buildScene} from "./Geometries_R9b.js";


const scene = buildScene();
const xzPlanePos = scene.getPosition(0);

const  fov    = 90.0;
const  aspect = 2.0;
const  near2   = 1.0;
scene.getCamera().projPerspectiveFOVY(fov, aspect, near2);

let played = true;
document.addEventListener('keypress', keyPressed);

const resizer = new ResizeObserver(display);
// @ts-ignore
resizer.observe(document.getElementById("resizer"));

let k = 0;
let timer = null;

displayNextFrame();

function displayNextFrame()
{
    timer = setInterval(function() 
    {
        const startTime = new Date().getTime();
        rotateModels();
        display();
        const stopTime = new Date().getTime();
        console.log("Wall-clock time: " + (stopTime-startTime));
    }, 1000/50);
}

function display()
{    
    const resizer = document.getElementById("resizer");
    const w = resizer?.offsetWidth;
    const h = resizer?.offsetHeight;

    // @ts-ignore
    const ctx = document.getElementById("pixels").getContext("2d");
    if (ctx == null)
    {
       console.log("cn.getContext(2d) is null");
       return;
    }
    
    ctx.canvas.width = w;
    ctx.canvas.height = h;
    
    // @ts-ignore
    const fb = new FrameBuffer(w, h);
    
    renderFB(scene, fb);
        
    ctx.putImageData(new ImageData(fb.pixelBuffer,fb.width, fb.height), fb.vp.vp_ul_x, fb.vp.vp_ul_y);
}

function rotateModels()
{
    // rotate the xzPlane
    scene.getPosition(0).setMatrix(Matrix.translate(0, -1, -10)
                                            .mult(Matrix.rotateX(15)
                                            .mult(Matrix.rotateY(k))));

    for(let x = 0; x < xzPlanePos.nestedPositions.length; x += 1)
    {
        const p = xzPlanePos.nestedPositions[x];

        p.setMatrix(Matrix.translate(x%3*3-3,  0, Math.trunc(x/3)*-3+3)
                            .mult(Matrix.rotateX(k))
                            .mult(Matrix.rotateY(k)));
    }

    if(k===360) 
        k = 0;
    else
        k += 1;
}

function keyPressed(event)
{
    const c = event.key;
    if ('f' == c) // advance animation one frame
    {
        if (!played)
        {
            rotateModels();
		}
    }
    else if ('p' == c) // start and stop animation
    {
        if (played)
        {
            clearInterval(timer);
            played = false;
        }
        else
        {
            displayNextFrame();
            played = true;
        }
    }
    display();
}
