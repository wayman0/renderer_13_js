/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Clip a (projected) {@link Point} that might stick out
   of the camera's view rectangle in the image plane.
*/

//@ts-check
import {Model, Vertex, Point} from "../scene/SceneExport.js";

/**
 * If the {@link Vertex} used by the {@link Point} sticks out
   of the camera's view rectangle, then have the {@link Point}
   deleted from the model's primitive list.

 * @param {Model} model the model containing the point
 * @param {Point} pt the point to be clipped
 * @returns {Point | undefined} the point if it isn't clipped or undefined if it is clipped
 */
export default function clip(model, pt)
{
    let result = undefined;

    const vIndex = pt.vIndexList[0];
    const v = model.vertexList[vIndex];

    const x = v.x, y = v.y;

    if (! (Math.abs(x) > 1 || Math.abs(y) > 1))
    {
        result = pt;
    }

    return result;
}