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
import {Model, Vertex, Point, Camera, Points} from "../scene/SceneExport.js";
import { nearDebug } from "./NearClip.js";
import { logMessage } from "./PipelineLogger.js";
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

    const clippedvIndexList = new Array();
    const clippedcIndexList = new Array();

    for(let i = 0; i < pt.vIndexList.length; ++i)
    {
        const vIndex = pt.vIndexList[i];
        const cIndex = pt.cIndexList[i];

        const v = model.vertexList[vIndex];
        const z = v.z;

        if(z <= camera.n)
        {
            clippedvIndexList.push(vIndex);
            clippedcIndexList.push(cIndex);

            if(nearDebug) logMessage("-- Trivial accept: " + vIndex);
        }
        else
        {
            if(nearDebug) logMessage("-- Trivial delete: " + vIndex);
        }
    }

    if(clippedvIndexList.length <= 0)
        result = undefined;
    else
    {
        const pts2 = new Points(clippedvIndexList, clippedcIndexList);
        pts2.radius = pt.radius;
        result = pts2;
    }
    
    return result;
}