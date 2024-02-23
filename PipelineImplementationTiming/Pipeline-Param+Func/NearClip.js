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
import {Camera, Model, Primitive, LineSegment, Point, Position} from "../../renderer/scene/SceneExport.js";

export var /**@type {boolean} doNearClipping whether to do near clipping */ doNearClipping = true;
export var /**@type {boolean} nearDebug whether to debug near clipping */ nearDebug = false;

let mod;
let cam;

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

 * @param {Primitive} prim the primitive to be near clipped
 * @returns {Primitive|undefined} the clipped primitive
 */
export function clipModel(prim)
{
    if (!doNearClipping)
        return mod;

    let pClipped = undefined;
    if (prim instanceof LineSegment)
        pClipped = NearLine(mod, /**@type {LineSegment}*/(prim), cam);
    else if(prim instanceof Point)
        pClipped = NearPoint(mod, /**@type {Point}*/(prim),      cam);

    if (pClipped != undefined)
    {
        logPrimitive("3. Near_Clipped (accept)", mod, pClipped);
        return pClipped;
    }
    else
        logPrimitive("3. Near_Clipped (reject)", mod, prim);
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

    mod = model;
    cam = camera;

    const mod2 = new Model( model.vertexList, 
                            model.primitiveList.map(clipModel)
                                               .filter(() => {return p != undefined && p != null}), 
                            Array.from(model.colorList), 
                            model.matrix,
                            model.nestedModels, 
                            model.name, 
                            model.visible);

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
