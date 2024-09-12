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
import {Model, Vertex, Point, Points} from "../scene/SceneExport.js";
import { clipDebug, logMessage } from "./PipelineExport.js";
/**
 * If the {@link Vertex} used by the {@link Point} sticks out
   of the camera's view rectangle, then have the {@link Point}
   deleted from the model's primitive list.

 * @param {Model} model the model containing the point
 * @param {Points} pts the point to be clipped
 * @returns {Point | undefined} the point if it isn't clipped or undefined if it is clipped
 */
export default function clip(model, pts)
{
    let result = undefined;
    const clippedvIndexList = new Array();
    const clippedcIndexList = new Array();

    for(let i = 0; i < pts.vIndexList.length; ++i)
    {
      const vIndex = pts.vIndexList[i];
      const cIndex = pts.cIndexList[i];

      const v = model.vertexList[vIndex];
      const x = v.x, y = v.y;

      if( ! (Math.abs(x) > 1) 
          || (Math.abs(y) > 1))
      {
          clippedvIndexList.push(vIndex);
          clippedcIndexList.push(cIndex);
          
          if(clipDebug) logMessage("-- Trivial accept: " + vIndex);
      }
      else
      {
          if(clipDebug) logMessage("-- Trivial delete: " + vIndex);
      }
    }

    if(clippedvIndexList.length <= 0)
        result = undefined;
    else
    {
      const pts2 = new Points(clippedvIndexList, clippedcIndexList);
      pts2.radius = pts.radius;
      result = pts2;
    }

    return result;
}