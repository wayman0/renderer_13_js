//@ts-check

import {Scene, Position, Matrix, Model, LineSegment, Vertex} from "../../renderer/scene/SceneExport.js";
import {Color} from "../../renderer/framebuffer/FramebufferExport.js";
import {setScene, printHelpMessage, display, handleKeyInput, setUpViewing, setShowCamera, setShowMatrix} from "./InteractiveAbstractClient_R11.js";

const scene = Scene.buildFromName("InteractiveCube_R11");
const model = Model.buildName("cube");
scene.addPosition(Position.buildFromModel(model));

model.addVertex(new Vertex(0.0, 0.0, 0.0), 
                new Vertex(1.0, 0.0, 0.0), 
                new Vertex(1.0, 0.0, 1.0), 
                new Vertex(0.0, 0.0, 1.0), 

                new Vertex(0.0, 1.0, 0.0), 
                new Vertex(1.0, 1.0, 0.0), 
                new Vertex(1.0, 1.0, 1.0), 
                new Vertex(0.0, 1.0, 1.0));

model.addColor( new Color(255, 0, 0), 
                new Color(0, 255, 0), 
                new Color(0, 0, 255));

model.addPrimitive (LineSegment.buildVertexColor(0, 1, 0), 
                    LineSegment.buildVertexColor(1, 2, 0),
                    LineSegment.buildVertexColor(2, 3, 0),
                    LineSegment.buildVertexColor(3, 0, 0),
                    LineSegment.buildVertexColor(4, 5, 1),
                    LineSegment.buildVertexColor(5, 6, 1),
                    LineSegment.buildVertexColor(6, 7, 1),
                    LineSegment.buildVertexColor(7, 4, 1),
                    LineSegment.buildVertexColor(0, 4, 2),
                    LineSegment.buildVertexColor(1, 5, 2),
                    LineSegment.buildVertexColor(2, 6, 2),
                    LineSegment.buildVertexColor(3, 7, 2));

document.addEventListener("keydown", handleKeyInput);
const resizerEl = document.getElementById("resizer");
const resizer = new ResizeObserver(display);
resizer.observe(resizerEl);

setScene(scene);
printHelpMessage();
setShowCamera(true);
setShowMatrix(true);
setUpViewing();
display();

