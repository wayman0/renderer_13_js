//@ts-check
import {Scene, Position, Camera, Matrix, Model} from "../../renderer/scene/SceneExport.js";
import {SierpinskiTriangle} from '../../renderer/models_L/ModelsExport.js';
import {setColor} from "../../renderer/scene/util/ModelShading.js";
import {Color, FrameBuffer} from "../../renderer/framebuffer/FramebufferExport.js";
import {render1} from "../../renderer/pipeline/PipelineExport.js";

const cam = new Camera();
cam.projOrtho();

const scene = Scene.buildFromCameraName(cam, "SierpinskiMovie");

const sierpinskiTriangle = new SierpinskiTriangle(8);
setColor(sierpinskiTriangle.getNestedModel(0), Color.blue);
setColor(sierpinskiTriangle.getNestedModel(1), Color.red);
setColor(sierpinskiTriangle.getNestedModel(2), Color.magenta);

const topP = new Position(sierpinskiTriangle, Matrix.rotateZ(90), "top");
scene.addPosition(topP);

const resizer = new ResizeObserver(display);
resizer.observe(document.getElementById("resizer"));

const fps = 20;
setInterval( () => {
                        updateNestedMatrices(sierpinskiTriangle, true); 
                        display();
                    }, 1000/fps);

function display()
{
    const resizerEl = document.getElementById("resizer");
    const w = resizerEl.offsetWidth;
    const h = resizerEl.offsetHeight;

    const ctx = document.getElementById("pixels").getContext("2d");
    ctx.canvas.width = w;
    ctx.canvas.height = h;

    const fb = new FrameBuffer(w, h, Color.black);

    render1(scene, fb.vp);

    ctx.putImageData(new ImageData(fb.pixelBuffer, w, h), 0, 0);
}

/**
 * 
 * @param {Model} model 
 * @param {boolean} twoSubModel 
 */
function updateNestedMatrices(model, twoSubModel)
{
    if(model.nestedModels.length != 0)
    {
        if(twoSubModel)
        {
            const mat1 = model.getNestedModel(1).matrix.timesMatrix(Matrix.rotateZ(0.5));
            model.setNestedModel(1, model.getNestedModel(1).transform(mat1));

            const mat2 = model.getNestedModel(2).matrix.timesMatrix(Matrix.rotateZ(-0.5));
            model.setNestedModel(2, model.getNestedModel(2).transform(mat2));
        }
        else
        {
            const mat0 = model.getNestedModel(0).matrix.timesMatrix(Matrix.rotateZ(0.5));
            model.setNestedModel(0, model.getNestedModel(0).transform(mat0));
        }
    }

    for(const m of model.nestedModels)
        updateNestedMatrices(m, twoSubModel);
}