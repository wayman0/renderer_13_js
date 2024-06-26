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
import {NearLine, NearPoint, logColorList, logMessage, logPrimitive, logPrimitiveList, logVertexList} from "./PipelineExport.js";
import {Camera, Model, Primitive, LineSegment, Point, Position} from "../scene/SceneExport.js";

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
export function clipModel(model, camera)
{
    if (!doNearClipping)
    {
        return model;
    }

    const newColorList = Array.from(model.colorList);
    const model2 = new Model(model.vertexList,
                             model.primitiveList,
                             newColorList,
                             model.matrix,
                             model.nestedModels,
                             model.name,
                             model.visible);

    const newPrimitiveList = new Array();
    
    for (const p of model2.primitiveList)
    {
        logPrimitive("3. Near_Clipping", model2, p);
    
        let pClipped = undefined;
        if (p instanceof LineSegment)
        {
            pClipped = NearLine(model2, /**@type {LineSegment}*/(p), camera);
        }
        else
        {
            pClipped = NearPoint(model2, /**@type{Point}*/(p), camera);
        }
    
        if (pClipped != undefined)
        {
            newPrimitiveList.push(pClipped);
            //console.log("Not CLIPPED")
            logPrimitive("3. Near_Clipped (accept)", model2, pClipped);
        }
        else
        {
            //console.log("CLIPPED")
            logPrimitive("3. Near_Clipped (reject)", model2, p);
        }
    }

    return new Model(model2.vertexList,
                    newPrimitiveList,
                    model2.colorList,
                    model2.matrix,
                    model2.nestedModels,
                    model2.name,
                    model2.visible);
}

/**
 * Recursively clip a {@link Position} at the {@link Camera}'s near plane.
 * <p>
 * This method does a pre-order, depth-first-traversal of the tree of
 * {@link Position}'s rooted at the parameter {@code position}.
 * 
 * @param {Position} position  the current {@link Position} object to recursively clip
 * @param {Camera} camera  {@link Camera} that determines the near clipping plane
 * @return {Position} a tree of clipped {@link Position} objects
 * 
 */
export function clipPosition(position, camera)
{
    logMessage("==== 4. Render position: " + position.name + " ====");
    
    // create a new position to hold the newly rendered model and the newly rendered sub Postions
    const pos2 = Position.buildFromModelName(position.model, position.name);

    // if this model is visible render this positions model
    if(position.model.visible)
        pos2.model = clipNestedModel(position.model, camera);
    else
        logMessage("====== 4. Hidden Model: " + position.model.name + " ======");

    // do a preorder depth first traversal from this nested position
    for(const pos of position.nestedPositions)
        pos2.addNestedPosition(clipPosition(pos, camera));

    logMessage("==== 4. End position: " + position.name + " ====");

    return pos2;
}

/**
 * Recursively clip a {@link Model} at the {@link Camera}'s near plane.
 * <p>
 * This method does a pre-order, depth-first-traversal of the tree of
 * {@link Model}'s rooted at the parameter {@code model}.
 * 
 * @param {Model} model  the current {@link Model} object to recursively clip
 * @param {Camera} camera  {@link Camera} that determines the near clipping plane
 * @return {Model} a tree of clipped {@link Model} objects
*/
export function clipNestedModel(model, camera)
{
    logMessage("==== 4. Near Clip model: " + model.name + " ====");

    const mod2 = clipModel(model, camera);

    logVertexList("4. Near Clipped  ", mod2);
    logColorList("4. Near Clipped  ", mod2);
    logPrimitiveList("4. Near Clipped  ", mod2);

    // recursivly clip every nested model of this model.

    // a new model list to hold the transformed nested models.
    const newNestedModelList = new Array();

    // do a pre order depth first traversal from this nested position
    for(const m of model.nestedModels)
        newNestedModelList.push(clipNestedModel(m, camera));

    logMessage("==== 4. End Model: " + mod2.name + " ====");

    return new Model(mod2.vertexList, 
                     mod2.primitiveList, 
                     mod2.colorList, 
                     mod2.matrix,
                     newNestedModelList,
                     mod2.name, 
                     mod2.visible);
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
