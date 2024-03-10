//@ts-check
import {Scene, Position, Matrix} from "../renderer/scene/SceneExport.js";
import {SierpinskiTriangle} from "../renderer/models_L/ModelsExport.js";
import * as ModelShading from "../renderer/scene/util/ModelShading.js";
import {Color, FrameBuffer} from "../renderer/framebuffer/FramebufferExport.js";
import {renderFB1} from "../renderer/pipeline/PipelineExport.js";
import { format } from "../renderer/scene/util/StringFormat.js";

const scene = Scene.buildFromName("SierpinskiMoviev2");
scene.getCamera().projOrtho(-1, 1, -1, 1);

const topP = Position.buildFromName("top");
scene.addPosition(topP);
topP.getMatrix().mult(Matrix.rotateZ(90));

let sierTriangle = new SierpinskiTriangle(8);
ModelShading.setColor(sierTriangle.nestedModels[0], Color.Magenta);
ModelShading.setColor(sierTriangle.nestedModels[1], Color.red);
ModelShading.setColor(sierTriangle.nestedModels[2], Color.Blue);
topP.setModel(sierTriangle);

const angle = 1;

const vpW = 1024;
const vpH = 1024;
let fb = new FrameBuffer(vpW, vpH);

let displayFunc;
try
{
    document;
    displayFunc = write2Canvas;

    const resizerEl = document.getElementById("resizer");
    const resizer = new ResizeObserver(write2Canvas);
    resizer.observe(resizerEl);

    setInterval(runOnline, 1000/25);
}
catch(e)
{
    displayFunc = write2File;
    runOffline();
}

function runOnline()
{
    updateNestedMatrices(sierTriangle);
    displayFunc();
}

function runOffline()
{
    for(let k = 0; k < 720; ++k)
    {
        displayFunc(format("SierpinskiMovie2Frame%04d.ppm", k));
        updateNestedMatrices(sierTriangle);
    }
}

function updateNestedMatrices(model)
{
    if(model.nestedModels.length != 0)
    {
        if(model.nestedModels[1].nestedModels.length != 0)
        {
            model.nestedModels[1].nestedModels[1].setMatrix(
                model.nestedModels[1].nestedModels[1].getMatrix().timesMatrix(Matrix.rotateZ( 0.5)));

            model.nestedModels[2].nestedModels[2].setMatrix(
                model.nestedModels[2].nestedModels[2].getMatrix().timesMatrix(Matrix.rotateZ(-0.5)));
        }

        for(const m of model.nestedModels)
            updateNestedMatrices(m);
    }
}

function write2Canvas()
{
    const res = document.getElementById("resizer");
    const w = res.offsetWidth;
    const h = res.offsetHeight;

    const ctx = document.getElementById("pixels").getContext("2d");

    ctx.canvas.width = w;
    ctx.canvas.height = h;
    
    fb = new FrameBuffer(w, h);
    renderFB1(scene, fb);

    ctx.putImageData(new ImageData(fb.pixelBuffer, w, h), 0, 0);
}

function write2File(fName)
{
    renderFB1(scene, fb);
    fb.dumpFB2File(fName);
    fb.clearFB();
}