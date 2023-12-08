//Import what is necessary for your code
import {Scene, Position, Matrix, Model, Vertex, LineSegment} from "./renderer/scene/SceneExport.js";
import {renderFB, setDoAntiAliasing, doAntiAliasing, setDoGamma, doGamma} from "./renderer/pipeline/PipelineExport.js";
import {FrameBuffer, Viewport, Color} from "./renderer/framebuffer/FramebufferExport.js";
import {Sphere} from "./renderer/models_L/ModelsExport.js";
import * as ModelShading from "./renderer/scene/util/UtilExport.js";

//Create a default sphere from the Models import
const sphereMod = new Sphere();
//Set the sphere to be a random color using the Model Shading import
ModelShading.setRandomColor(sphereMod);

//Create a position to hold the model
const spherePos = Position.buildFromModel(sphereMod);
//Set the position to be translated back 3 units
spherePos.setMatrix(Matrix.translate(0, 0, -3));

//Create an empy scene
const scene = new Scene();
//Add the sphere position to the scene
scene.addPosition(spherePos);

//Create timer to hold the timerID returned by the setInterval() function
let timer = null;
displayNextFrame();

//The function that sets the timer to the timerID returned by setInterval
//and will contiuously call rotate() and then display() at a rate of 50fps
function displayNextFrame()
{
    timer = setInterval( () => 
            {
                rotate();
                display();
            }, 1000/50);//50 fps;
}

//Create a variable to store the rotations for the sphere
let rot = 0;
//The function that actually rotates the sphere along its y axis
function rotate()
{
    // rotate the sphere along its y axis by 1 more degree;
    spherePos.getMatrix().mult(Matrix.rotateY(1));

    /*
    could also do:

    // reset the sphere matrix to be translated back 3 units and then rotated along its y axis by rot;
    spherePos.setMatrix(
                Matrix.translate(0, 0, -3);
                .mult(Matrix.rotateY(rot)));

    // increment the amount to rotate the sphere by for the next frame;
    rot = rot%360 + 1;
    */
}

//Create a resize observer that calls display ;
//and set it to observe the resizer html element;
//This allows the canvas to be redrawn when it is resized
const resizerEl = document.getElementById("resizer");
const resizer = new ResizeObserver(display);
resizer.observe(resizerEl);
//The function that is responsible for rendering the scene into the fb ;
//and that then redraws the canvas to be the fb
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

    //Create a framebuffer to be the size of the resizer/canvas and render the scene into it
    const fb = new FrameBuffer(w, h, Color.black);
    renderFB(scene, fb);

    // could also do;
    //render(scene, fb.vp);

    //write the framebuffer to the canvas
    ctx.putImageData(new ImageData(fb.pixelBuffer, fb.width, fb.height), fb.vp.vp_ul_x, fb.vp.vp_ul_y);
}

//Add a key listener to the document to allow the animation to be started/stopped
let play = true;
document.addEventListener("keypress", keyPressed);
function keyPressed(keyEvent)
{
    const c = keyEvent.key;

    if(c == 's' && !play)// if the animation isn't playing and the 's' key is pressed start the animation;
    {
        displayNextFrame();
        play = !play;
    }
    else if(c == 'S' && play) // if the animation is playing and the 'S' key is pressed stop the animation;
    {
        clearInterval(timer);
        play = !play;
    }
}