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
import {Camera, Matrix, Model, OrthoNorm, PerspNorm, Position, 
        Scene, Vector, Vertex, Primitive, LineSegment, Point} from "../../renderer/scene/SceneExport.js";
import {check} from "../../renderer/scene/util/UtilExport.js";
import {FrameBuffer, Viewport, Color} from "../../renderer/framebuffer/FramebufferExport.js";
import {clipNestedModel as clip, model2worldNestedModel as M2W, world2viewNestedModel as W2V, 
        NearClipNestedModel as NearClip, projectNestedModel as Project, rasterizeNestedModel as rasterize, 
        view2cameraNestedModel as V2C, debugPosition, debugScene, 
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
        renderModel(scene, position.getModel(), ctm2, vp);
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

    logMessage("==== End position: " + position.name + " ====");
}

/**
 * Recursively render a {@link Model}
 * 
 * <p>
 * This method does a pre-order, depth-first-traversal of the tree of
 * {@link Model}'s rooted at the parameter {@code model}.
 * <p>
 * The pre-order "visit node" operation in this traversal first updates the
 * "current transformation matrix", ({@code ctm}), using the {@link Matrix}
 * in {@code model} and then renders the geometry in {@code model}
 * using the updated {@code ctm} in the {@link Model2View} stage.
 *
 * @param {Scene} scene the {@link Scene} that we are rendering
 * @param {Model} model the curren {@link Model} object to recursively render
 * @param {Matrix} ctm the current model to view transformation {@link Matrix}
 * @param {Viewport} vp the {@link Viewport} to hold the rendered image of the {@link Scene}
 */
function renderModel(scene, model, ctm, vp)
{
    logMessage("====== Render Model: " + model.name + " ======");
    check(model);
    
    // Mostly for compatibility with renderers 1 through 3.
    if (   model.colorList.length == 0 && model.vertexList.length != 0)
    {
        for (let i = 0; i < model.vertexList.length; ++i)
            model.addColor( DEFAULT_COLOR );

        console.log("***WARNING: Added default color to model: " + model.name + ".");
    }

    logVertexList("0. Model        ", model);

    // Update the current model-to-world transformation matrix.
    const ctm2 = ctm.timesMatrix( model.matrix );

    // 1. Apply the current model-to-world coordinate transformation.
    const model1 = M2W(model, ctm2);
    logVertexList("1. World        ", model1);

    // 2. Apply the Camera's world-to-view coordinate transformation.
    const model2 = W2V(model1, scene.camera);
    logVertexList("2. View         ", model2);

    // 3. Apply the Camera's normalizing view-to-camera coordinate transformation.
    const model3 = V2C(model2, scene.camera);
    logVertexList("3. Camera       ", model3);
    logColorList("3. Camera       ", model3);
    logPrimitiveList("3. Camera       ", model3);

    // 4. Clip primitives to the camera's near plane.
    const model4 = NearClip(model3, scene.camera);
    logVertexList("4. Near_Clipped", model4);
    logColorList("4. Near_Clipped", model4);
    logPrimitiveList("4. Near_Clipped", model4);

    // 5. Apply the Camera's projection transformation.
    const model5 = Project(model4, scene.camera);
    logVertexList("5. Projected   ", model5);

    // 6. Clip primitives to the camera's view rectangle.
    const model6 = clip(model5);
    logVertexList("6. Clipped     ", model6);
    logColorList("6. Clipped     ", model6);
    logPrimitiveList("6. Clipped     ", model6);

    // 7. Rasterize every visible primitive into pixels.
    rasterize(model6, vp);

    logMessage("====== End Model: " + model.name + " ======");
}