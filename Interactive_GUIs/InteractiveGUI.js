//@ts-check

import {Scene, Position, Matrix} from ".././renderer/scene/SceneExport.js";
import { FrameBuffer, Color } from ".././renderer/framebuffer/FramebufferExport.js";
import { renderFB1 as renderFB } from ".././renderer/pipeline/PipelineExport.js";
import * as ModelShading from ".././renderer/scene/util/ModelShading.js";
import {modArr, sphereCursor} from "./ModelList.js";

const modelList = document.getElementById("ModelTypeList");
const colorList = document.getElementById("ModelColorList");
const axisList  = document.getElementById("ModelAxisList");

const modInv  = document.getElementsByClassName("modInv"); 
const modSel  = document.getElementsByClassName("modSel");
const modMove = document.getElementsByClassName("modMove");

const resizerEl = document.getElementById("resizer");
const resizer = new ResizeObserver(display);
resizer.observe(resizerEl);

modelList.onchange = handleModelList;
colorList.onchange = handleColorList;
axisList.onchange = handleAxisList;

for(const checkBox of modInv)
    checkBox.addEventListener("click", handleModelInvisible);

for(const button of modSel)
    button?.addEventListener("click", handleModelSelected);

for(const button of modMove)
    button?.addEventListener("click", handleIncrDecr);

const scene = new Scene();
let currentModel = 0;
let currentAxis = 2;

const modInd = [6, 26, 32, 23];
const colInd = [6, 4, 5, 7];
const modVis = [true, true, true, true];

for(const index of modInd)
    scene.addPosition(Position.buildFromModel(modArr[index]));
scene.addPosition(Position.buildFromModel(sphereCursor));

ModelShading.setColor(scene.getPosition(0).getModel(), Color.orange);
ModelShading.setColor(scene.getPosition(1).getModel(), Color.green);
ModelShading.setColor(scene.getPosition(2).getModel(), Color.blue);
ModelShading.setColor(scene.getPosition(3).getModel(), Color.cyan);
ModelShading.setColor(scene.getPosition(4).getModel(), Color.red);

scene.getPosition(0).setMatrix(Matrix.translate(-1.5,  1.5, -3));
scene.getPosition(1).setMatrix(Matrix.translate( 1.5,  1.5, -3));
scene.getPosition(2).setMatrix(Matrix.translate(-1.5, -1.5, -3));
scene.getPosition(3).setMatrix(Matrix.translate( 1.5, -1.5, -3));
scene.getPosition(4).setMatrix(scene.getPosition(currentModel).getMatrix());

modelList.selectedIndex = modInd[currentModel];
colorList.selectedIndex = colInd[currentModel];
axisList.selectedIndex  = currentAxis;

display();

function handleModelList(e)
{
    const modelSelected = modelList.selectedIndex;
    scene.getPosition(currentModel).setModel(modArr[modelSelected]);

    handleColorList();

    modInd[currentModel] = modelSelected;
    
    updateGui();

    display();
}

function handleColorList(e)
{
    let colorSelected = colorList.selectedIndex;
    if(colorSelected == 0)
        ModelShading.setRandomColor(scene.getPosition(currentModel).getModel());
    else if(colorSelected == 1)
        ModelShading.setRandomVertexColor(scene.getPosition(currentModel).getModel());
    else if(colorSelected == 2)
        ModelShading.setRandomPrimitiveColor(scene.getPosition(currentModel).getModel());
    else
    {
        let color = Color.white;

        if(colorSelected == 3)
            color = Color.red;
        else if(colorSelected == 4)
            color = Color.green;
        else if(colorSelected == 5)
            color = Color.blue;
        else if(colorSelected == 6)
            color = Color.orange;
        else if(colorSelected == 7)
            color = Color.cyan;
        else if(colorSelected == 8)
            color = Color.magenta;

        ModelShading.setColor(scene.getPosition(currentModel).getModel(), color);
    }

    colInd[currentModel] = colorSelected;

    display();
}

function handleAxisList(e)
{
    if(axisList.selectedIndex == 0)
        currentAxis = 0;
    else if(axisList.selectedIndex == 1)
        currentAxis = 1;
    else if(axisList.selectedIndex == 2)
        currentAxis = 2;
}

function handleModelInvisible(e)
{
    if(e.target == modInv[0])
        currentModel = 0;
    else if(e.target == modInv[1])
        currentModel = 1;
    else if(e.target == modInv[2])
        currentModel = 2;
    else if(e.target == modInv[3])
        currentModel = 3;

    modVis[currentModel] = !modInv[currentModel].checked;
    
    updateGui();

    display();
}

function handleModelSelected(e)
{
    if(e.target == modSel[0])
        currentModel = 0;
    else if(e.target == modSel[1])
        currentModel = 1;
    else if(e.target == modSel[2])
        currentModel = 2;
    else if(e.target == modSel[3])
        currentModel = 3;
    
    updateGui();

    display();
}

function handleIncrDecr(e)
{
    if(e.target == modMove[0])
        decreaseTranslation();
    else if(e.target == modMove[1])
        increaseTranslation();

    display();
}

function increaseTranslation()
{
    let transMatrix = Matrix.identity();
    if(currentAxis == 0)
        transMatrix = Matrix.translate(.1, 0, 0);
    else if(currentAxis == 1)
        transMatrix = Matrix.translate(0, .1, 0);
    else if(currentAxis == 2)
        transMatrix = Matrix.translate(0, 0, .1);

    scene.getPosition(currentModel).getMatrix().mult(transMatrix);
}

function decreaseTranslation()
{
    let transMatrix = Matrix.identity();
    if(currentAxis == 0)
        transMatrix = Matrix.translate(-.1, 0, 0);
    else if(currentAxis == 1)
        transMatrix = Matrix.translate(0, -.1, 0);
    else if(currentAxis == 2)
        transMatrix = Matrix.translate(0, 0, -.1);

    scene.getPosition(currentModel).getMatrix().mult(transMatrix);
}

function updateGui()
{
    scene.getPosition(4).setMatrix(scene.getPosition(currentModel).getMatrix());
    modelList.selectedIndex = modInd[currentModel];
    colorList.selectedIndex = colInd[currentModel];
}

function display()
{
    //get the width and height of the resizer
    const w = resizerEl.offsetWidth;
    const h = resizerEl.offsetHeight;

    const ctx = document.getElementById("pixels").getContext("2d");
    if(ctx == null)
    {    
        console.log("Warning: ctx.getContext(2d) is null");
        return;
    }

    //Set the canvas to be the size of the resizer
    ctx.canvas.width = w;
    ctx.canvas.height = h;

    for(let index = 0; index < modVis.length; index += 1)
        scene.getPosition(index).getModel().visible = modVis[index];

    //Create a framebuffer to be the size of the resizer/canvas and render the scene into it
    const fb = new FrameBuffer(w, h, Color.black);
    renderFB(scene, fb);

    // could also do;
    //render(scene, fb.vp);
    //write the framebuffer to the canvas
    ctx.putImageData(new ImageData(fb.pixelBuffer, fb.width, fb.height), fb.vp.vp_ul_x, fb.vp.vp_ul_y);
}
