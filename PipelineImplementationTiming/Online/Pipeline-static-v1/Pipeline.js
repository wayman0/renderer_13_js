/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   This renderer takes as its input a {@link Scene} data structure
   and a {@link FrameBuffer.Viewport} within a {@link FrameBuffer}
   data structure. This renderer mutates the {@link FrameBuffer.Viewport}
   so that it is filled in with the rendered image of the geometric
   scene represented by the {@link Scene} object.
<p>
   This implements our eigth rendering pipeline. This renderer
   implements "hierarchical scenes" by recursively traversing the
   DAG of nested {@link Position}s below each of a {@link Scene}'s
   {@link Position} objects. As the renderer traverses deeper into
   the DAG of nested {@link Position}s, it accumulates a "current
   transformation matrix" that transforms each {@link Vertex} from a
   {@link Model}'s local coordinate system to the {@link Camera}'s
   (shared) view coordinate system. The recursive traversal of the
   scene's DAG is not a new pipeline stage, so there are still six
   pipeline stages.
*/

//@ts-check
import {Camera, Matrix, Model, OrthoNorm, PerspNorm, Position, Scene, Vector, Vertex, Primitive, LineSegment, Point} from "../../../renderer/scene/SceneExport.js";
import {check} from "../../../renderer/scene/util/UtilExport.js";
import {FrameBuffer, Viewport, Color} from "../../../renderer/framebuffer/FramebufferExport.js";
import {clip, M2V, NearClip, Project, rasterize, V2C, debugPosition, debugScene, logMessage, logVertexList, logColorList, logPrimitiveList, setDebugScene, setDebugPosition} from "./PipelineExport.js";

/**@type {Color} */ export var DEFAULT_COLOR = Color.white;

export var cam;
export var ctm2;
export var mod;

/**
 *  Mutate the {@link FrameBuffer}'s default {@link FrameBuffer.Viewport}
    so that it holds the rendered image of the {@link Scene} object.
 * @param {Scene} scene the scene to be rendererd
 * @param {FrameBuffer} fb the parent framebuffer of the viewport to have the scene rendered into
 */
export function renderFB(scene, fb)
{
    if (fb instanceof FrameBuffer == false)
        throw new Error("FB must be a framebuffer");

    render(scene, fb.vp);
}

export function renderFB2(scene, fb2)
{
    const fb = new FrameBuffer(fb2.width, fb2.height, fb2.bgColorFB);
    fb.setViewport(fb2.vp.width, fb2.vp.height, fb2.vp.upperLeftX, fb2.vp.upperLeftY);

    for(let x = 0; x < fb2.width; x += 1)
    {
        for(let y = 0; y < fb2.height; y += 1)
            fb.setPixelFB(x, y, fb2.getPixelFB(x, y));
    }

    render(scene, fb.vp);
}

/**
 *  Mutate the {@link FrameBuffer}'s default {@link FrameBuffer.Viewport}
    so that it holds the rendered image of the {@link Scene} object.

 * @param {Scene} scene the scene to be rendered
 * @param {Viewport} vp the viewport to recieve the rendered scene
 */
export function render(scene, vp)
{
    if (scene instanceof Scene == false)
        throw new Error("Scene must be a scene data type");

    if (vp instanceof Viewport == false)
        throw new Error("VP must be a Viewport data type");

    //TypeError: Assignment to constant variable.
    //debugScene = scene.debug;
    setDebugScene(scene.debug);

    logMessage("/n== Begin Renderering of Scene (Pipeline1): " + scene.name + " ==");

    for(const position of scene.positionList)
    {
        //TypeError: Assignment to constant variable.
        //debugPosition = position.debug;
        setDebugPosition(position.debug);

        if (position.visible)
            renderPosition(scene, position, Matrix.identity(), vp);
        else
            logMessage("==== Hidden Position: " + position.name);
    }

    logMessage("== End Rendering of Scene (Pipeline 1) == ");
}

/**
 *    Recursively renderer a {@link Position}.
      <p>
      This method does a pre-order, depth-first-traversal of the tree of
      {@link Position}'s rooted at the parameter {@code position}.
      <p>
      The pre-order "visit node" operation in this traversal first updates the
      "current transformation matrix", ({@code ctm}), using the {@link Matrix}
      in {@code position} and then renders the {@link Model} in {@code position}
      using the updated {@code ctm} in the {@link Model2View} stage.

 * @param {Scene} scene the scene undergoing rendering
 * @param {Position} position the current position to be recursively rendered
 * @param {Matrix} ctm the current model to view transformation
 * @param {Viewport} vp the viewport to receive the rendered scene
 */
function renderPosition(scene, position, ctm, vp)
{
    if (position.getModel() != null && position.getModel() != undefined)
        logMessage("==== Render Position: " + position.getName() + " ====");
    else
        logMessage("==== Render Position (no model) ====");

    logMessage("---- Transformation matrix:\n" + position.getMatrix());

    // this accumulates each 'equal level' position instead of only nested positions
    // due to it being a 'global' variable it never 'resets' itself to the upper lvl pos
    //ctm2 = ctm.timesMatrix(position.getMatrix());

    // this will use a non global variable to allow it to 'reset' itself to the upper lvl pos
    const locCTM2 = ctm.timesMatrix(position.getMatrix());
    // then set the global variable to be the local variable to allow it to follow the 
    // local variables 'resetting' of itself to be the upper lvl pos
    ctm2 = locCTM2;


    if (position.getModel() != null && position.getModel() != undefined && position.getModel().visible)
    {
        logMessage("====== Render model: " + position.getModel().name + " ======");

        check(position.getModel());

        if ( position.getModel().colorList.length == 0 &&
            !(position.getModel().vertexList.length == 0))
        {
            for(let i = 0; i < position.getModel().vertexList.length; ++i)
                position.getModel().addColor(DEFAULT_COLOR);

            console.log("***WARNING: Added default color to model: " + position.getModel().name + ".");
        }

        const model = position.getModel();
        logVertexList("0. Model    ", model);

        //const model1 = M2V(position, ctm2);        
        const model1 = new Model(model.vertexList.map(M2V),
                                 model.primitiveList,
                                 model.colorList,
                                 position.name + "::" + model.name,
                                 model.visible);
        logVertexList("1. View      ", model1);

        //const model2 = V2C(model1, scene.camera);
        cam = scene.camera;
        const model2 = new Model(model1.vertexList.map(V2C),
                                 model1.primitiveList,
                                 model1.colorList,
                                 model1.name,
                                 model1.visible);

        logVertexList("2. Camera    ", model2);
        logColorList("2. Camera    ", model2);
        logPrimitiveList("2. Camera    ", model2);

        //const model3 = NearClip(model2, scene.camera);
        mod = model2;
        const model3 = new Model(model2.vertexList, 
                                 model2.primitiveList.map(NearClip).filter( (p) => {return p != undefined && p != null}),
                                 Array.from(model2.colorList),
                                 model2.name,
                                 model2.visible);

        logVertexList("3. NearClipped", model3);
        logColorList("3. NearClipped", model3);
        logPrimitiveList("3. NearClipped", model3);

        //const model4 = Project(model3, scene.camera);
        const model4 = new Model(model3.vertexList.map(Project),
                                 model3.primitiveList, 
                                 model3.colorList, 
                                 model3.name, 
                                 model3.visible);
        logVertexList("4. Projected  ", model4);

        //const model5 = clip(model4);
        mod = model4;
        const model5 = new Model(model4.vertexList, 
                                 model4.primitiveList.map(clip).filter( (p) => {return p != undefined && p != null}),
                                 Array.from(model4.colorList), 
                                 model4.name, 
                                 model4.visible);

        logVertexList("5. Clipped    ", model5);
        logColorList("5. Clipped    ", model5);
        logPrimitiveList("5. Clipped    ", model5);

        rasterize(model5, vp);
        logMessage("====== End Model: " + position.getModel().getName() + " =====");
    }
    else
    {
        if (position.getModel() != null && position.getModel() != undefined)
            logMessage("===== Hidden model: " + position.getModel().getName() + "======");
        else
            logMessage("====== Missing model ======");
    }

    for(const p of position.nestedPositions)
    {
        if (p.visible)
            renderPosition(scene, p, locCTM2, vp);
        else
            logMessage("====== Hidden Position" + position.getName() + " =====");
    }
}