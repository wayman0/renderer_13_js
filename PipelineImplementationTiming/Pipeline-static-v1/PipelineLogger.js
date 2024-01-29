/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
 * methods used by the pipeline stages to log info
 */

//@ts-check
import {Model, Vertex, Primitive, LineSegment, Point} from "../../renderer/scene/SceneExport.js";
import {Viewport, Color} from "../../renderer/framebuffer/FramebufferExport.js";
import {format} from "../../renderer/scene/util/UtilExport.js";

/**@type {boolean} whether to debug the scene */    export let debugScene = false;
/**@type {boolean} whether to debug the position */ export let debugPosition = false;

/**
 * Use the debug info to determine whether to log info.
 * @param {string} message the message to be recorded
 */
export function logMessage(message)
{
    if (debugScene || debugPosition)
    {
        console.log(message);
    }
}


/**
 * Prints a string representation of the given vertex list.
 * @param {string} stage the stage of the pipeline
 * @param {Model} model the model being rendered
 */
export function logVertexList(stage, model)
{
    if (debugScene || debugPosition)
    {
        let i = 0;
        for (const v of model.vertexList)
        {
            console.log(stage + ": vIndex = " + i + ", " + v.toString() + "\n");
            i += 1;
        }
    }
}


/**
 * Prints a string representation of the given colorlist.
 * @param {string} stage the stage of the pipeline
 * @param {Model} model the model being rendereed
 */
export function logColorList(stage, model)
{
    if (debugScene || debugPosition)
    {
        let i = 0;
        for (const c of model.colorList)
        {
            console.log(stage + ": cIndex = " + i + ", " + c.toString() + "\n");
            i += 1;
        }
    }
}


/**
 * Prints a string representation of the given primitive list.
 * @param {string} stage the stage of the pipeline
 * @param {Model} model the model being rendered
 */
export function logPrimitiveList(stage, model)
{
    if (debugScene || debugPosition)
    {
        if (model.primitiveList.length == 0)
        {
            console.log(stage + ": []\n");
        }
        else
        {
            for (const p of model.primitiveList)
            {
                console.log(stage + ": " + p.toString() + "\n");
            }
        }
    }
}


/**
 * Prints a string representation of the given primitive.
 * @param {string} stage the stage of the pipeline
 * @param {Model} model the model being rendered
 * @param {Primitive} p the primitive to be logged
 */
export function logPrimitive(stage, model, p)
{
    if (debugScene || debugPosition)
    {
        console.log(stage + ": " + p.toString() + "/n");

        for (const vIndex of p.vIndexList)
        {
            const v = model.vertexList[vIndex];
            console.log("   vIndex = " + vIndex + ", " + v.toString() + "\n");
        }

        for (const cIndex of p.cIndexList)
        {
            const c = model.colorList[cIndex];
            console.log("   cIndex = " + cIndex + ", " + c.toString() + "\n");
        }
    }
}


/**
 * Prints a string representation of the given pixel being rasterized.
 *
 * @param {string} clippedMessage string specifying whether or not the pixel has been clipped
 * @param {number} xpp horizontal pixel plane coordinate
 * @param {number} ypp vertical pixel plane coordinate
 * @param {number} xvp horizontal viewport coordinate
 * @param {number} yvp vertical viewport coordinate
 * @param {number} r the red value
 * @param {number} g the green value
 * @param {number} b the blue value
 * @param {Viewport} vp the viewport the pixel is being set into
 */
export function logPixelMessage(clippedMessage, xpp, ypp, xvp, yvp, r, g, b, vp)
{
    if (debugScene || debugPosition)
    {
        let wVP = vp.width;
        let hVP = vp.height;
        let xVP = vp.vp_ul_x;
        let yVP = vp.vp_ul_y;
        let fb = vp.getFrameBuffer();
        let wFB = fb.width;
        let hFB = fb.height;

        console.log(format("fb_[w=%d,h=%d] vp_[x=%4d, y=%4d, w=%d,h=%d]  (x_pp=%9.4f, y_pp=%9.4f)  (x_vp=%4d, y_vp=%4d)  r=%.4f g=%.4f b=%.4f",
                    wFB, hFB,      xVP,   yVP,   wVP, hVP,    xpp,       ypp,         xvp,     yvp,      r,     g,     b));
        console.log(clippedMessage);
    }
}


/**
 * Prints a string representation of the given pixel being rasterized.
 *
 * @param {number} xpp horizontal pixel plane coordinate
 * @param {number} ypp vertical pixel plane coordinate
 * @param {number} xvp horizontal viewport coordinate
 * @param {number} yvp vertical viewport coordinate
 * @param {number} r the red value
 * @param {number} g the green value
 * @param {number} b the blue value
 * @param {Viewport} vp the viewport the pixel is being set into
 */
export function logPixel(xpp, ypp, xvp, yvp, r, g, b, vp)
{
    logPixelMessage("", xpp, ypp, xvp, yvp, r, g, b, vp);
}


/**
      Log two anti-aliased pixels from a "horizontal" line
      that is being rasterized along the x-axis.

      @param {number} xpp   horizontal coordinate of the pixel in the pixel-plane
      @param {number} ypp   vertical coordinate of the pixel in the pixel-plane
      @param {number} xvp   horizontal coordinate of the anti-aliased pixels in the {@link FrameBuffer.Viewport}
      @param {number} y1vp  vertical coordinate of the first anti-aliased pixel in the {@link FrameBuffer.Viewport}
      @param {number} y2vp  vertical coordinate of the second anti-aliased pixel in the {@link FrameBuffer.Viewport}
      @param {number} r1     red component of the first anti-aliased pixel's {@link Color}
      @param {number} g1     green component of the first anti-aliased pixel's {@link Color}
      @param {number} b1     blue component of the first anti-aliased pixel's {@link Color}
      @param {number} r2     red component of the second anti-aliased pixel's {@link Color}
      @param {number} g2     green component of the second anti-aliased pixel's {@link Color}
      @param {number} b2     blue component of the second anti-aliased pixel's {@link Color}
      @param {Viewport} vp     {@link FrameBuffer.Viewport} that the pixel is being placed in
   */
export function logPixelsYAA(xpp, ypp, xvp, y1vp, y2vp, r1, g1, b1, r2, g2, b2, vp)
{
    if (debugScene || debugPosition)
    {
        const wVP = vp.width;
        const hVP = vp.height;
        const xVP = vp.vp_ul_x;
        const yVP = vp.vp_ul_y;
        const fb = vp.getFrameBuffer();
        const wFB = fb.width;
        const hFB = fb.height;

        console.log(format("fb_[w=%d,h=%d] vp_[x=%4d, y=%4d, w=%d,h=%d]  (x_pp=%4d, y_pp=%9.4f)  x_vp=%4d {y_low=%4d r=%.4f g=%.4f b=%.4f} {y_hi =%4d r=%.4f g=%.4f b=%.4f}\n",
                     wFB, hFB,      xVP,   yVP,   wVP, hVP,    xpp,     ypp,        xvp,     y1vp,    r1,    g1,    b1,      y2vp,    r2,    g2,    b2));
    }
}


   /**
      Log two anti-aliased pixels from a "vertical" line
      that is being rasterized along the y-axis.

      @param {number} xpp   horizontal coordinate of the pixel in the pixel-plane
      @param {number} ypp   vertical coordinate of the pixel in the pixel-plane
      @param {number} x1vp  horizontal coordinate of the first anti-aliased pixel in the {@link FrameBuffer.Viewport}
      @param {number} x2vp  horizontal coordinate of the second anti-aliased pixel in the {@link FrameBuffer.Viewport}
      @param {number} yvp   vertical coordinate of the anti-aliased pixels in the {@link FrameBuffer.Viewport}
      @param {number} r1     red component of the first anti-aliased pixel's {@link Color}
      @param {number} g1     green component of the first anti-aliased pixel's {@link Color}
      @param {number} b1     blue component of the first anti-aliased pixel's {@link Color}
      @param {number} r2     red component of the second anti-aliased pixel's {@link Color}
      @param {number} g2     green component of the second anti-aliased pixel's {@link Color}
      @param {number} b2     blue component of the second anti-aliased pixel's {@link Color}
      @param {Viewport} vp   that the pixel is being placed in
   */
export function logPixelsXAA(xpp, ypp, x1vp, x2vp, yvp, r1, g1, b1, r2, g2, b2, vp)
{
    if (debugScene || debugPosition)
    {
        const wVP = vp.width;
        const hVP = vp.height;
        const xVP = vp.vp_ul_x;
        const yVP = vp.vp_ul_y;
        const fb = vp.getFrameBuffer();
        const wFB = fb.width;
        const hFB = fb.height;

        console.log(format("fb_[w=%d,h=%d] vp_[x=%4d, y=%4d, w=%d,h=%d]  (x_pp=%9.4f, y_pp=%4d)  y_vp=%4d {x_low=%4d r=%.4f g=%.4f b=%.4f} {x_hi =%4d r=%.4f g=%.4f b=%.4f}\n",
                     wFB, hFB,      xVP,   yVP,   wVP, hVP,    xpp,       ypp,      yvp,     x1vp,    r1,    g1,    b1,      x2vp,    r2,    g2,    b2));
    }
}


/**
 * Set debugScene to be the specified value.
 * @param {boolean} val the value to set debugScene to be
 */
export function setDebugScene(val)
{
    debugScene = val;
}


/**
 * Set debugPosition to be the specified value.
 * @param {boolean} val the value to set debugPosition to be
 */
export function setDebugPosition(val)
{
    debugPosition = val;
}
