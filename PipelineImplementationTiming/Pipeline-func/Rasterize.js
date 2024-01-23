/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Rasterize a projected geometric {@link Primitive}
   into shaded pixels in a {{@link FrameBuffer.Viewport}.
*/

//@ts-check
import {RastLine, RastPoint, logPrimitive} from "./PipelineExport.js";
import {Model, LineSegment, Primitive, Point} from "../../renderer/scene/SceneExport.js";
import {Viewport} from "../../renderer/framebuffer/FramebufferExport.js";

/**@type {boolean} */export var rastDebug = false;
/**@type {boolean} */export var doAntiAliasing = false;
/**@type {boolean} */export var doGamma = true;
/**@type {number} */export var GAMMA = 2.2;

/**
 * Rasterize every clipped primitive into shadded pixels in the viewport.
 *
 * @param {Model} model the model containing the primitives to be rasterized
 * @param {Viewport} vp the viewport to recieve the rasterized primitive
 */
export function rasterize(model, vp)
{
    model.primitiveList.forEach( 
                        (p) => 
                        {
                            logPrimitive("6. Rasterize", model, p);

                            if (p instanceof LineSegment)
                                RastLine(model, p, vp);
                            else if (p instanceof Point)
                                RastPoint(model, p, vp);
                            else
                                console.log("Incorrect Primitive: " + p);
                        });
    /*
    for (const p of model.primitiveList)
    {
        logPrimitive("6. Rasterize", model, p);

        if (p instanceof LineSegment)
        {
            RastLine(model, p, vp);
        }
        else if (p instanceof Point)
        {
            RastPoint(model, p, vp);
        }
        else
        {
            console.log("Incorrect Primitive: " + p);
        }
    }
    */
}


/**
 * Set rastDebug to be the specified value
 * @param {boolean} val the value to set rastDebug to be
 */
export function setRastDebug(val)
{
    rastDebug = val;
}


/**
 * Set doAntiAliasing to be the given value
 * @param {boolean} val the value to set doAntiAliasing to be
 */
export function setDoAntiAliasing(val)
{
    doAntiAliasing = val;
}


/**
 * Set doGamma to be the specified value
 * @param {boolean} val the value to set doGamma to be
 */
export function setDoGamma(val)
{
    doGamma = val;
}