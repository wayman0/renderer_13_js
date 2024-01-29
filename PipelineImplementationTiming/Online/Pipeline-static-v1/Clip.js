/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Clip a (projected) geometric {@link Primitive} that sticks out
   of the camera's view rectangle in the image plane. Interpolate
   {@link Vertex} color from any clipped off {@link Vertex} to the
   new {@link Vertex}.
*/

//@ts-check
import {LineClip, PointClip, logPrimitive} from "./PipelineExport.js";
import {Model, Primitive, LineSegment, Point, Vertex} from "../../../renderer/scene/SceneExport.js";

import {mod} from "./PipelineExport.js";

export var /**@type {boolean} whether to debug clipping */clipDebug = false;

/**
      Start with a {@link Model} that contains {@link Primitive}s
      that have been projected onto the camera's view plane,
      {@code z = -1}.
   <p>
      If a projected {@link Primitive} sticks out of the camera's
      view rectangle, then replace that {@link Primitive}, in the
      {@link Model}'s list of primitives, with one that has been
      clipped so that it is contained in the view rectangle.
   <p>
      If a projected {@link Primitive} is completely outside of
      the view rectangle, then drop that {@link Primitive} from
      the {@link Model}'s list of primitives.
   <p>
      Return a {@link Model} for which every {@link Primitive} is
      completely contained in the camera's view rectangle.

 * @param {Primitive} prim the primitive to be clipped
 * @returns {Primitive | undefined} the clipped primitive
 */
export function clip(prim)
{
    logPrimitive("5. Clipping", mod, prim);

    let pClipped = undefined;
    
    if (prim instanceof LineSegment)
        pClipped = LineClip(mod, /**@type {LineSegment}*/ (prim));
    else if(prim instanceof Point)
        pClipped = PointClip(mod, /**@type {Point}*/ (prim));

    if (pClipped != undefined)
    {
        logPrimitive("5. Clipped (accept)", mod, pClipped);
        return pClipped;
    }
    else
        logPrimitive("5. Clipped (reject)", mod, prim);
}


/**
 * Set whether or not to debug clipping
 * @param {boolean} val the value to set clipDebug to be
 */
export function setClipDebug(val)
{
    clipDebug = val;
}