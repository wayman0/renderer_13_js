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

const vpW = 800;
const vpH = 800;
const fb = new FrameBuffer(vpW, vpH);

const angle = 1;

let sierTriangle = new SierpinskiTriangle(8);
ModelShading.setColor(sierTriangle.nestedModels[0], Color.blue);
ModelShading.setColor(sierTriangle.nestedModels[1], Color.red);
ModelShading.setColor(sierTriangle.nestedModels[2], Color.magenta);

topP.setModel(sierTriangle);

for(let k = 0; k < 120; ++k)
{
    fb.clearFB(Color.black);
    renderFB1(scene, fb);
    fb.dumpFB2File(format("0 SierpinskiMovieFrame %04d.ppm", k));

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
   fb.clearFB(Color.black);
   renderFB1(scene, fb);
   fb.dumpFB2File(format("1 SierpinskiMovieFrame %04d.ppm", 120+k));

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
   fb.clearFB(Color.black);
   renderFB1(scene, fb);
   fb.dumpFB2File(format("2 SierpinskiMovieFrame %04d.ppm", 360+k));

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
   fb.clearFB(Color.black);
   renderFB1(scene, fb);
   fb.dumpFB2File(format("3 SierpinskiMovieFrame %04d.ppm", 600+k));

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



