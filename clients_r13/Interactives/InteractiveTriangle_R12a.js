//@ts-check
import Color from "../../renderer/framebuffer/Color.js";
import {Scene, Position, Model, Vertex, LineSegment} from "../../renderer/scene/SceneExport.js";
import {setScene, scene, setShowCamera, setShowMatrix, setCameraZ, handleKeyDown, 
        handleKeyPress, display, setPrintHelpMessageFunc, printHelpMessage, 
        eyeX, eyeY, eyeZ} from "./InteractiveAbstractClient_R12a.js";

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

setScene(Scene.buildFromName("InteractiveTriangle_R12a"));
setCameraZ(1.0);
scene.camera.viewTranslate(eyeX, eyeY, eyeZ);

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

printHelpMessage();
