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
import {clipPosition as Clip, model2worldPosition as M2W, world2viewPosition as W2V, 
        NearClipPosition as NearClip, projectPosition as Project, rasterizePosition as rasterize, 
        view2cameraPosition as V2C, debugPosition, debugScene, 
        logMessage, logVertexList, logColorList, logPrimitiveList, setDebugScene, setDebugPosition} from "./PipelineExport.js";

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

    setDebugScene(scene.debug);

    logMessage("/n== Begin Renderering of Scene (Pipeline1): " + scene.name + " ==");

    for(const position of scene.positionList)
    {
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
        const m2wPos = M2W(position, ctm2);
        const w2vPos = W2V(m2wPos, scene.camera);
        const v2cPos = V2C(w2vPos, scene.camera);
        const nearPos = NearClip(v2cPos, scene.camera);
        const projPos = Project(nearPos, scene.camera);
        const clipPos = Clip(projPos);

        rasterize(clipPos, vp);
    }    
    else
    {
        if (position.getModel() != null && position.getModel() != undefined)
            logMessage("===== Hidden model: " + position.getModel().getName() + "======");
        else
            logMessage("====== Missing model ======");
    }

    logMessage("==== End position: " + position.name + " ====");
}
