/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import {TriangularPrism, Cylinder, ConeFrustum, Octahedron, Box, ParametricCurve, Cone, Tetrahedron, Sphere, Axes3D, PanelXZ} from "../renderer/models_L/ModelsExport.js";
// @ts-ignore
import {Scene, Position, Matrix, Camera, Model, Vertex, Primitive, LineSegment} from "../renderer/scene/SceneExport.js";
import * as ModelShading from "../renderer/scene/util/UtilExport.js";
import {FrameBuffer, Color} from "../renderer/framebuffer/FramebufferExport.js";
import {LineClip, renderFB, setDebugScene} from "../renderer/pipeline/PipelineExport.js";
    
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
      position[i][j].matrix2Identity()
                 .mult( Matrix.translate(0, -3, -10) )
                 .mult( Matrix.translate(-4+4*j, 0, 6-3*i) )
   }
}

import * as interactiveUtilites from "./InteractiveAbstractClient_R10.js";

interactiveUtilites.setScene(scene);
interactiveUtilites.setAspectRatio(2);
interactiveUtilites.setFOVY(90);
interactiveUtilites.setNear(1);

const resizer = new ResizeObserver(interactiveUtilites.windowResized);
resizer.observe(document.getElementById("resizer"));

document.addEventListener('keypress', keyPressed);
function keyPressed(event)
{   
    interactiveUtilites.handleKeyInput(event);
}

interactiveUtilites.setUpViewing();