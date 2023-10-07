/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import {TriangularPrism, Cylinder, ConeFrustum, Octahedron, Box, ParametricCurve, Cone, Tetrahedron, Sphere, Axes3D, PanelXZ} from "../renderer/models_L/ModelsExport.js";
// @ts-ignore
import {Scene, Position, Matrix, Camera} from "../renderer/scene/SceneExport.js";
import * as ModelShading from "../renderer/scene/util/UtilExport.js";
import {FrameBuffer, Color} from "../renderer/framebuffer/FramebufferExport.js";
import {renderFB} from "../renderer/pipeline/PipelineExport.js";
import { buildScene } from "./Geometries_R9a.js";

/*
// Create the Scene object that we shall render.
const scene = Scene.buildFromName("Geometries_online_R8");

// Create a two-dimensional array of Positions holding Models.
const position = new Array(3);
for(let i = 0; i < 3; i += 1)
    position[i] = new Array(3);

// row 0 (first row in first image)
position[0][0] = Position.buildFromModel(new TriangularPrism(1.0, 1.0, 10, 30));
ModelShading.setColor(position[0][0].getModel(), Color.green);

position[0][1] = Position.buildFromModel(new Cylinder(0.5, 1.0, 30, 30));
ModelShading.setColor(position[0][1].getModel(), Color.blue);

position[0][2] = Position.buildFromModel(new ConeFrustum(0.5, 1.0, 1.0, 10, 10));
ModelShading.setColor(position[0][2].getModel(), Color.orange);

// row 1
position[1][0] = Position.buildFromModel(new Octahedron(2, 2, 2, 2, 2, 2));
//position[1][0] = Position.buildFromModel(Octahedron.buildMeshOctahedron(2, 2, 2, 2, 2, 2));
ModelShading.setColor(position[1][0].getModel(), Color.green);

position[1][1] = Position.buildFromModel(new Box(1.0, 1.0, 1.0));
ModelShading.setRandomPrimitiveColor(position[1][1].getModel());

position[1][2] = Position.buildFromModel(
        new ParametricCurve(
                    (t) => {return 0.3*(Math.sin(t) + 2*Math.sin(2*t)) + 0.1*Math.sin(t/6)},
                    (t) => {return 0.3*(Math.cos(t) - 2*Math.cos(2*t)) + 0.1*Math.sin(t/6)},
                    (t) => {return 0.3*(-Math.sin(3*t))},
                    0, 6*Math.PI, 120));
ModelShading.setRandomPrimitiveColor(position[1][2].getModel());

// row 2
position[2][0] = Position.buildFromModel(new Cone(0.5, 1.0, 30, 30));
ModelShading.setColor(position[2][0].getModel(), Color.yellow);

position[2][1] = Position.buildFromModel(new Tetrahedron(12, 12));
ModelShading.setColor(position[2][1].getModel(), Color.green);

position[2][2] = Position.buildFromModel(new Sphere(1.0, 30, 30));
ModelShading.setColor(position[2][2].getModel(), Color.cyan);

// Create x, y and z axes
const xyzAxes = Position.buildFromModel(new Axes3D(6, -6, 6, 0, 7, -7, Color.red));

// Create a horizontal coordinate plane model.
const xzPlane = Position.buildFromModel(new PanelXZ(-6, 6, -7, 7));
ModelShading.setColor(xzPlane.getModel(), Color.Gray);

// Add the positions (and their models) to the Scene.
scene.addPosition(xzPlane); // draw the grid first
scene.addPosition(xyzAxes); // draw the axes on top of the grid

xzPlane.setMatrix(Matrix.translate(0, -3, -10));
xyzAxes.setMatrix(Matrix.translate(0, -3, -10));

for (let i = position.length - 1;  i >= 0; --i) // from back to front
{
   for (let j = 0; j < position[i].length; ++j)
   {
      scene.addPosition(position[i][j]);
   }
}
*/

const scene = buildScene();
const xzPlane = scene.positionList[0];
const xyzAxes = scene.positionList[1];

// use math.sqrt to make the array a 'square'
const posRows = Math.sqrt(scene.positionList.length-2);
const posCols = posRows;

const position = new Array(posRows);
for(let x = 0; x < posRows; x += 1)
   position[x] = new Array(posCols);

for(let i = 0; i < posRows; i += 1)
   for(let j = 0; j < posCols; j += 1)
      position[i][j] = scene.positionList[posCols * i + j + 2];

const  fov    = 90.0;
const  aspect = 2.0;
const  near2   = 1.0;
scene.getCamera().projPerspectiveFOVY(fov, aspect, near2);

/*
// Create a framebuffer to render our scene into.
let vp_width  = 1800;
let vp_height =  900;
let fb = new FrameBuffer(vp_width, vp_height);

printHelp();
setScene(scene);
setFB(fb);
display();

// should be able to import keypressed function from abstract client
document.addEventListener("keypress", keyPressed);

let resizer = new ResizeObserver(display);
//@ts-ignore
resizer.observe(document.getElementById("resizer"));
*/

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
    // both of these are before fb and vp modifications
    // with rotate models
    // fps = 1000/5    roughly 150 to 200 wall clock time
    // fps = 1000/500  roughly 150 to 200 wall clock time
    // fps = 1000/1000 roughly 150 to 200 wall clock time

    // without rotate models, so we can see how long display on its own takes
    // fps = 1000/5    roughly 200 ish, wall clock time
    // fps = 1000/100  roughly 150 to 200 wall clock time
    // fps = 1000/500  roughly 150ish wall clock time
    // fps = 1000/1000 roughly 150ish wall clock time

    // fps = 10        roughly 150 to 200 wall clock time

    // after fb and vp modifications
    // with rotate models
    // fps = 1000/5     roughly around 100

    // after clearFB redone
    // with rotate models roughtly 20 to 30 wall clock time
    // so fps should be around 50
    timer = setInterval(function() 
    {
        const startTime = new Date().getTime();
        rotateModels();
        display();
        const stopTime = new Date().getTime();
        console.log("Wall-clock time: " + (stopTime-startTime));
    }, 1000/50);
}

// the old way of writing each element to the data array was 44ish

/* 
the whole timing for each aspect of this function is:
Getting the resizer time: 0
Geometries_online_R9a.js:174 Get pixels: 0
Geometries_online_R9a.js:180 set canvas dimenstions: 0
Geometries_online_R9a.js:187 make fb: 139
Geometries_online_R9a.js:195 Rendering time: 5
Geometries_online_R9a.js:215 Writing to canvas time: 0
Geometries_online_R9a.js:218 whole function: 144
Geometries_online_R9a.js:146 Wall-clock time: 144

we need to make writing to the framebuffer faster 
because each initialization is slow
what if when we make a fb we get rid of 
 'this.clearFB(this.#bgColorFB);'
so that each time the framebuffer is created is faster
since we aren't writing to every pixel in it when it is
created
and rendering is fast, only around 5ish

with the clearFB code in constructor commented out
run time is:
Getting the resizer time: 0
Geometries_online_R9a.js:193 Get pixels: 0
Geometries_online_R9a.js:199 set canvas dimenstions: 0
Geometries_online_R9a.js:206 make fb: 132
Geometries_online_R9a.js:214 Rendering time: 9
Geometries_online_R9a.js:225 Writing to canvas time: 0
Geometries_online_R9a.js:228 whole function: 141
Geometries_online_R9a.js:146 Wall-clock time: 141

when clearFB is commented out why is make fb so long still?
because when we create the vp, it writes every pixel in fb
into the vp

is there a way to avoid writing pixels into a vp upon creation?

inside fb constructor we call vp.buildParent()
which calls vp constructor which calls vp.clearVP()
and then after vp.clearVP() is called
buildParent writes all fb pixels into vp, 
seems a little counter intuitive, can we get rid of 
 'vp.clearVP' like in fb?

run time with no fb.clearFB in constructor
and not vp.clearVP in constructor
Getting the resizer time: 0
Geometries_online_R9a.js:219 Get pixels: 0
Geometries_online_R9a.js:225 set canvas dimenstions: 0
Geometries_online_R9a.js:232 make fb: 94
Geometries_online_R9a.js:240 Rendering time: 5
Geometries_online_R9a.js:251 Writing to canvas time: 1
Geometries_online_R9a.js:254 whole function: 101
Geometries_online_R9a.js:146 Wall-clock time: 101
made it faster but we lost the background color
becase it is never written in vp or fb

can we make clearing the fb and clearing vp faster?

maybe instead of trying to write each rgba value
just create a new Uint8clampedarray() 
with a default value say 255, so all
rgba values will be 255 which is white
so that wouldn't work unless we want white background
the problem is that a has to be 255 in order
for the color to show up decently but black is 0 for the
rgb values and what happens when bgColor isn't the
same value for rgb 

what if we compressed each rgba into one 4 byte integer
and made color use the compressed rgba 4 byte integer implementation
then instead of writing size * 4 we only write size times
but then we have to uncompress before writing to the canvas
and writing to canvas takes around 44 ish 
if we save more than 44ish by compressing then
compressing would be worth it because then we would
just write the fb into a new uint8array

since writing to fb with no fb and vp code commented out is 140 ish
we write 2 times to each rgba element which means each clear call
takes around 70ish, if we divide this by 4 becase we are making 1 call
per color instead of 4 we get around 20ish 
so we save around 20ish per call to clearFB and or clearVP
since each one of those is called 1 time per initialization
we save 40ish and cost of writing to data is 40ish so we don't save
any time 

we could try every time we call clear fb make a new empty array
and then use the spread operator keep adding the color to be added
instead of calling write pixel size times but we would need a for 
loop to loop through and 'spread' each pixel into the fb
see page 157 for spread 

or we could try for every time clear fb is called make a new empty array
and use push() to keep adding the same color, but we need a loop for this
because we need to push for each pixel in the fb
see page 161 and 162

what if we just dont clear both vp and fb but only one?
when we make a fb it sets is pixelBuffer to be one color
then instantiates its vp to be the whole fb, clears using the
vp default color, so it rewrites the fb pixelBuffer to be 
the vp's default color, but the vp's default color in the fb 
constructor is the fb default color so we could get rid of one of these
but which one? 
if we get rid of the fbs clearFB call the whole fb will
be cleared due to creating a vp to be the whole fb and the vp clearing
the fb's pixelBuffer using the fb's default color, and when a vp
is created on its own it will still set itself to be its own default
color which may not be the framebuffers default color.
if we get rid of the vps clearVP call the fb will be cleared
create a vp, let the vp be whatever color the fb is, this won't
work if the vp needs to be a different color say dark gray and the
fb is supposed to be black. Also if we get rid of this call then when
we make just a viewport it wont be set and the user will have to call
clearvp itself so either way clearVP gets called, so this won't work

running display() with fb.clearFB() commented out and the 
redundant double for loop in vp.buildParent commented out
Getting the resizer time: 0
Geometries_online_R9a.js:297 Get pixels: 0
Geometries_online_R9a.js:303 set canvas dimenstions: 0
Geometries_online_R9a.js:310 make fb: 42
Geometries_online_R9a.js:318 Rendering time: 5
Geometries_online_R9a.js:329 Writing to canvas time: 0
Geometries_online_R9a.js:332 whole function: 48
Geometries_online_R9a.js:146 Wall-clock time: 48

I don't think we can take out any more code from fb or vp
without any major complications so this is probably as fast
as the fb and vp classes will become

with write fb redone and clearvp commented out but clearfb used:
Getting the resizer time: 0
Geometries_online_R9a.js:316 Get pixels: 0
Geometries_online_R9a.js:324 set canvas dimenstions: 0
Geometries_online_R9a.js:333 make fb: 2
Geometries_online_R9a.js:343 Rendering time: 14
Geometries_online_R9a.js:356 Writing to canvas time: 0
Geometries_online_R9a.js:359 whole function: 16
Geometries_online_R9a.js:151 Wall-clock time: 16
*/
function display()
{
    let funcStartTime = new Date().getTime();
    
    // geting the resizer time is 0
    let resStartTime = new Date().getTime();

    const resizer = document.getElementById("resizer");
    const w = resizer?.offsetWidth;
    const h = resizer?.offsetHeight;
    
    let resEndTime = new Date().getTime();
    console.log("Getting the resizer time: " + (resEndTime - resStartTime));


    // this takes about 1 
    let pixStartTime = new Date().getTime();

    // @ts-ignore
    const ctx = document.getElementById("pixels").getContext("2d");
    if (ctx == null)
    {
       console.log("cn.getContext(2d) is null");
       return;
    }
    
    let pixEndTime = new Date().getTime();
    console.log("Get pixels: " + (pixEndTime - pixStartTime));

    let setCanStartTime = new Date().getTime();
    
    ctx.canvas.width = w;
    ctx.canvas.height = h;
    
    let setCanEndTime = new Date().getTime();
    console.log("set canvas dimenstions: " + (setCanEndTime - setCanStartTime));


    let makeFBStartTime = new Date().getTime();
    
    // @ts-ignore
    const fb = new FrameBuffer(w, h);
    
    let makeFBEndTime = new Date().getTime();
    console.log("make fb: " + (makeFBEndTime-makeFBStartTime));

    // rendering time is around 5, 
    // i don't think we can shrink this time down any

    let rendStartTime = new Date().getTime();
    
    renderFB(scene, fb);
    
    let rendEndTime = new Date().getTime();
    console.log("Rendering time: " + (rendEndTime - rendStartTime));

    // this is the code from the other r9
    // it appears to run about 2 times as fast but is still not perfectly smooth
    // wall clock time is around 150 ish
    // instead of 400 ish with copying data

    // the time to for this is around 0 to 1
    let writeStartTime = new Date().getTime();
    
    ctx.putImageData(new ImageData(fb.pixelBuffer,fb.width, fb.height), fb.vp.vp_ul_x, fb.vp.vp_ul_y);
    
    let writeEndTime = new Date().getTime();
    console.log("Writing to canvas time: " + (writeEndTime - writeStartTime));

    let funcEndTime = new Date().getTime();
    console.log("whole function: " + (funcEndTime - funcStartTime));
}


function rotateModels()
{
   // Place the xz-plane model in front of the camera
   // and rotate the plane.
   xzPlane.matrix2Identity()
          .mult( Matrix.translate(0, -3, -10) )
          .mult( Matrix.rotateY(k) );

   // Place the xyz-axes model in front of the camera
   // and rotate the axes.
   xyzAxes.matrix2Identity()
          .mult( Matrix.translate(0, -3, -10) )
          .mult( Matrix.rotateY(k) );

   // Place each model where it belongs in the rotated xz-plane
   // and also rotate each model on its own axis.
   for (let i = 0; i < position.length; ++i)
   {
      for (let j = 0; j < position[i].length; ++j)
      {
         // Push the model away from the camera.
         // Rotate the plane of the models.
         // Place the model where it belongs in the rotated plane.
         // Then rotate the model on its own axis.
         position[i][j].matrix2Identity()
                 .mult( Matrix.translate(0, -3, -10) )
                 .mult( Matrix.rotateY(k) )
                 .mult( Matrix.translate(-4+4*j, 0, 6-3*i) )
                 .mult( Matrix.rotateX(3*k) )
                 .mult( Matrix.rotateY(3*k) );
      }
   }

    if(k === 360) 
        k = 0; 
    else 
        k++;
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
