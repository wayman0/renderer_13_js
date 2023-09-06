/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Rasterize a clipped {@link Point} into shaded pixels
   in a {@link FrameBuffer.Viewport}, but do not rasterize
   any part of the {@link Point} that is not contained in
   the {@link Camera}'s view rectangle.
*/

//@ts-check
import {rastDebug, doGamma, logMessage, logPixelMessage} from "./PipelineExport.js";
import {Model, Point, LineSegment, Primitive} from "../scene/SceneExport.js";
import {Viewport, Color} from "../framebuffer/FramebufferExport.js";
import {format} from "../scene/util/UtilExport.js";

/**
 * rasterize a point into shaded pixels in a viewport
 * @param {Model} model the model containing the point
 * @param {Point} pt the point to be rasterized
 * @param {Viewport} vp the viewport to recieve the rasterized point
 */
export default function rasterize(model, pt, vp)
{
    const CLIPPED = " : Clipped";
    const NOT_CLIPPED = "";

    const bg = Color.convert2Float(vp.bgColorVP);  //vp.bgColorVP.convert2Float();

    const w = vp.width;
    const h = vp.height;

    const vIndex = pt.vIndexList[0];
    const v = model.vertexList[vIndex];

    const cIndex = pt.cIndexList[0];
    const c = Color.convert2Float(model.colorList[cIndex]); //model.colorList[cIndex].convert2Float().getRGBComponents();
    let r = c[0], g = c[1], b = c[2];

    if (doGamma)
    {
        let newC = (Color.applyGamma(model.colorList[cIndex])).getRGBComponents();

        r = newC[0];
        g = newC[1];
        b = newC[2];
    }

    let x = .5 + w/2.001 * (v.x + 1);
    let y = .5 + h/2.001 * (v.y + 1);

    if (rastDebug)
    {
        logMessage(format("(x_pp, y_pp) = (%9.4f, %9.4f)", x, y));
    }

    x = Math.round(x);
    y = Math.round(y);

    const radius = pt.radius;

    //for( let y_ = Math.trunc(y - radius); y_ <= Math.trunc(y + radius); ++y_)
    //for (let x_ = Math.trunc(x - radius); x_ <= Math.trunc(x + radius); ++x_)

    for(let y_ = Math.trunc(y) - radius; y_ <= Math.trunc(y) + radius; ++y_)
    {
        for(let x_ = Math.trunc(x) - radius; x_ <= Math.trunc(x) + radius; ++x_)
        {
            if (rastDebug)
            {
                let clippedMessage;

                if (x_ > 0 && x_ <= w && y_ > 0 && y_ <= h)
                {
                    clippedMessage = NOT_CLIPPED;
                }
                else
                {
                    clippedMessage = CLIPPED;
                }

                logPixelMessage(clippedMessage, x, y, x_-1, h -y_, r, g, b, vp);
            }

            const isFloat = r <= 1 && g <= 1 && b <= 1;
            if (x_ > 0 && x_ <= w && y_ > 0 && y_ <= h)
            {
                // have to check if the color is in int or float representation
                vp.setPixelVP(x_-1, h-y_, new Color(r, g, b, isFloat? 1:255, isFloat));
            }
        }
    }
}