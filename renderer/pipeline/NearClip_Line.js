/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Clip in camera space any {@link LineSegment} that crosses the
   camera's near clipping plane {@code z = -near}.  Interpolate
   {@link Vertex} color from any clipped off {@link Vertex} to
   the new {@link Vertex}.
<p>
   This clipping algorithm is a simplification of the Liang-Barsky
   Parametric Line Clipping algorithm.
*/

//@ts-check
import {nearDebug, logMessage} from "./PipelineExport.js";
import {Model, Vertex, LineSegment, Camera} from "../scene/SceneExport.js";
import {Color} from "../framebuffer/FramebufferExport.js";
import {format} from "../scene/util/UtilExport.js";

/**
 * If the {@link LineSegment} crosses the camera's near plane,
      then return a clipped version that is contained in the far
      side of the near plane. The new, clipped {@link LineSegment}
      object is returned wrapped in an {@link Optional} object.
      <p>
      One new clipped {@link Vertex} object may be added to the
      {@link Model}'s vertex list and one new interpolated
      {@link Color} object may be added to the model's color list.
      <p>
      If the {@link LineSegment} is completely on the camera side
      of the near plane, then return an empty {@link Optional} object
      to indicate that the {@link LineSegment} should be discarded
      from the model's {@link Primitive} list.

 * @param {Model} model the model containing the linesegment
 * @param {LineSegment} ls the linesegment to be clipped
 * @param {Camera} camera the camera that determines the near plane
 * @returns {LineSegment | undefined} returns the clipped linesegment or undefined if all of ls is clipped
 */
export default function clip(model, ls, camera)
{
    const n = camera.n;
    const vInd0 = ls.vIndexList[0];
    const vInd1 = ls.vIndexList[1];
    const v0 = model.vertexList[vInd0];
    const v1 = model.vertexList[vInd1];
    const z0 = v0.z;
    const z1 = v1.z;

    if (z0 <= n && z1 <= n)
    {
        if (nearDebug)
            logMessage("-- Near_Clip: Trivial accept.");

        return ls;
    }
    else if (z0 > n && z1 > n)
    {
        if (nearDebug)
            logMessage("-- Near_Clip: Trivial delete");

        return undefined;
    }
    else
        return interpolateNewVertex(model, ls, n);
}


/**
 * This method takes a line segment with one vertex on the near
      side of the near clipping plane (in front of clipping plane)
      and the other vertex on the far side of the near clipping plane
      (behind the clipping plane).
      <p>
      This method returns the line segment from the clipping plane to the
      vertex on the far side of the clipping plane.
      <p>
      This method solves for the value of {@code t} for which the z-component
      of the parametric equation
      <pre>{@code
                  p(t) = (1 - t) * v0 + t * v1
      }</pre>
      intersects the given clipping plane, {@code z = n}. The solved for
      value of {@code t} is then plugged into the x and y components of the
      parametric equation to get the coordinates of the intersection point.

 * @param {Model} model the model containing the linesegment
 * @param {LineSegment} ls the linesegment to be clipped
 * @param {number} n the z coordinate of the near plane
 * @returns
 */
function interpolateNewVertex(model, ls, n)
{
    const vInd0 = ls.vIndexList[0];
    const v0 = model.vertexList[vInd0];
    const v0x = v0.x;
    const v0y = v0.y;
    const v0z = v0.z;
    const cInd0 = ls.cIndexList[0];
    const c0 = model.colorList[cInd0].getRGBComponents();

    const vInd1 = ls.vIndexList[1];
    const v1 = model.vertexList[vInd1];
    const v1x = v1.x;
    const v1y = v1.y;
    const v1z = v1.z;
    const cInd1 = ls.cIndexList[1];
    const c1 = model.colorList[cInd1].getRGBComponents();

    const t = (n-v1z)/(v0z-v1z);

    const x = (1-t) * v1x + t * v0x;
    const y = (1-t) * v1y + t * v0y;
    const z = n;

    let t_ = undefined;

    if (t > 1)
        t_ = 1/t;
    else
        t_ = t;

    // can we just use blend function in color?
    const r = (1-t_) * c1[0] + t_ * c0[0];
    const g = (1-t_) * c1[1] + t_ * c0[1];
    const b = (1-t_) * c1[2] + t_ * c0[2];

    const newVertex = new Vertex(x, y, z);
    const vIndexNew = model.vertexList.length;
    model.vertexList.push(newVertex);

    // have to do trunc otherwise can get 255.000000000001 which will give error
    const newColor = new Color(r, g, b);
    const cIndexNew = model.colorList.length;
    model.colorList.push(newColor);

    let vNearIndex;

    if (v0z > n)
        vNearIndex = 0;
    else
        vNearIndex = 1;

    if (nearDebug)
    {
        const vClipped = (0 == vNearIndex) ? "v0" : "v1";

        logMessage(format("-- Clip off %s at z=%.3f", vClipped, n));
        logMessage(format("-- t = %.25f", t));
        logMessage(format("-- <x0, y0, z0> = <%.8f, %.8f, %.8f", v0x, v0y, v0z));
        logMessage(format("-- <x1, y1, z1> = <%.8f, %.8f, %.8f", v1x, v1y, v1z));
        logMessage(format("-- <x,  y,  z>  = <%.8f, %.8f, %.8f", x,   y,   z));
        logMessage(format("-- <r0, g0, b0> = <%.8f, %.8f, %.8f>", c0[0], c0[1], c0[2]));
        logMessage(format("-- <r1, g1, b1> = <%.8f, %.8f, %.8f>", c1[0], c1[1], c1[2]));
        logMessage(format("-- <r,  g,  b>  = <%.8f, %.8f, %.8f>", r,  g,  b));
    }

    let result = undefined;

    if (0 == vNearIndex)
        result = LineSegment.buildVertexColors(vIndexNew, vInd1, cIndexNew, cInd1)
    else
        result = LineSegment.buildVertexColors(vInd0, vIndexNew, cInd0, cIndexNew);

    return result;
}