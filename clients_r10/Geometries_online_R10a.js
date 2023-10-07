/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check
import { renderFB, setDoAntiAliasing, setDoGamma } from "../renderer/pipeline/PipelineExport.js";
import {Matrix} from "../renderer/scene/SceneExport.js";
import {FrameBuffer} from "../renderer/framebuffer/FramebufferExport.js";
import { buildScene } from "./Geometries_R10a.js";


const scene = buildScene();
const topLevel_p = scene.getPosition(0);
const xyzAxes = topLevel_p.nestedPositions[0];

const posRows = Math.sqrt(topLevel_p.nestedPositions.length -1);
const posCols = posRows;

const position = new Array(posRows);
for(let x = 0; x < posRows; x += 1)
   position[x] = new Array(posCols);

for(let i = 0; i < posRows; i += 1)
   for(let j = 0; j < posCols; j += 1)
      position[i][j] = topLevel_p.nestedPositions[posCols * i + j + 1];

// Place the top level Position in front of the camera.
topLevel_p.setMatrix( Matrix.translate(0, -3, -10) );

// Set up the camera's view frustum.
const right  = 2.0;
const left   = -right;
const top    = 1.0;
const bottom = -top;
const near   = 1.0;
scene.getCamera().projPerspective(left, right, bottom, top, near);

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
    
    setDoAntiAliasing(true);
    setDoGamma(true);

    // @ts-ignore
    const fb = new FrameBuffer(w, h);
    renderFB(scene, fb);
    ctx.putImageData(new ImageData(fb.pixelBuffer,fb.width, fb.height), fb.vp.vp_ul_x, fb.vp.vp_ul_y);
}


function rotateModels()
{
    // Place each model where it belongs in the xz-plane
    // and also rotate each model on its own axis.
    for (let i = 0; i < position.length; ++i)
    {
        for (let j = 0; j < position[i].length; ++j)
        {
            position[i][j].matrix2Identity()
                  .mult(Matrix.translate(-4+4*j, 0, 6-3*i))
                  .mult(Matrix.rotateX(3*k))
                  .mult(Matrix.rotateY(3*k));
        }
    }

    // Rotate the top level Position one degree (accumulate the rotations).
    topLevel_p.getMatrix().mult(Matrix.rotateY(1));

    if(k===360)
        k = 0
    else
        k += 1;
}


// Start and stop the animation.
// When stopped, advance the animation one frame at a time.
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
