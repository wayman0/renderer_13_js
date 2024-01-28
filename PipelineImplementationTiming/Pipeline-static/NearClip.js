/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Clip in camera space any {@link Primitive} that crosses
   the camera's near clipping plane {@code z = -near}.
*/

//@ts-check
import {NearLine, NearPoint, logPrimitive, logPrimitiveList} from "./PipelineExport.js";
import {Camera, Model, Primitive, LineSegment, Point} from "../../renderer/scene/SceneExport.js";

import {mod, cam} from "./PipelineExport.js";

export var /**@type {boolean} doNearClipping whether to do near clipping */ doNearClipping = true;
export var /**@type {boolean} nearDebug whether to debug near clipping */ nearDebug = false;

/**
 *  Start with a {@link Model} that contains {@link Primitive}s
      that have been transformed into camera space.
   <p>
      If a transformed {@link Primitive} crosses the camera's
      near plane, then replace that {@link Primitive}, in the
      {@link Model}'s list of primitives, with one that has been
      clipped so that it lies completely in the far side of the
      camera's near plane (the side of the near plane away from
      the camera).
   <p>
      If a transformed {@link Primitive} is completely in the
      camera side of the near plane, then drop that
      {@link Primitive} from the {@link Model}'s list of primitives.
   <p>
      Return a {@link Model} for which every {@link Primitive} is
      completely on the far side of the camera's near plane.

 * @param {Primitive} prim the primitives to be near clipped
 * @returns {Primitive | undefined} the clipped primitive
 */
export function clip(prim)
{
    if (!doNearClipping)
        return mod;

    logPrimitive("3. Near_Clipping", mod, prim);

    let pClipped = undefined;

    if (prim instanceof LineSegment)
        pClipped = NearLine( mod, /**@type {LineSegment}*/(prim), cam);
    else if(prim instanceof Point)
        pClipped = NearPoint(mod, /**@type {Point}*/(prim),       cam);

    if (pClipped != undefined)
    {
        logPrimitive("3. Near_Clipped (accept)", mod, pClipped);
        return pClipped;
    }
    else
        logPrimitive("3. Near_Clipped (reject)", mod, prim);
}


/**
 * Set whether or not to do nearClipping.
 * @param {boolean} val the value to set doNearClipping to be
 */
export function setDoNearClipping(val)
{
    doNearClipping = val;
}


/**
 * Set whether or not to debug near clipping.
 * @param {boolean} val the value to set nearDebug to be
 */
export function setNearDebug(val)
{
    nearDebug = val;
}
