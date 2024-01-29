/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Clip in camera space any {@link Point} that crosses the
   camera's near clipping plane {@code z = -near}.
*/

//@ts-check
import {Model, Vertex, Point, Camera} from "../../../renderer/scene/SceneExport.js";

/**
 *    If the {@link Vertex} used by the {@link Point} is on the camera
      side of the near plane, then return an empty {@link Optional}
      object to indicate that the {@link Point} should be discarded
      from the model's {@link Primitive} list.
      <p>
      If the {@link Vertex} used by the {@link Point} is on the far
      side of the near plane, then return the {@link Point} wrapped
      in an {@link Optional} object.

 * @param {Model} model the model containing the point
 * @param {Point} pt the point to be clipped
 * @param {Camera} camera the camera containing the near plane
 * @returns {Point | undefined} the point if it isn't clipped or undefined if it is
 */
export default function clip(model, pt, camera)
{
    let result = undefined;
    const vIndex = pt.vIndexList[0];
    const v = model.vertexList[vIndex];
    const z = v.z;

    if (z <= camera.n)
    {
        result = pt;
    }

    return result;
}