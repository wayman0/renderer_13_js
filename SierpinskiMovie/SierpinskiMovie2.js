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

const vpW = 1024;
const vpH = 1024;
const fb = new FrameBuffer(vpW, vpH);

const angle = 1;

let sierTriangle = new SierpinskiTriangle(8);
ModelShading.setColor(sierTriangle.nestedModels[0], Color.blue);
ModelShading.setColor(sierTriangle.nestedModels[1], Color.red);
ModelShading.setColor(sierTriangle.nestedModels[2], Color.magenta);

topP.setModel(sierTriangle);

for(let k = 0; k < 72; ++k)
{
    fb.clearFB(Color.black);
    renderFB1(scene, fb);
    fb.dumpFB2File(format("SierpinskiMovie2Frame %04d.ppm", k));

    updateNestedMatrices(sierTriangle);
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