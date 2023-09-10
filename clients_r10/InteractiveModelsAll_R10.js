/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import {Scene, Position, Matrix} from "../renderer/scene/SceneExport.js";
import {make} from "../renderer/scene/util/UtilExport.js";
import * as Shapes from "../renderer/models_L/ModelsExport.js";
import * as ModelShading from "../renderer/scene/util/UtilExport.js";
import {FrameBuffer, Color} from "../renderer/framebuffer/FramebufferExport.js";
import {renderFB} from "../renderer/pipeline/PipelineExport.js";
import {format} from "../renderer/scene/util/UtilExport.js";

const scene = Scene.buildFromName("InteractiveModelsAll_R10");
// Instantiate at least one of every Model class.
// 2D models
scene.addPosition(new Position(new Shapes.Square(1.0)));
scene.addPosition(new Position(new Shapes.SquareGrid(1.0, 11, 15)));
scene.addPosition(new Position(new Shapes.Circle(1.0, 16)));
scene.addPosition(new Position(new Shapes.CircleSector(1.0,  Math.PI/4, -Math.PI/4, 13)));
scene.addPosition(new Position(new Shapes.CircleSector(1.0, -Math.PI/4,  Math.PI/4,  5)));
scene.addPosition(new Position(new Shapes.Disk(1.0, 4, 16)));
scene.addPosition(new Position(new Shapes.DiskSector(1.0, Math.PI/2, 3*Math.PI/2, 4, 8)));
scene.addPosition(new Position(new Shapes.Ring(1.0, 0.25, 3, 16)));
scene.addPosition(new Position(new Shapes.RingSector(1.0, 0.25, Math.PI/2, 3*Math.PI/2, 3, 8)));
// cubes
scene.addPosition(new Position(new Shapes.Box(1.0, 1.0, 1.0)));
scene.addPosition(new Position(new Shapes.Cube("Cube")));
scene.addPosition(new Position(new Shapes.Cube2(4, 5, 6)));
scene.addPosition(new Position(new Shapes.Cube2(4, 5, 6)));
scene.addPosition(new Position(new Shapes.Cube2(4, 5, 6)));
scene.addPosition(new Position(new Shapes.Cube2(4, 5, 6)));
scene.addPosition(new Position(new Shapes.Cube2(40, 50, 60)));
scene.addPosition(new Position(new Shapes.Cube3(12, 14, 15)));
scene.addPosition(new Position(new Shapes.Cube4(12, 14, 15)));

// polyhedra
scene.addPosition(new Position(new Shapes.Tetrahedron()));
scene.addPosition(new Position(new Shapes.Tetrahedron(20, 40)));
scene.addPosition(new Position(new Shapes.Octahedron(1)));
scene.addPosition(new Position(new Shapes.Octahedron(20, 20, 20, 20, 20, 20)));
//scene.addPosition(new Position(Shapes.Octahedron.buildMeshOctahedron(20, 20, 20, 20, 20, 20)));
scene.addPosition(new Position(new Shapes.Icosahedron()));
scene.addPosition(new Position(new Shapes.Dodecahedron()));
// pyramids
scene.addPosition(new Position(new Shapes.Pyramid(2.0, 1.0, 5, 6)));
scene.addPosition(new Position(new Shapes.PyramidFrustum(2.0, 1.0, 0.5, 4, 5)));
scene.addPosition(new Position(new Shapes.PyramidFrustum(1.0, 2.0, 0.5, 4, 5)));
scene.addPosition(new Position(new Shapes.TriangularPyramid(Math.sqrt(3)/Math.sqrt(2))));
scene.addPosition(new Position(new Shapes.TriangularPyramid(1.0, 1.0, 7, 7)));
scene.addPosition(new Position(new Shapes.TriangularPrism(0.6, 0.5, 0.5, 3, true)));
scene.addPosition(new Position(new Shapes.ViewFrustumModel()));
//scene.addPosition(new Position(new Shapes.ViewFrustum()));


// cones
scene.addPosition(new Position(new Shapes.Cone(1.0, 1.0, 10, 16)));
scene.addPosition(new Position(new Shapes.ConeSector(1.0, 1.0, 0.5, 0, 2*Math.PI, 5, 16)));
scene.addPosition(new Position(new Shapes.ConeSector(1.0, 1.0, 0.5, Math.PI/2, 3*Math.PI/2, 5, 8)));
scene.addPosition(new Position(new Shapes.ConeFrustum(1.0, 0.5, 0.5, 6, 16)));
scene.addPosition(new Position(new Shapes.ConeFrustum(0.5, 1.0, 0.5, 6, 16)));
// cylinders
scene.addPosition(new Position(new Shapes.Cylinder(0.5, 1.0, 11, 12)));
scene.addPosition(new Position(new Shapes.CylinderSector(0.5, 1.0, Math.PI/2, 3*Math.PI/2, 11, 6)));
// spheres
scene.addPosition(new Position(new Shapes.Sphere(1.0, 15, 12)));
scene.addPosition(new Position(make(new Shapes.Sphere(1.0, 60, 60))));
scene.addPosition(new Position(make(new Shapes.Sphere(1.0, 120, 120))));
scene.addPosition(new Position(new Shapes.SphereSector(1.0, Math.PI/2, 3*Math.PI/2, Math.PI/4, 3*Math.PI/4, 7, 6)));
scene.addPosition(new Position(new Shapes.SphereSubdivided(4)));
scene.addPosition(new Position(new Shapes.SphereSubdivided(6, true, false)));
scene.addPosition(new Position(new Shapes.SphereSubdivided(7, false, true)));
// torus
scene.addPosition(new Position(new Shapes.Torus(0.75, 0.25, 12, 16)));
scene.addPosition(new Position(make(new Shapes.Torus(0.75, 0.25, 120, 120))));
scene.addPosition(new Position(new Shapes.TorusSector(0.75, 0.25, Math.PI/2, 3*Math.PI/2, 12, 8)));
scene.addPosition(new Position(new Shapes.TorusSector(0.75, 0.25, 0, 2*Math.PI, Math.PI, 2*Math.PI, 6, 16)));
scene.addPosition(new Position(new Shapes.TorusSector(0.75, 0.25, 0, 2*Math.PI, -Math.PI/2, Math.PI/2, 6, 16)));
scene.addPosition(new Position(new Shapes.TorusSector(0.75, 0.25, Math.PI/2, 3*Math.PI/2, -Math.PI/2, Math.PI/2, 6, 8)));

// Give each model a random color.
for(const p of scene.positionList)
{
  ModelShading.setRandomColor( p.getModel() );
  p.visible = false;
}

//                                                 x  x   y  y   z
scene.addPosition(new Position(new Shapes.PanelXY(-5, 5, -5, 5, -5)));// back wall
//                                                 y  y   z  z   x
scene.addPosition(new Position(new Shapes.PanelYZ(-5, 5, -5, 5, -5)));// left wall
scene.addPosition(new Position(new Shapes.PanelYZ(-5, 5, -5, 5, +5)));// right wall
//                                                 x  x   z  z  y
scene.addPosition(new Position(new Shapes.PanelXZ(-5, 5, -5, 5, -5)));// floor
scene.addPosition(new Position(new Shapes.PanelXZ(-5, 5, -5, 5, +5)));// ceiling

const length = scene.positionList.length;
ModelShading.setColor(scene.getPosition(length - 5).getModel(), new Color(50, 50, 50));// back wall
ModelShading.setColor(scene.getPosition(length - 4).getModel(), new Color(50, 50, 50));// left wall
ModelShading.setColor(scene.getPosition(length - 3).getModel(), new Color(50, 50, 50));// right wall
ModelShading.setColor(scene.getPosition(length - 2).getModel(), new Color(50, 50, 50));// floor
ModelShading.setColor(scene.getPosition(length - 1).getModel(), new Color(50, 50, 50));// ceiling

scene.getCamera().projPerspective(-3, 3, -3, 3, 1);
const fb = new FrameBuffer(1024, 1024);
renderFB(scene, fb);
fb.dumpFB2File("InteractiveModelsAll_R10.ppm");

for(let x = 0; x < scene.positionList.length-5; x += 1)
{
  const p = scene.getPosition(x);
  p.visible = true;

  for(let rot = 0; rot <= 360; rot += 1)
  {
    fb.clearFBDefault();
    p.setMatrix(Matrix.translate(0, 0, -3)
                      .mult(Matrix.rotateX(rot))
                      .mult(Matrix.rotateY(rot)));

    renderFB(scene, fb);
    fb.dumpFB2File(format("InteractiveModelsAll_R10_Pos%2d_Frame_%3d.ppm", x, rot));
    fb.clearFB(fb.bgColorFB);
  }

  p.visible = false;
}
