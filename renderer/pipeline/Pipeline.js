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
import {Camera, Matrix, Model, OrthoNorm, PerspNorm, Position, Scene, Vector, Vertex, Primitive, LineSegment, Point} from "../scene/SceneExport.js";
import {check} from "../scene/util/UtilExport.js";
import {FrameBuffer, Viewport, Color} from "../framebuffer/FramebufferExport.js";
import {clip, M2V, NearClip, Project, rasterize, V2C, debugPosition, debugScene, logMessage, logVertexList, logColorList, logPrimitiveList, setDebugScene, setDebugPosition} from "./PipelineExport.js";

/**@type {Color} */ export var DEFAULT_COLOR = Color.white;

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

    const ctm2 = ctm.timesMatrix(position.getMatrix());

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

        logVertexList("0. Model    ", position.getModel());

        const model1 = M2V(position, ctm2);
        logVertexList("1. View      ", model1);

        const model2 = V2C(model1, scene.camera);
        logVertexList("2. Camera    ", model2);
        logColorList("2. Camera    ", model2);
        logPrimitiveList("2. Camera    ", model2);

        const model3 = NearClip(model2, scene.camera);
        logVertexList("3. NearClipped", model3);
        logColorList("3. NearClipped", model3);
        logPrimitiveList("3. NearClipped", model3);

        const model4 = Project(model3, scene.camera);
        logVertexList("4. Projected  ", model4);

        const model5 = clip(model4);
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
            renderPosition(scene, p, ctm2, vp);
        else
            logMessage("====== Hidden Position" + position.getName() + " =====");
    }
}