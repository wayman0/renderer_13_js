//@ts-check

/**
 * Renderer 11. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
 */

import {Matrix, Position, Scene} from "../scene/SceneExport.js";
import {FrameBuffer, Viewport, Color} from "../framebuffer/FramebufferExport.js";
import {clipPosition as clip, model2worldPosition as M2W, world2viewPosition as W2V, 
        NearClipPosition as NearClip, projectPosition as Project, rasterizePosition as rasterize, 
        view2cameraPosition as V2C, debugPosition, debugScene, 
        logMessage, logVertexList, logColorList, logPrimitiveList, setDebugScene, setDebugPosition} from "./PipelineExport.js";

/**
   This renderer takes as its input a {@link Scene} data structure
   and a {@link FrameBuffer.Viewport} within a {@link FrameBuffer}
   data structure. This renderer mutates the {@link FrameBuffer.Viewport}
   so that it is filled in with the rendered image of the geometric
   scene represented by the {@link Scene} object.
<p>
   This implements our ninth rendering pipeline. This renderer
   implements "hierarchical models" by recursively traversing the
   DAG of nested {@link Model}s below each {@link Model} (while
   also traversing the {@link Scene}'s forest of {@link Position}
   objects). As the renderer traverses deeper into the DAG of
   {@link Model} objects (each nested below a parent {@link Model}
    object), it accumulates a "current transformation matrix" that
    transforms a {@link Vertex} from its {@link Model}'s local
    coordinate system to the {@link Camera}'s (shared) view
    coordinate system. The recursive traversal of a {@link Model}'s
    sub {@link Model}s is not a new pipeline stage, so there are
    still seven pipeline stages.
 */

// mostly for compatibility with renderers 1 through 3
/**@type {Color} the default color */ export let DEFAULT_COLOR = Color.white;

// Make all the intermediate Scene objects
// available for special effects processing.
/**@type {Scene} */export let scene1;
/**@type {Scene} */export let scene2;
/**@type {Scene} */export let scene3;
/**@type {Scene} */export let scene4;
/**@type {Scene} */export let scene5;
/**@type {Scene} */export let scene6;

/**
 *  Mutate the {@link FrameBuffer}'s default {@link Viewport}
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
 * Mutate the {@link FrameBuffer}'s given {@link FrameBuffer.Viewport}
 * so that it holds the rendered image of the {@link Scene} object.

 * @param {Scene} scene the object to render
 * @param {Viewport} vp the {@link Viewport} to hold rendered image
 */
export function render(scene, vp)
{
    setDebugScene(scene.debug);
    
    logMessage("\n= Begin Rendering of Scene (Pipeline 2): " + scene.name + " =")
    logMessage("- Current Camera:\n" + scene.camera);

    scene1 = Scene.buildFromCameraName(scene.camera, scene.name);

    logMessage("== 1. Begin model-to-world transformation of Scene ====");
    for(const pos of scene.positionList)
    {
        setDebugPosition(pos.debug);

        if(pos.visible)
            scene1.addPosition((M2W(pos, Matrix.identity())));
        else
            logMessage("==== 1. Hidden Position: " + pos.name + " ====");
    }
    logMessage("== 1. End model-to-world transformation of Scene ====");

    scene2 = Scene.buildFromCameraName(scene.camera, scene.name);
    logMessage("== 2. Begin world-to-view transformation of Scene ====");
    for(const pos of scene1.positionList)
        scene2.addPosition(W2V(pos, scene.camera));
    logMessage("== 2. End world-to-view transformation of Scene ====");

    scene3 = Scene.buildFromCameraName(scene.camera, scene.name);
    logMessage("== 3. Begin view-to-camera transformation of Scene ====");
    for(const pos of scene2.positionList)
        scene3.addPosition(V2C(pos, scene.camera));
    logMessage("== 3. End view-to-camera transformation of SCene ====");

    scene4 = Scene.buildFromCameraName(scene.camera, scene.name);
    logMessage("== 4. Begin newar-plane clipping of Scene ====");
    for(const pos of scene3.positionList)
        scene4.addPosition(NearClip(pos, scene.camera));
    logMessage("== 4. End near plane clipping of Scene ====");

    scene5 = Scene.buildFromCameraName(scene.camera, scene.name);
    logMessage("== 5. Begin projection transformation of Scene ====");
    for(const pos of scene4.positionList)
        scene5.addPosition(Project(pos, scene.camera));
    logMessage("== 5. End projection transformation of Scene ====");

    scene6 = Scene.buildFromCameraName(scene.camera, scene.name);
    logMessage("== 6. Begin primitive clipping of Scene ====");
    for(const pos of scene5.positionList)
        scene6.addPosition(clip(pos));
    logMessage("== 6. End primitive clipping of Scene ====");

    logMessage("== 7. Begin primitive rasterization of Scene ====");
    for(const pos of scene6.positionList)
        rasterize(pos, vp);
    logMessage("== 7. End primitive rasterization of Scene ====");

    logMessage("= End Rendering of Scene (Pipeline 2) =");
}

