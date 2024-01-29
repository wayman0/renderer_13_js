/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Clip a (projected) {@link LineSegment} that sticks out of the
   view rectangle in the image plane. Interpolate {@link Vertex}
   color from any clipped off {@code Vertex} to the new {@code Vertex}.
<p>
   This clipping algorithm is a simplification of the Liang-Barsky
   Parametric Line Clipping algorithm.
<p>
   This algorithm assumes that all {@code Vertex} objects have been
   projected onto the {@link renderer.scene.Camera}'s image plane,
   {@code z = -1}. This algorithm also assumes that the camera's view
   rectangle in the image plane is
   <pre>{@code
      -1 <= x <= +1  and
      -1 <= y <= +1.
   }</pre>
<p>
   If a line segment's projected vertex has an {@code x} or {@code y}
   coordinate with absolute value greater than 1, then that vertex
   "sticks out" of the view rectangle. This algorithm will clip the
   line segment so that both of the line segment's vertices are within
   the view rectangle.
<p>
   Here is an outline of the clipping algorithm.
<p>
   Recursively process each line segment, using the following steps.
<p>
     1) Test if the line segment no longer needs to be clipped, i.e.,
        both of its vertices are within the view rectangle. If this is
        the case, then return true.
        <pre>{@code
               x=-1        x=+1
                 |          |
                 |          |
             ----+----------+----- y = +1
                 |     v1   |
                 |    /     |
                 |   /      |
                 |  /       |
                 | v0       |
             ----+----------+----- y = -1
                 |          |
                 |          |
        }</pre>
<p>
     2) Test if the line segment should be "trivially rejected". A line
        segment is "trivially rejected" if it is on the wrong side of any
        of the four lines that bound the view rectangle (i.e., the four
        lines {@code x = 1}, {@code x = -1}, {@code y = 1}, {@code y = -1}).
        If so, then return {@code false} (so the line segment will not be
        rasterized into the framebuffer).
<p>
        Notice that a line like the following one is trivially rejected
        because it is on the "wrong" side of the line {@code x = 1}.
        <pre>{@code
                           x=1
                            |            v1
                            |            /
                 +----------+           /
                 |          |          /
                 |          |         /
                 |          |        /
                 |          |       /
                 |          |      /
                 +----------+     /
                            |    /
                            |  v0
        }</pre>
        But the following line is NOT trivially rejected because, even
        though it is completely outside of the view rectangle, this line
        is not entirely on the wrong side of any one of the four lines
        {@code x = 1}, {@code x = -1}, {@code y = 1}, or {@code y = -1}.
        The line below will get clipped at least one time (either on the
        line {@code x = 1} or the line {@code y = -1}) before it is
        (recursively) a candidate for "trivial rejection". Notice that
        the line below could even be clipped twice, first on {@code y = 1},
        then on {@code x = 1}, before it can be trivially rejected (by
        being on the wrong side of {@code y = -1}).
        <pre>{@code
                           x=1
                            |          v1
                            |         /
                 +----------+        /
                 |          |       /
                 |          |      /
                 |          |     /
                 |          |    /
                 |          |   /
                 +----------+  /
                            | /
                            |/
                            /
                           /|
                          / |
                        v0
        }</pre>
<p>
     3) If the line segment has been neither accepted nor rejected, then
        it needs to be clipped. So we test the line segment against each
        of the four clipping lines, {@code x = 1}, {@code x = -1},
        {@code y = 1}, and {@code y = -1}, to determine if the line segment
        crosses one of those lines. We clip the line segment against the
        first line which we find that it crosses. Then we recursively clip
        the resulting clipped line segment. Notice that we only clip against
        the first clipping line which the segment is found to cross. We do
        not continue to test against the other clipping lines. This is
        because it may be the case, after just one clip, that the line
        segment is now a candidate for trivial accept or reject. So rather
        than test the line segment against several more clipping lines
        (which may be useless tests) it is more efficient to recursively
        clip the line segment, which will then start with the trivial accept
        or reject tests.
<p>
        When we clip a line segment against a clipping line, it is always
        the case that one endpoint of the line segment is on the "right"
        side of the clipping line and the other endpoint is on the "wrong"
        side of the clipping line. In the following picture, assume that
        {@code v0} is on the "wrong" side of the clipping line ({@code x = 1})
        and {@code v1} is on the "right" side. So {@code v0} needs to be
        clipped off the line segment and replaced by a new vertex.
        <pre>{@code
                             x=1
                         v1   |
                           \  |
                            \ |
                             \|
                              \
                              |\
                              | \
                              |  \
                              |   v0
        }</pre>
        Represent points {@code p(t)} on the line segment between {@code v0}
        and {@code v1} with the following parametric equation.
        <pre>{@code
                  p(t) = (1-t) * v0 + t * v1  with  0 <= t <= 1
        }</pre>
        Notice that this equation parameterizes the line segment starting
        with {@code v0} at {@code t=0} (on the "wrong side") and ending
        with {@code v1} at {@code t=1} (on the "right side"). We need to
        find the value of {@code t} when the line segment crosses the
        clipping line {@code x = 1}. Let {@code v0 = (x0, y0)} and let
        {@code v1 = (x1, y1)}. Then the above parametric equation becomes
        the two component equations
        <pre>{@code
                 x(t) = (1-t) * x0 + t * x1,
                 y(t) = (1-t) * y0 + t * y1,  with  0 <= t <= 1.
        }</pre>
        Since the clipping line in this example is {@code x = 1}, we need
        to solve the equation {@code x(t) = 1} for {@code t}. So we need
        to solve
        <pre>{@code
                  1 = (1-t) * x0 + t * x1
        }</pre>
        for {@code t}. Here are a few algebra steps.
        <pre>{@code
                  1 = x0 - t * x0 + t * x1
                  1 = x0 + t * (x1 - x0)
                  1 - x0 = t * (x1 - x0)
                       t = (1 - x0)/(x1 - x0)
        }</pre>
        We get similar equations for {@code t} if we clip against the other
        clipping lines ({@code x = -1}, {@code y = 1}, or {@code y = -1})
        and we assume that {@code v0} is on the "wrong side" and {@code v1}
        is on the "right side".
<p>
        Let {@code t0} denote the above value for {@code t}. With this value
        for {@code t}, we can compute the y-coordinate of the new vertex
        {@code p(t0)} that replaces {@code v0}.
        <pre>{@code
                             x=1
                        v1    |
                          \   |
                           \  |
                            \ |
                              p(t0)=(1, y(t0))
                              |
                              |
                              |
         }</pre>
         Here is the algebra.
         <pre>{@code
                  y(t0) = (1-t0) * y0 + t0 * y1
                        = y0 + t0 * (y1 - y0)
                        = y0 + (1 - x0)*((y1 - y0)/(x1 - x0))
         }</pre>
         Finally, the new line segment between {@code v1} and the new
         vertex {@code p(t0)} is recursively clipped so that it can be
         checked to see if it should be trivially accepted, trivially
         rejected, or clipped again.
*/

//@ts-check

import {clipDebug, logMessage} from "./PipelineExport.js";
import {Model, Vertex, LineSegment} from "../../../renderer/scene/SceneExport.js";
import {Color} from "../../../renderer/framebuffer/FramebufferExport.js";
import {format} from "../../../renderer/scene/util/UtilExport.js";

/**
 * If the {@link LineSegment} sticks out of the view rectangle,
      then return a clipped version that is contained in the view
      rectangle. The new, clipped {@link LineSegment} object is
      returned wrapped in an {@link Optional} object.
      <p>
      At least one new clipped {@link Vertex} will be added to the
      {@link Model}'s vertex list (and as many as four new vertices
        may be added to the {@link Model}'s vertex list).
        <p>
        If the {@link LineSegment} is completely outside of the view
        rectangle, then return an empty {@link Optional} object to
        indicate that the {@link LineSegment} should be discarded.

 * @param {Model} model The model with the linesegment
 * @param {LineSegment} ls the linesegment to be clipped
 * @returns {LineSegment | undefined} the clipped linesegment or undefined if all of ls is outside
 */
export default function clip(model, ls)
{
    const vIndex0 = ls.vIndexList[0];
    const vIndex1 = ls.vIndexList[1];
    const v0 = model.vertexList[vIndex0];
    const v1 = model.vertexList[vIndex1];
    const x0 = v0.x, y0 = v0.y;
    const x1 = v1.x, y1 = v1.y;

    if (! ( Math.abs(x0) > 1
         || Math.abs(y0) > 1
         || Math.abs(x1) > 1
         || Math.abs(y1) > 1) )
    {
        if (clipDebug)
            logMessage("-- Trivial accept.");

        return ls;
    }
    else if ( (x0 >  1 && x1 >  1) ||
              (x0 < -1 && x1 < -1) ||
              (y0 >  1 && y1 >  1) ||
              (y0 < -1 && y1 < -1))
    {
        if (clipDebug)
            logMessage("-- Trivial delete.");

        return undefined;
    }
    else
        return clip(model, clipOneTime(model, ls));
}


/**
 * This method takes in a line segment that crosses one of the four
      clipping lines. This method returns a new LineSegment that uses
      a new, interpolated, Vertex that is the intersection point between
      the given LineSegment and the crossed clipping line.
      <p>
      This method solves for the value of {@code t} for which the
      parametric equation
      <pre>{@code
                  p(t) = (1-t) * v_outside + t * v_inside
      }</pre>
      intersects the crossed clipping line. (Notice that the equation
      is parameterized so that we move from the outside vertex towards
      the inside vertex as {@code t} increases from 0 to 1.) The solved
      for value of {@code t} is then plugged into the parametric formula
      to get the coordinates of the intersection point.
      <p>
      The new interpolated Vertex is added to the end of the vertex list
      from the given Model.

 * @param {Model} model the model contianing the linesegment
 * @param {LineSegment} ls the linesegment to be clipped
 * @returns
 */
function clipOneTime(model, ls)
{
    const vIndex0 = ls.vIndexList[0];
    const vIndex1 = ls.vIndexList[1];
    const vertex0 = model.vertexList[vIndex0];
    const vertex1 = model.vertexList[vIndex1];

    const x0 = vertex0.x, y0 = vertex0.y;
    const x1 = vertex1.x, y1 = vertex1.y;

    let equation = "";
    let vOutside;
    let vOx; let vOy;
    let vIx; let vIy;
    let t = undefined;
    let x = undefined;
    let y = undefined;
    let vIndexNew = undefined;

    if (x0 > 1)
    {
        equation = "x = +1";
        vOutside = 0;
        vOx = x0; vOy = y0;
        vIx = x1; vIy = y1;

        t = (1-vOx) / (vIx - vOx);
        x = 1;
        y = (1-t) * vOy + t * vIy;
    }
    else if (x1 > 1)
    {
        equation = "x = +1";
        vOutside = 1;
        vOx = x1; vOy = y1;
        vIx = x0; vIy = y0;

        t = (1-vOx) / (vIx - vOx);
        x = 1;
        y = (1-t) * vOy + t * vIy;
    }
    else if (x0 < -1)
    {
        equation = "x = -1";
        vOutside = 0;
        vOx = x0; vOy = y0;
        vIx = x1; vIy = y1;

        t = (-1 - vOx) / (vIx - vOx);
        x = -1;
        y = (1-t) * vOy + t * vIy;
    }
    else if (x1 < -1)
    {
        equation = "x = -1";
        vOutside = 1;
        vIx = x0;  vIy = y0;
        vOx = x1;  vOy = y1;

        t = (-1 - vOx) / (vIx - vOx);
        x = -1;  // prevent rounding errors
        y = (1 - t) * vOy + t * vIy;   
    }
    else if (y0 > 1)  // ls crosses the line y = 1
    {
        equation = "y = +1";
        vOutside = 0;
        vOx = x0;  vOy = y0;
        vIx = x1;  vIy = y1;

        t = (1 - vOy) / (vIy - vOy);
        x = (1 - t) * vOx + t * vIx;
        y = 1;  // prevent rounding errors
    }
    else if (y1 > 1)  // ls crosses the line y = 1
    {
        equation = "y = +1";
        vOutside = 1;
        vIx = x0;  vIy = y0;
        vOx = x1;  vOy = y1;

        t = (1 - vOy) / (vIy - vOy);
        x = (1 - t) * vOx + t * vIx;
        y = 1;  // prevent rounding errors
    }
    else if (y0 < -1)  // ls crosses the line y = -1
    {
        equation = "y = -1";
        vOutside = 0;
        vOx = x0;  vOy = y0;
        vIx = x1;  vIy = y1;

        t = (-1 - vOy) / (vIy - vOy);
        x = (1 - t) * vOx + t * vIx;
        y = -1;  // prevent rounding errors
    }
    else // if (y1 < -1)  // ls crosses the line y = -1
    {
        equation = "y = -1";
        vOutside = 1;
        vIx = x0;  vIy = y0;
        vOx = x1;  vOy = y1;

        t = (-1 - vOy) / (vIy - vOy);
        x = (1 - t) * vOx + t * vIx;
        y = -1;  // prevent rounding errors
    }

    let newVertex = new Vertex(x, y, 0);
    vIndexNew = model.vertexList.length;
    model.addVertex(newVertex);

    let cIndexI = ls.cIndexList[1-vOutside];
    let cIndexO = ls.cIndexList[vOutside];
    let cI = model.colorList[cIndexI].getRGBComponents();
    let cO = model.colorList[cIndexO].getRGBComponents();

    // since t is already a float we dont need to cast it
    let t_ = undefined;
    if (t > 1)
        t_ = 1/t;
    else
        t_ = t;

    // this looks like blending code,
    // can we just use a blend function in
    // the color class?
    let r = (1-t_) * cO[0] + t_ * cI[0];
    let g = (1-t_) * cO[1] + t_ * cI[1];
    let b = (1-t_) * cO[2] + t_ * cI[2];

    // have to truncate otherwise can get 255.0000000001
    let newColor = new Color(r, g, b);
    let cIndexNew = model.colorList.length;
    model.addColor(newColor);

    if (clipDebug)
    {
        let vOut = "";
        if (0 == vOutside)
            vOut = "v0";
        else
            vOut = "v1";

        logMessage(
            format("-- Clip off %s at %s", vOut, equation));
         logMessage(
            format("-- t = %.25f", t));
         logMessage(
            format("-- <x_i, y_i> = <%.24f, %.24f>",  vIx, vIy));
         logMessage(
            format("-- <x_o, y_o> = <%.24f, %.24f>",  vOx, vOy));
         logMessage(
            format("-- <x_c, y_c> = <%.24f, %.24f>",    x,   y));
         logMessage(
            format("-- <r_i, g_i, b_i> = <%.15f,  %.15f,  %.15f>",
                              cI[0], cI[1], cI[2]));
         logMessage(
            format("-- <r_o, g_o, b_o> = <%.15f,  %.15f,  %.15f>",
                              cO[0], cO[1], cO[2]));
         logMessage(
            format("-- <r_c, g_c, b_c> = <%.15f,  %.15f,  %.15f>",
                               r,   g,   b));
    }

    let newLS = undefined;

    if (1 == vOutside)
    {
        newLS = LineSegment.buildVertexColors(vIndex0,
                                              vIndexNew,
                                              cIndexI,
                                              cIndexNew);
    }
    else
    {
        newLS = LineSegment.buildVertexColors(vIndexNew,
                                              vIndex1,
                                              cIndexNew,
                                              cIndexI);
    }

    return newLS;
}