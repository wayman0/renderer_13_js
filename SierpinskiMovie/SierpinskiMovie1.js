//@ts-check
import {Scene, Position, Matrix} from "../renderer/scene/SceneExport.js";
import {SierpinskiTriangle} from "../renderer/models_L/ModelsExport.js";
import * as ModelShading from "../renderer/scene/util/ModelShading.js";
import {Color, FrameBuffer} from "../renderer/framebuffer/FramebufferExport.js";
import {renderFB1} from "../renderer/pipeline/PipelineExport.js";
import { format } from "../renderer/scene/util/StringFormat.js";

const scene = Scene.buildFromName("SierpinskiMovie");
scene.getCamera().projOrtho(-1, 1, -1, 1);

const topP = Position.buildFromName("top");
scene.addPosition(topP);
topP.getMatrix().mult(Matrix.rotateZ(90));

const angle = 1;

const vpW = 800;
const vpH = 800;
let fb = new FrameBuffer(vpW, vpH);

let displayFunc;
try
{
    document;
    displayFunc = write2Canvas;

    const resizeEl = document.getElementById("resizer");
    const resizer = new ResizeObserver(write2Canvas);
    resizer.observe(resizeEl);

    setInterval(run, 1000/25);
}
catch(e)
{
    displayFunc = write2File;
    run();
}

function run()
{
    let sierTriangle = new SierpinskiTriangle(8);
    ModelShading.setColor(sierTriangle.nestedModels[0], Color.blue);
    ModelShading.setColor(sierTriangle.nestedModels[1], Color.red);
    ModelShading.setColor(sierTriangle.nestedModels[2], Color.magenta);

    topP.setModel(sierTriangle);

    for(let k = 0; k < 120; ++k)
    {
        displayFunc(format("0-SierpinskiMovie1Frame%04d.ppm", k));
        updateNestedMatrices1(sierTriangle, angle);
    }

    // Create a new Model object.
    sierTriangle = new SierpinskiTriangle(8);
    ModelShading.setColor(sierTriangle.nestedModels[0], Color.blue);
    ModelShading.setColor(sierTriangle.nestedModels[1], Color.red);
    ModelShading.setColor(sierTriangle.nestedModels[2], Color.magenta);

    topP.setModel(sierTriangle);

    for(let k = 0; k < 240; ++k)
    {
        displayFunc(format("1-SierpinskiMovie1Frame%04d.ppm", 120+k));
        updateNestedMatrices2(sierTriangle, angle);
    }

    // Create a new Model object.
    sierTriangle = new SierpinskiTriangle(8);
    ModelShading.setColor(sierTriangle.nestedModels[0], Color.blue);
    ModelShading.setColor(sierTriangle.nestedModels[1], Color.red);
    ModelShading.setColor(sierTriangle.nestedModels[2], Color.magenta);

    topP.setModel( sierTriangle );
    for (let k = 0; k < 240; ++k)
    {
        displayFunc(format("2-SierpinskiMovie1Frame%04d.ppm", 360+k));
        updateNestedMatrices4(sierTriangle, angle);
    }

    // Create a new Model object.
    sierTriangle = new SierpinskiTriangle(8);
    ModelShading.setColor(sierTriangle.nestedModels[0], Color.blue);
    ModelShading.setColor(sierTriangle.nestedModels[1], Color.red);
    ModelShading.setColor(sierTriangle.nestedModels[2], Color.magenta);

    topP.setModel( sierTriangle );

    for (let k = 0; k < 360; ++k)
    {
        displayFunc(format("3-SierpinskiMovie1Frame%04d.ppm", 600+k));
        updateNestedMatrices3(sierTriangle, angle);
    }

    function updateNestedMatrices1(model, angle)
    {
        if (model.nestedModels.length != 0)
        {
            model.nestedModels[0].setMatrix( model.nestedModels[0].getMatrix().timesMatrix(Matrix.rotateZ(angle)) );
            model.nestedModels[1].setMatrix( model.nestedModels[1].getMatrix().timesMatrix(Matrix.rotateZ(angle)) );
            model.nestedModels[2].setMatrix( model.nestedModels[2].getMatrix().timesMatrix(Matrix.rotateZ(angle)) );

            for(const m of model.nestedModels)
               updateNestedMatrices1(m, angle);
        }
    }

    function updateNestedMatrices2(model, angle)
    {
        if(model.nestedModels.length != 0)
        {
            model.nestedModels[0].setMatrix( model.nestedModels[0].getMatrix().timesMatrix(Matrix.rotateZ(angle)) );
            for(const m of model.nestedModels)
                updateNestedMatrices2(m, angle);
        }
    }

    function updateNestedMatrices3(model, angle)
    {
        if(model.nestedModels.length != 0)
        {
            model.nestedModels[1].setMatrix( model.nestedModels[1].getMatrix().timesMatrix(Matrix.rotateZ( angle)) );
            model.nestedModels[2].setMatrix( model.nestedModels[2].getMatrix().timesMatrix(Matrix.rotateZ(-angle)) );

            for(const m of model.nestedModels)
                updateNestedMatrices3(m, angle);
        }
    }

    function updateNestedMatrices4(model, angle)
    {
        if(model.nestedModels.length != 0)
        {
            model.nestedModels[1].setMatrix( model.nestedModels[1].getMatrix().timesMatrix(Matrix.rotateZ(-angle)) );
            model.nestedModels[2].setMatrix( model.nestedModels[2].getMatrix().timesMatrix(Matrix.rotateZ(-angle)) );

            for(const m of model.nestedModels)
                updateNestedMatrices4(m, angle);
        }
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

