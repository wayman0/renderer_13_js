/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Rasterize a clipped {@link LineSegment} into shaded pixels
   in a {@link FrameBuffer}'s viewport and (optionally)
   anti-alias and gamma-encode the line at the same time.
<p>
   This pipeline stage takes a clipped {@link LineSegment}
   with vertices in the {@link Camera}'s view rectangle and
   rasterizezs the line segment into shaded, anti-aliased
   pixels in a {@link FrameBuffer}'s viewport. This rasterizer
   will linearly interpolate color from the line segment's two
   endpoints to each rasterized (and anti-aliased) pixel in
   the line segment.
<p>
   This rasterization algorithm is based on
<pre>
     "Fundamentals of Computer Graphics", 3rd Edition,
      by Peter Shirley, pages 163-165.
</pre>
<p>
   This rasterizer implements a simple version of Xiaolin_Wu's
   anti-aliasing algorithm. See
     <a href="https://en.wikipedia.org/wiki/Xiaolin_Wu's_line_algorithm" target="_top">
              https://en.wikipedia.org/wiki/Xiaolin_Wu's_line_algorithm</a>
*/

//@ts-check
import {rastDebug, doAntiAliasing, doGamma, logMessage, logPixel, logPixelsXAA, logPixelsYAA} from "./PipelineExport.js";
import {Model, LineSegment} from "../scene/SceneExport.js";
import {Viewport, Color} from "../framebuffer/FramebufferExport.js";
import {format} from "../scene/util/UtilExport.js";

/**
 *  Rasterize a clipped {@link LineSegment} into anti-aliased, shaded pixels
    in the {@link FrameBuffer.Viewport}.

 * @param {Model} model the model containing the linesegment
 * @param {LineSegment} ls the linesegment to be rasterized
 * @param {Viewport} vp the viewport to set the pixels in
 */
export default function rasterize(model, ls, vp)
{
    const bg = Color.convert2Float(vp.bgColorVP);
  //const bg = vp.bgColorVP();//.convert2Float();
    const w = vp.width;
    const h = vp.height;

    const vIndex0 = ls.vIndexList[0];
    const vIndex1 = ls.vIndexList[1];
    const v0 = model.vertexList[vIndex0];
    const v1 = model.vertexList[vIndex1];

    const cIndex0 = ls.cIndexList[0];
    const cIndex1 = ls.cIndexList[1];
  //const c0 = model.colorList[cIndex0].convert2Float.getRGBComponents;
  //const c1 = model.colorList[cIndex1].convert2Float.getRGBComponents;
    const c0 = Color.convert2Float(model.colorList[cIndex0]).getRGBComponents();
    const c1 = Color.convert2Float(model.colorList[cIndex1]).getRGBComponents();
    let r0 = c0[0], g0 = c0[1], b0 = c0[2];
    let r1 = c1[0], g1 = c1[1], b1 = c1[2];

    let x0 = .5 + w/2.001 * (v0.x + 1), x1 = .5 + w/2.001 * (v1.x + 1);
    let y0 = .5 + h/2.001 * (v0.y + 1), y1 = .5 + h/2.001 * (v1.y + 1);

    if (rastDebug)
    {
        logMessage(format("(x0_pp, y0_pp) = (%9.4f, %9.4f)", x0, y0));
        logMessage(format("(x1_pp, y1_pp) = (%9.4f, %9.4f)", x1, y1));
    }

    x0 = Math.round(x0), x1 = Math.round(x1);
    y0 = Math.round(y0), y1 = Math.round(y1);

    //x0 = Math.trunc(x0), x1 = Math.trunc(x1);
    //y0 = Math.trunc(y0), y1 = Math.trunc(y1);

    //console.log("(%d, %d), (%d, %d)", x0, y0, x1, y1);

    if ((x0 == x1) && (y0 == y1))
    {
        const x0VP = Math.trunc(Math.trunc(x0) -1);
        //const y0VP = Math.trunc(y0)-1;
        const y0VP = Math.trunc(h - Math.trunc(y0));

        if (rastDebug)
        {
            logPixel(x0, y0, x0VP, y0VP, r0, g0, b0, vp);
        }

        vp.setPixelVP(x0VP, y0VP, new Color(r0, g0, b0, 255, model.colorList[cIndex0].isFloat()));

        return;
    }

    let transposedLine = false;
    if (Math.abs(y1-y0) > Math.abs(x1-x0))
    {
        let temp0 = x0;
        x0 = y0;
        y0 = temp0;

        let temp1 = x1;
        x1 = y1;
        y1 = temp1;

        transposedLine = true;
    }

    if (x1 < x0)
    {
        let tempX = x0;
        x0 = x1;
        x1 = tempX;

        let tempY = y0;
        y0 = y1;
        y1 = tempY;

        let tempR = r0;
        let tempG = g0;
        let tempB = b0;

        r0 = r1;
        g0 = g1;
        b0 = b1;
        r1 = tempR;
        g1 = tempG;
        b1 = tempB;
    }

    const denom  =  x1 - x0;
    const      m = (y1 - y0)/denom;
    const slopeR = (r1 - r0)/denom;
    const slopeG = (g1 - g0)/denom;
    const slopeB = (b1 - b0)/denom;

    if (rastDebug)
    {
        const inverseSlope = (transposedLine) ? " (transposed, so 1/m = " + 1/m + ")" : "";
        logMessage("Slope m    = " + m + inverseSlope);
        logMessage("Slope mRed = " + slopeR);
        logMessage("Slope mGrn = " + slopeG);
        logMessage("Slope mBlu = " + slopeB);
        logMessage(format("(x0_vp, y0_vp) = (%9.4f, %9.4f)", x0-1, h-y0));
        logMessage(format("(x1_vp, y1_vp) = (%9.4f, %9.4f)", x1-1, h-y1));
    }

    let y = y0;

    for (let x = Math.trunc(x0); x < Math.trunc(x1); x += 1, y += m)
    {
        // how to convert to float?
        let r = Math.abs(r0 + slopeR * (x - x0));
        let g = Math.abs(g0 + slopeG * (x - x0));
        let b = Math.abs(b0 + slopeB * (x - x0));

        if (doAntiAliasing)
        {
            let yLow = Math.trunc(y);
            let yHi = Math.trunc(yLow + 1);

            if (! transposedLine && y == h) yHi = h;
            if (  transposedLine && y == w) yHi = w;

            const weight = (y - yLow);

            let rL = (1-weight) * r + weight * (bg.getRed());
            let gL = (1-weight) * g + weight * (bg.getGreen());
            let bL = (1-weight) * b + weight * (bg.getBlue());

            let rH = weight * r + (1-weight) * (bg.getRed());
            let gH = weight * g + (1-weight) * (bg.getGreen());
            let bH = weight * b + (1-weight) * (bg.getBlue());

            if (doGamma)
            {
                rL = Math.pow(rL, Color.GAMMA);
                gL = Math.pow(gL, Color.GAMMA);
                bL = Math.pow(bL, Color.GAMMA);
                rH = Math.pow(rH, Color.GAMMA);
                gH = Math.pow(gH, Color.GAMMA);
                bH = Math.pow(bH, Color.GAMMA);
            }

            const isFloat = r <=1 && g<=1 && b<=1;

            if (!transposedLine)
            {
                const xVP = Math.trunc(x-1);
                const yVPLow = Math.trunc(h-yLow);
                //const yVPLow = h-yLow - 1;
                //const yVPHi = h-yHi - 1;
                const yVPHi = Math.trunc(h-yHi);

                if (rastDebug)
                {
                    logPixelsYAA(x, y, xVP, yVPLow, yVPHi,
                                rL, gL, bL, rH, gH, bH, vp);
                }

                // have to check if the color is in int or float representation
                vp.setPixelVP(xVP, yVPLow, new Color(rL, gL, bL, isFloat? 1:255, isFloat));
                vp.setPixelVP(xVP, yVPHi,  new Color(rH, gH, bH, isFloat? 1:255, isFloat));
            }
            else
            {
                const xVPLow = Math.trunc(yLow -1);
                const xVPHi = Math.trunc(yHi -1);
                //const yVP = h-x -1;
                const yVP = Math.trunc(h-x);

                if (rastDebug)
                {
                    logPixelsXAA(y, x, xVPLow, xVPHi, yVP,
                                 rL, gL, bL, rH, gH, bH, vp);
                }

                // have to check if the color is in int or float representation
                vp.setPixelVP(xVPLow, yVP, new Color(rL, gL, bL, isFloat? 1:255, isFloat));
                vp.setPixelVP(xVPHi,  yVP, new Color(rH, gH, bH, isFloat? 1:255, isFloat));
            }
        }
        else
        {
            if (doGamma)
            {
                r = Math.pow(r, Color.GAMMA);
                g = Math.pow(g, Color.GAMMA);
                b = Math.pow(b, Color.GAMMA);
            }

            const isFloat = r<= 1 && g<= 1 && b<= 1;
            if (!transposedLine)
            {
                //const xVP = x;
                //const yVP = h-Math.trunc(Math.round(y)) - 1;
                const xVP = Math.trunc(x-1);
                const yVP = Math.trunc(h - Math.trunc(Math.round(y)));

                if (rastDebug)
                {
                    logPixel(x, y, xVP, yVP, r, g, b, vp);
                }

                // have to check if the color is in int or float representation
                vp.setPixelVP(xVP, yVP, new Color(r, g, b, isFloat? 1:255, isFloat));
            }
            else
            {
                //const xVP = Math.trunc(Math.round(y));
                //const yVP = h-x - 1;
                
                const xVP = Math.trunc((Math.trunc(Math.round(y)))-1);
                const yVP = Math.trunc(h-x);

                if (rastDebug)
                {
                    logPixel(y, x, xVP, yVP, r, g, b, vp);
                }

                // have to check if the color is in int or float representation
                vp.setPixelVP(xVP, yVP, new Color(r, g, b, isFloat? 1:255, isFloat))
            }
        }
    }

    const isFloat = r1 <=1 && g1 <= 1 && b1 <= 1
    if (!transposedLine)
    {
        const xVP = Math.trunc(Math.trunc(x1) -1);
        //const yVP = h - Math.trunc(y1) - 1;
        const yVP = Math.trunc(h - Math.trunc(y1));
        
        if (rastDebug)
        {
            logPixel(x1, y1, xVP, yVP, r1, g1, b1, vp);
        }

        // have to check if the color is in int or float representation
        vp.setPixelVP(xVP, yVP, new Color(r1, g1, b1, isFloat? 1:255, isFloat));
    }
    else
    {
        const xVP = Math.trunc(Math.trunc(y1) - 1);
        const yVP  = Math.trunc(h - Math.trunc(x1));

        if (rastDebug)
        {
            logPixel(y1, x1, xVP, yVP, r1, g1, b1, vp);
        }

        // have to check if the color is in int or float representation
        vp.setPixelVP(xVP, yVP, new Color(r1, g1, b1, isFloat? 1:255, isFloat))
    }
}