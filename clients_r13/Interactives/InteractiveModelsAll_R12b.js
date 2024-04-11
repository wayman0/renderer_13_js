//@ts-check

import {Scene, Position} from "../../renderer/scene/SceneExport.js";
import {make, setRandomColor} from "../../renderer/scene/util/UtilExport.js";
import {Axes2D, Axes3D, Box, Circle, CircleSector, Cone, ConeFrustum, ConeSector, Cube, Cube2, Cube3, Cube4, Cylinder, CylinderSector, Disk, DiskSector, Dodecahedron, Icosahedron, Icosidodecahedron, Octahedron, PanelXY, PanelXZ, PanelYZ, ParametricCurve, ParametricSurface, Pyramid, PyramidFrustum, Ring, RingSector, SierpinskiSponge, SierpinskiTriangle, Sphere, SphereSector, SphereSubdivided, Square, SquareGrid, SurfaceOfRevolution, Tetrahedron, Torus, TorusSector, TriangularPrism, TriangularPyramid, ViewFrustumModel} from "../../renderer/models_L/ModelsExport.js";
import {default as GRS} from "../../renderer/models_L/GRSModel.js";
import {default as OBJ} from "../../renderer/models_L/OBJModel.js";
import {currentModel, display, handleKeyDown, handleKeyPress, printHelpMessage, setCurrentModel, 
        setDebugWholeScene, setInteractiveModelsAllVis, setNumInteractiveMod, setScene, scene} from "./InteractiveAbstractClient_R12b.js";

const assets = "../../assets/";

setScene(Scene.buildFromName("InteractiveModelsAll_R12b"));

//2D models
scene.addPosition(Position.buildFromModel(new Square(1.0)));
scene.addPosition(Position.buildFromModel(new SquareGrid(1.0, 11, 15)));
scene.addPosition(Position.buildFromModel(new Circle(1.0, 16)));
scene.addPosition(Position.buildFromModel(new CircleSector(1, Math.PI/4, -Math.PI/4, 13)));
scene.addPosition(Position.buildFromModel(new CircleSector(1.0, -Math.PI/4, Math.PI/4, 5)));
scene.addPosition(Position.buildFromModel(new Disk(1.0, 4, 16)));
scene.addPosition(Position.buildFromModel(new DiskSector(1.0, Math.PI/2, 3*Math.PI/2, 4, 8)));
scene.addPosition(Position.buildFromModel(new Ring(1.0, 0.25, 3, 16)));
scene.addPosition(Position.buildFromModel(new RingSector(1.0, 0.25, Math.PI/2, 3*Math.PI/2, 3, 8)));

//fractals
scene.addPosition(Position.buildFromModelName(new SierpinskiTriangle(7), "Sierpinski Triangle"));
scene.addPosition(Position.buildFromModelName(new SierpinskiSponge(6), "Sierpinski Sponge"));

// cubes
scene.addPosition(Position.buildFromModel(new Box(1, 1, 1)));
scene.addPosition(Position.buildFromModel(new Cube()));
scene.addPosition(Position.buildFromModel(new Cube2(4, 5, 6)));
scene.addPosition(Position.buildFromModel(new Cube2(40, 50, 60)));
scene.addPosition(Position.buildFromModel(new Cube3(12, 14, 15)));
scene.addPosition(Position.buildFromModel(new Cube4(12, 14, 15)));

// polyhedron
scene.addPosition(Position.buildFromModel(new Tetrahedron()));
scene.addPosition(Position.buildFromModel(new Tetrahedron(20, 20, 40, 40)));
scene.addPosition(Position.buildFromModel(new Tetrahedron(30, 30, 30, 30)));
scene.addPosition(Position.buildFromModel(new Octahedron(30)));
scene.addPosition(Position.buildFromModel(new Octahedron(20, 20, 20)));
scene.addPosition(Position.buildFromModel(new Dodecahedron()));
scene.addPosition(Position.buildFromModel(new Icosahedron()));
scene.addPosition(Position.buildFromModel(new Icosidodecahedron()));

// pyramids
scene.addPosition(Position.buildFromModel(new Pyramid(2, 1, 5, 6)));
scene.addPosition(Position.buildFromModel(new PyramidFrustum(1, 2, .5, 4, 5)));
scene.addPosition(Position.buildFromModel(new PyramidFrustum(2, 1, .5, 4, 5)));
scene.addPosition(Position.buildFromModel(new TriangularPyramid(Math.sqrt(3)/Math.sqrt(2))));
scene.addPosition(Position.buildFromModel(new TriangularPyramid(1, 1, 7, 7)));
scene.addPosition(Position.buildFromModel(new TriangularPrism(.6, .6, .6, 3, true)));
scene.addPosition(Position.buildFromModel(new ViewFrustumModel()));

// cones
scene.addPosition(Position.buildFromModel(new Cone(1, 1, 10, 16)));
scene.addPosition(Position.buildFromModel(new ConeSector(1, 1, .5, 0, 2*Math.PI, 5, 16)));
scene.addPosition(Position.buildFromModel(new ConeSector(1, 1, .5, Math.PI/2, 3*Math.PI/2, 5, 8)));
scene.addPosition(Position.buildFromModel(new ConeFrustum(1, .5, .5, 6, 16)));
scene.addPosition(Position.buildFromModel(new ConeFrustum(.5, .5, 1, 6, 16)));

// cylinders
scene.addPosition(Position.buildFromModel(new Cylinder(.5, 1, 11, 12)));
scene.addPosition(Position.buildFromModel(new CylinderSector(.5, 1, Math.PI/2, 3*Math.PI/2, 11, 6)));

// spheres
scene.addPosition(Position.buildFromModel(new Sphere(1, 15, 12)));
scene.addPosition(Position.buildFromModel(make(new Sphere(1, 60, 60))));
scene.addPosition(Position.buildFromModel(make(new Sphere(1, 120, 120))));
scene.addPosition(Position.buildFromModel(new SphereSector(1, Math.PI/2, 3*Math.PI/2, Math.PI/4, 3*Math.PI/4, 7, 6)));
scene.addPosition(Position.buildFromModel(new SphereSubdivided(4)));
scene.addPosition(Position.buildFromModel(new SphereSubdivided(6, true, false)));
scene.addPosition(Position.buildFromModel(new SphereSubdivided(7, false, true)));

// torus
scene.addPosition(Position.buildFromModel(new Torus(.75, .25, 12, 16)));
scene.addPosition(Position.buildFromModel(make(new Torus(.75, .25, 120, 120))));
scene.addPosition(Position.buildFromModel(new TorusSector(.75, .25, Math.PI/2, 3*Math.PI/2, undefined, undefined, 12, 8)));
scene.addPosition(Position.buildFromModel(new TorusSector(.75, .25, 2*Math.PI, Math.PI, 2*Math.PI, undefined, 6, 16)));
scene.addPosition(Position.buildFromModel(new TorusSector(.75, .25, 0, 2*Math.PI, -Math.PI/2, Math.PI/2, 6, 16)));
scene.addPosition(Position.buildFromModel(new TorusSector(.75, .25, Math.PI/2, 3*Math.PI/2, -Math.PI/2, Math.PI/2, 6, 8)));

// model files
scene.addPosition(Position.buildFromModel(await GRS(assets + "grs/bronto.grs") ));
scene.addPosition(Position.buildFromModel(await OBJ(assets + "cow.obj") ));

// parametric curves and surfaces
scene.addPosition(Position.buildFromModel(new ParametricCurve()));
scene.addPosition(Position.buildFromModel(new ParametricSurface()));
scene.addPosition(Position.buildFromModel(new ParametricSurface(
                    (s, t) => {return s*Math.cos(t*Math.PI)}, 
                    (s, t) => {return t}, 
                    (s, t) => {return s*Math.sin(t*Math.PI)},
                    -1, 1, -1, 1, 49, 49)));
scene.addPosition(Position.buildFromModel(new ParametricSurface(
                    (u, v) => {return .3 * (1-u) * (3+Math.cos(v)) * Math.sin(4*Math.PI*u)}, 
                    (u, v) => {return .3 * (3*u+(1-u)*Math.sin(v))},
                    (u, v) => {return .3 * (1-u) * (3+Math.cos(v)) * Math.cos(4*Math.PI*u)},
                    0, 1, 0, 2*Math.PI, 49, 49)));
scene.addPosition(Position.buildFromModel(new SurfaceOfRevolution()));
scene.addPosition(Position.buildFromModel(new SurfaceOfRevolution(
                    (t) => {return .5 * (1+t*t)}, 
                    (t) => {return .5 * (1+t*t)}, 
                    (t) => {return .5 * (1+t*t)}, 
                    -1, 1, 30, 30)));
scene.addPosition(Position.buildFromModel(new SurfaceOfRevolution(
                    (t) => {return t}, 
                    (t) => {return 4*t*(1-t)}, 
                    undefined, 
                    0, 1, 30, 30)));

// coordinate axes
scene.addPosition(Position.buildFromModel(new Axes3D(1, 1, 1)));
scene.addPosition(Position.buildFromModel(new Axes2D(-1, 1, -1, 1, 8, 8)));
scene.addPosition(Position.buildFromModel(new PanelXY(-4, 4, -5, 5, -5)));
scene.addPosition(Position.buildFromModel(new PanelXZ(-1, 1, -6, 1, -.5)));
scene.addPosition(Position.buildFromModel(new PanelYZ(-1, 1, -6, 1, -.5)));

for(const p of scene.positionList)
    setRandomColor(p.model);

setNumInteractiveMod(scene.positionList.length);
for(const p of scene.positionList)
    p.visible = false;

setCurrentModel(0);
scene.getPosition(currentModel).visible = true;
setInteractiveModelsAllVis(false);
setDebugWholeScene(true);

document.addEventListener('keydown', handleKeyDown);
document.addEventListener("keypress", handleKeyPress);
const resizer = new ResizeObserver(display);
resizer.observe(document.getElementById("resizer"));
printHelpMessage();