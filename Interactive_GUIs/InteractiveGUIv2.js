//@ts-check

import {Scene, Position, Matrix, Model} from ".././renderer/scene/SceneExport.js";
import { FrameBuffer, Color } from ".././renderer/framebuffer/FramebufferExport.js";
import { render, renderFB } from ".././renderer/pipeline/PipelineExport.js";
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

const scenes = [new Scene(), new Scene(), new Scene(), new Scene()];
let currentScene = 0;
let currentAxis = 2;

const modInd = [6, 26, 32, 23];
const colInd = [6, 4, 5, 7];
const modVis = [true, true, true, true];

for(let index = 0; index < scenes.length; index += 1)
    scenes[index].addPosition(Position.buildFromModel(modArr[modInd[index]]));
scenes[currentScene].addPosition(Position.buildFromModel(sphereCursor));

ModelShading.setColor(scenes[0].getPosition(0).getModel(), Color.orange);
ModelShading.setColor(scenes[1].getPosition(0).getModel(), Color.green);
ModelShading.setColor(scenes[2].getPosition(0).getModel(), Color.blue);
ModelShading.setColor(scenes[3].getPosition(0).getModel(), Color.cyan);
ModelShading.setColor(sphereCursor, Color.red);

scenes[0].getPosition(0).setMatrix(Matrix.translate(0, 0, -3));
scenes[1].getPosition(0).setMatrix(Matrix.translate(0, 0, -3));
scenes[2].getPosition(0).setMatrix(Matrix.translate(0, 0, -3));
scenes[3].getPosition(0).setMatrix(Matrix.translate(0, 0, -3));
scenes[currentScene].getPosition(1).setMatrix(scenes[currentScene].getPosition(0).getMatrix());


modelList.selectedIndex = modInd[currentScene];
colorList.selectedIndex = colInd[currentScene];
axisList.selectedIndex  = currentAxis;

display();

function handleModelList(e)
{
    const modelSelected = modelList.selectedIndex;
    scenes[currentScene].getPosition(0).setModel(modArr[modelSelected]);

    handleColorList();

    modInd[currentScene] = modelSelected;
    
    updateGui();

    display();
}

function handleColorList(e)
{
    let colorSelected = colorList.selectedIndex;
    if(colorSelected == 0)
        ModelShading.setRandomColor(scenes[currentScene].getPosition(0).getModel());
    else if(colorSelected == 1)
        ModelShading.setRandomVertexColor(scenes[currentScene].getPosition(0).getModel());
    else if(colorSelected == 2)
        ModelShading.setRandomPrimitiveColor(scenes[currentScene].getPosition(0).getModel());
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

        ModelShading.setColor(scenes[currentScene].getPosition(0).getModel(), color);
    }

    colInd[currentScene] = colorSelected;

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
    // remove the cursor 
    scenes[currentScene].positionList.length = 1;

    if(e.target == modInv[0])
        currentScene = 0;
    else if(e.target == modInv[1])
        currentScene = 1;
    else if(e.target == modInv[2])
        currentScene = 2;
    else if(e.target == modInv[3])
        currentScene = 3;

    modVis[currentScene] = !modInv[currentScene].checked;
    scenes[currentScene].addPosition(Position.buildFromModel(sphereCursor));

    updateGui();

    display();
}

function handleModelSelected(e)
{
    // remove the cursor position
    scenes[currentScene].positionList.length = 1;

    if(e.target == modSel[0])
        currentScene = 0;
    else if(e.target == modSel[1])
        currentScene = 1;
    else if(e.target == modSel[2])
        currentScene = 2;
    else if(e.target == modSel[3])
        currentScene = 3;
    
    scenes[currentScene].addPosition(Position.buildFromModel(sphereCursor));
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

    scenes[currentScene].getPosition(0).getMatrix().mult(transMatrix);
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

    scenes[currentScene].getPosition(0).getMatrix().mult(transMatrix);
}

function updateGui()
{
    scenes[currentScene].getPosition(1).setMatrix(scenes[currentScene].getPosition(0).getMatrix());
    modelList.selectedIndex = modInd[currentScene];
    colorList.selectedIndex = colInd[currentScene];
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
        scenes[index].getPosition(0).getModel().visible = modVis[index];

    //Create a framebuffer to be the size of the resizer/canvas and render the scene into it
    const fb = new FrameBuffer(w, h);
    const vpW = w/2;
    const vpH = h/2;

    fb.setViewport(vpW, vpH, 0, 0);
    render(scenes[0], fb.vp);

    fb.setViewport(vpW, vpH, vpW, 0);
    render(scenes[1], fb.vp);

    fb.setViewport(vpW, vpH, 0, vpH);
    render(scenes[2], fb.vp);

    fb.setViewport(vpW, vpH, vpW, vpH);
    render(scenes[3], fb.vp);

    ctx.putImageData(new ImageData(fb.pixelBuffer, fb.width, fb.height), 0, 0);
}
