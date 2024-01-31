import * as Models from "./renderer/models_L/ModelsExport.js";
import {default as GRS} from "./renderer/models_L/GRSModel.js";
import {default as OBJ} from "./renderer/models_L/OBJModel.js";

export const sphereCursor = new Models.Sphere(.1, 10, 10);
export const modArr = 
[
    // 2D models
    new Models.Disk(1.0, 4, 16),                     // 1
    new Models.Ring(1.0, 0.25, 3, 16),               // 2
    new Models.BarycentricTriangle(5, 4),           // 3
    // cubes
    new Models.Cube2(4, 5, 6),                       // 4
    new Models.Cube2(40, 50, 60),                    // 5
    new Models.Cube3(12, 14, 15),                    // 6
    new Models.Cube4(12, 14, 15),                    // 7
    // polyhedra
    new Models.Tetrahedron(30, 30, 30, 30),          // 8
    new Models.Octahedron(30),                       // 9
    new Models.Octahedron(20, 20, 20),               // 10
    new Models.Dodecahedron(),                       // 11
    new Models.Icosahedron(),                        // 12
    new Models.Icosidodecahedron(),                  // 13
    // pyramids
    new Models.Pyramid(2.0, 1.0, 5, 6),              // 14
    new Models.PyramidFrustum(2.0, 1.0, 0.5, 4, 5),  // 15
    new Models.TriangularPyramid(1.0, 1.0, 7, 7),    // 16
    // cones
    new Models.Cone(1.0, 1.0, 10, 16),               // 17
    new Models.ConeFrustum(1.0, 0.5, 0.5, 6, 16),    // 18
    // cylinder
    new Models.Cylinder(0.5, 1.0, 11, 12),           // 19
    // spheres
    new Models.Sphere(1.0, 15, 12),                  // 20
    new Models.SphereSubdivided(4),                  // 21
    new Models.SphereSubdivided(6, true, false),     // 22
    new Models.SphereSubdivided(7, false, true),     // 23
    // torus
    new Models.Torus(0.75, 0.25, 12, 16),            // 24
    new Models.TorusSector(0.75, 0.25, 0, 2*Math.PI, Math.PI, 2*Math.PI, 6, 16), // 25
    // model files
    new GRS("./assets/grs/bronto.grs"),           // 26
    new OBJ("./assets/cow.obj"),            // 27
    new OBJ("./assets/cessna.obj"),         // 28
    new OBJ("./assets/apple.obj"),          // 29
    new OBJ("./assets/teapot.obj"),         // 30
    new OBJ("./assets/stanford_bunny.obj"), // 31
    // parametric curves and surfaces
    new Models.ParametricCurve(),                                       // 32
    new Models.ParametricSurface(),                                     // 33
    new Models.ParametricSurface(                                       // 34
              (s,t) => {return s*Math.cos(t*Math.PI)},
              (s,t) => {return t},
              (s,t) => {return s*Math.sin(t*Math.PI)},
              -1, 1, -1, 1, 49, 49),
    new Models.ParametricSurface(                                       // 35
              (u,v) => {return 0.3*(1-u)*(3+Math.cos(v))*Math.sin(4*Math.PI*u)},
              (u,v) => {return 0.3*(3*u+(1-u)*Math.sin(v))},
              (u,v) => {return 0.3*(1-u)*(3+Math.cos(v))*Math.cos(4*Math.PI*u)},
              0, 1, 0, 2*Math.PI, 49, 49),
    new Models.SurfaceOfRevolution(),                                   // 36
    new Models.SurfaceOfRevolution(                                     // 37
              (t) => {return 0.5*(1+t*t)}, undefined, undefined, -1, 1, 30, 30),
    new Models.SurfaceOfRevolution(                                     // 38
              (t) => {return t}, 
              (t) => {return 4*t*(1-t)}, 
              undefined, 0, 1, 30, 30),
    // panels
    new Models.PanelXY(-4, 4, -4, 4),                                   // 39
    new Models.PanelXZ(-4, 4, -8, 0),                                   // 40
    new Models.PanelYZ(-4, 4, -8, 0)                                    // 41
]
