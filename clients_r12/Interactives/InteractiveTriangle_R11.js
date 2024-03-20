//@ts-check
import Color from "../../renderer/framebuffer/Color.js";
import {Scene, Position, Model, Vertex, LineSegment} from "../../renderer/scene/SceneExport.js";
import { setRandomColor } from "../../renderer/scene/util/ModelShading.js";
import {setScene, scene, setShowCamera, setShowMatrix, setCameraZ, handleKeyDown, 
        handleKeyPress, display, setPrintHelpMessageFunc, printHelpMessage} from "./InteractiveAbstractClient_R11.js";

/**
<pre>{@code
                  y       |
                  |       |
                  |       |
                  | v[1]  |
                1 +       |   /
                  |       |  /
                  |       | /
                  |       |/
                  |    -1 +--------------- image plane
                  |      /
                  |     /
                  |    /
                  |   /
                  |  /
                  | /
                  |/                v[0]
             v[2] +-----------------+------> x
                 /0                 1
                /
               /
              /
           1 +
            /
           z
}</pre>
   Render a wireframe triangle. This is just about the
   simplest possible model. It is useful for debugging.
*/

setScene(Scene.buildFromName("InteractiveTriangle_R11"));
setCameraZ(1.0);

const model = Model.buildName("triangle");
scene.addPosition(Position.buildFromModel(model));

model.addVertex(new Vertex(1.0, 0.0, 0.0),
                new Vertex(0.0, 1.0, 0.0),
                new Vertex(0.0, 0.0, 0.0));

model.addColor(Color.red, Color.green, Color.blue);
model.addPrimitive( LineSegment.buildVertexColors(0, 1, 0, 1),
                    LineSegment.buildVertexColors(1, 2, 1, 2), 
                    LineSegment.buildVertexColors(2, 0, 2, 0));

setShowCamera(true);
setShowMatrix(true);

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keypress", handleKeyPress);
const resizer = new ResizeObserver(display);
resizer.observe(document.getElementById('resizer'));

setPrintHelpMessageFunc(newHelpMessage);
printHelpMessage();

function newHelpMessage()
{
    console.log("Use the 'd/D' keys to toggle debugging information on and off.");
    console.log("Use the 'i' key to get information about the triangle model.");
    console.log("Use the '1' and '2' keys to switch between the two renderers.");
    console.log("Use the 'p' key to toggle between parallel and orthographic projection.");
    console.log("Use the x/X, y/Y, z/Z, keys to translate the triangle along the x, y, z axes.");
    console.log("Use the u/U, v/V, w/W, keys to rotate the triangle around the x, y, z axes.");
    console.log("Use the s/S keys to scale the size of the triangle.");
    console.log("Use the 'm' key to toggle the display of triangle's matrix.");
    console.log("Use the '=' key to reset the triangle's matrix.");
    console.log("Use the 'c' key to change the random solid triangle color.");
    console.log("Use the 'C' key to randomly change triangle's colors.");
    console.log("Use the 'e' key to change the random solid edge colors.");
    console.log("Use the 'E' key to change the random edge colors.");
    console.log("Use the 'Alt-e' key combination to change the random vertex colors.");
    console.log("Use the 'a' key to toggle anti-aliasing on and off.");
    console.log("Use the 'g' key to toggle gamma correction on and off.");
    console.log("Use the 'b' key to toggle near plane clipping on and off.");
    console.log("Use the n/N keys to move the camera's near plane.");
    console.log("Use the f/F keys to change the camera's field-of-view (keep AR constant.");
    console.log("Use the r/R keys to change the camera's aspect ratio (keep fov constant).");
    console.log("Use the 'l' key to toggle letterboxing viewport on and off.");
    console.log("Use the arrow keys to translate the camera location left/right/up/down.");
    console.log("Use CTRL arrow keys to translate the camera forward/backward.");
    console.log("Use the 'M' key to toggle showing the Camera data.");
    console.log("Use the '*' key to show window data.");
    console.log("Use the 'P' key to convert the triangle to a point cloud.");
    console.log("Use the 'h' key to redisplay this help message.");
}