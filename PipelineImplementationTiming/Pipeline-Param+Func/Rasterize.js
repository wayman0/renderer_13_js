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
import {RastLine, RastPoint, logMessage, logPrimitive} from "./PipelineExport.js";
import {Model, LineSegment, Primitive, Point, Position} from "../../renderer/scene/SceneExport.js";
import {Viewport} from "../../renderer/framebuffer/FramebufferExport.js";

/**@type {boolean} */export var rastDebug = false;
/**@type {boolean} */export var doAntiAliasing = false;
/**@type {boolean} */export var doGamma = true;
/**@type {number} */export var GAMMA = 2.2;

let viewport;
let mod;

/**
 * Rasterize every clipped primitive into shadded pixels in the viewport.
 *
 * @param {Primitive} prim the primitive to be rasterized
 */
export function rasterizeModel(prim)
{
        logPrimitive("6. Rasterize", mod, prim);

        if (prim instanceof LineSegment)
        {
            RastLine(mod, prim, viewport);
        }
        else if (prim instanceof Point)
        {
            RastPoint(mod, prim, viewport);
        }
        else
        {
            console.log("Incorrect Primitive: " + prim);
        }
}

/**
 * Recursively rasterize a {@link Position}.
 * <p>
 * This method does a pre-order, depth-first-traversal of the tree of
 * {@link Position}'s rooted at the parameter {@code position}.
 *       
 * @param {Position} position  the current {@link Position} object to recursively rasterize
 * @param {Viewport} vp       {@link FrameBuffer.Viewport} to hold rendered image of the {@link Scene}
 */
export function rasterizePosition(position, vp)
{
    logMessage("==== 7. Render Position: " + position.name + " ====");

    // render this positions model if the model is visible
    if(position.model.visible)
        rasterizeNestedModel(position.model, vp);
    else
        logMessage("====== 7. Hidden model: " + position.model.name + " ======");

    // do a pre order depth first traversal from this nested position
    for(const pos of position.nestedPositions)
        rasterizePosition(pos, vp);

    logMessage("==== 7. End position: " + position.name + " ====");
}

/**
 * Recursively rasterize a {@link Model}.
 * <p>
 * This method does a pre-order, depth-first-traversal of the tree of
 * {@link Model}'s rooted at the parameter {@code model}.
 *       
 * @param {Model} model  the current {@link Model} object to recursively rasterize
 * @param {Viewport} vp     {@link FrameBuffer.Viewport} to hold rendered image of the {@link Scene}
 */
export function rasterizeNestedModel(model, vp)
{
    logMessage("==== 7. Rasterize model: " + model.name + " ====");
    
    viewport = vp;
    mod = model;
    model.primitiveList.forEach(rasterizeModel);

    // recursively rasterize every nested model of this model

    // do a pre order depth first traversal from this nested position
    for(const m of model.nestedModels)
        rasterizeNestedModel(m, vp);

    logMessage("==== 7. End Model: " + model.name + " ====");
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