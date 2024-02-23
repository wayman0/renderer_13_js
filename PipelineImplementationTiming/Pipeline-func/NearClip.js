/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Clip in camera space any {@link Primitive} that crosses
   the camera's near clipping plane {@code z = -near}.
*/

//@ts-check
import {NearLine, NearPoint, logPrimitive, logPrimitiveList} from "./PipelineExport.js";
import {Camera, Model, Primitive, LineSegment, Point} from "../../renderer/scene/SceneExport.js";

export var /**@type {boolean} doNearClipping whether to do near clipping */ doNearClipping = true;
export var /**@type {boolean} nearDebug whether to debug near clipping */ nearDebug = false;

/**
 *  Start with a {@link Model} that contains {@link Primitive}s
      that have been transformed into camera space.
   <p>
      If a transformed {@link Primitive} crosses the camera's
      near plane, then replace that {@link Primitive}, in the
      {@link Model}'s list of primitives, with one that has been
      clipped so that it lies completely in the far side of the
      camera's near plane (the side of the near plane away from
      the camera).
   <p>
      If a transformed {@link Primitive} is completely in the
      camera side of the near plane, then drop that
      {@link Primitive} from the {@link Model}'s list of primitives.
   <p>
      Return a {@link Model} for which every {@link Primitive} is
      completely on the far side of the camera's near plane.

 * @param {Model} model the model containing the primitives to be near clipped
 * @param {Camera} camera the camera containing the near plane
 * @returns {Model} the new model containng the clipped primitives
 */
export function clip(model, camera)
{
    if (!doNearClipping)
    {
        return model;
    }

    // have to implement this way because if pass new array(model.colorList()) get an error
    // if pass the reference to model.colorList() can mutate the color list
    /*
    const newColorList = new Array();
    for (let x = 0; x < model.colorList.length; x += 1)
    {
        newColorList[x] = model.colorList[x];
    }
    */

    const newColorList = Array.from(model.colorList);
    const model2 = new Model(model.vertexList,
                             model.primitiveList,
                             newColorList,
                             undefined, 
                             undefined, 
                             model.name,
                             model.visible);

    //const newPrimitiveList = new Array();
    //
    //for (const p of model2.primitiveList)
    //{
    //    logPrimitive("3. Near_Clipping", model2, p);
    //
    //    let pClipped = undefined;
    //    if (p instanceof LineSegment)
    //    {
    //        pClipped = NearLine(model2, p, camera);
    //    }
    //    else
    //    {
    //        pClipped = NearPoint(model2, /**@type{Point}*/(p), camera);
    //    }
    //
    //    if (pClipped != undefined)
    //    {
    //        newPrimitiveList.push(pClipped);
    //        logPrimitive("3. Near_Clipped (accept)", model2, pClipped);
    //    }
    //    else
    //    {
    //        logPrimitive("3. Near_Clipped (reject)", model2, p);
    //    }
    //}

    // this method is slower
    // use map to map which primitives should be clipped,
    // however any primitive that is clipped is not returned
    // by the callback function and therefore the new return 
    // array at the clipped primitive index is set to be undefined by js
    // so then have to use a filter to filter out the js set undefined primitives
    
    // I don't believe just filter can be used because filter returns a subarray
    // which would cause mutative problems later on, whereas map returns a new array
    // and is therefore nonmutative.  Using filter after map is ok, because map
    // returns a new arrray and then filter returns a subarray of maps new array.
    const newPrimitiveList = model2.primitiveList.map( 
                             (p) => {
                                        logPrimitive("3. Near_Clipping", model2, p);
    
                                        let pClipped = undefined;
    
                                        if (p instanceof LineSegment)
                                            pClipped = NearLine( model2, /**@type {LineSegment}*/(p), camera);
                                        else if(p instanceof Point)
                                            pClipped = NearPoint(model2, /**@type {Point}*/(p),       camera);
    
                                        if (pClipped != undefined)
                                        {
                                            logPrimitive("3. Near_Clipped (accept)", model2, pClipped);
                                            return pClipped;
                                        }
                                        else
                                        {
                                            logPrimitive("3. Near_Clipped (reject)", model2, p);
                                        }
                                    })
                                    .filter((p) => { return p != undefined && p != null});

    return new Model(model2.vertexList,
                    newPrimitiveList,
                    model2.colorList,
                    undefined, 
                    undefined, 
                    model2.name,
                    model2.visible);
}


/**
 * Set whether or not to do nearClipping.
 * @param {boolean} val the value to set doNearClipping to be
 */
export function setDoNearClipping(val)
{
    doNearClipping = val;
}


/**
 * Set whether or not to debug near clipping.
 * @param {boolean} val the value to set nearDebug to be
 */
export function setNearDebug(val)
{
    nearDebug = val;
}
