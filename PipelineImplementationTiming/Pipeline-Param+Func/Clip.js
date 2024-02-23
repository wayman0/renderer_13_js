/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Clip a (projected) geometric {@link Primitive} that sticks out
   of the camera's view rectangle in the image plane. Interpolate
   {@link Vertex} color from any clipped off {@link Vertex} to the
   new {@link Vertex}.
*/

//@ts-check
import {LineClip, PointClip, logColorList, logMessage, logPrimitive, logPrimitiveList, logVertexList} from "./PipelineExport.js";
import {Model, Primitive, LineSegment, Point, Position} from "../../renderer/scene/SceneExport.js";

export var /**@type {boolean} whether to debug clipping */clipDebug = false;

let mod;

/**
      Start with a {@link Model} that contains {@link Primitive}s
      that have been projected onto the camera's view plane,
      {@code z = -1}.
   <p>
      If a projected {@link Primitive} sticks out of the camera's
      view rectangle, then replace that {@link Primitive}, in the
      {@link Model}'s list of primitives, with one that has been
      clipped so that it is contained in the view rectangle.
   <p>
      If a projected {@link Primitive} is completely outside of
      the view rectangle, then drop that {@link Primitive} from
      the {@link Model}'s list of primitives.
   <p>
      Return a {@link Model} for which every {@link Primitive} is
      completely contained in the camera's view rectangle.

 * @param {Primitive} prim the primitive to be clipped
 * @returns {Primitive | undefined} the clipped primitive
 */
export function clipModel(prim)
{
    logPrimitive("5. Clipping", mod, prim);

    let pClipped = undefined;
    if(prim instanceof LineSegment)
        pClipped = LineClip(mod, /**@type {LineSegment}*/ (prim));
    else if(prim instanceof Point)
        pClipped = PointClip(mod, /**@type {Point} */ (prim));

    if(pClipped != undefined)  
    {
        logPrimitive("5. Clipped (accept)", mod, pClipped);
        return pClipped;
    }
    else    
        logPrimitive("5. Clipped (reject)", mod, pClipped);
}

/**
 * Recursively clip a {@link Position}.
 * <p>
 * This method does a pre-order, depth-first-traversal of the tree of
 * {@link Position}'s rooted at the parameter {@code position}.
 *       
 * @param {Position} position  the current {@link Position} object to recursively clip
 * @return {Position} a tree of clipped {@link Position} objects
 */
export function clipPosition(position)
{
    logMessage("==== 6. Render position: " + position.name + " ====");

    // create a new position to hold the newly rendered model and the newly rendered sub positions
    const pos2 = Position.buildFromModelName(position.model, position.name);

    // render this positions model if it is visible
    if(position.model.visible)
        pos2.model = clipNestedModel(position.model);
    else
        logMessage("====== 6. Hidden model: " + position.model.name + " ======");

    // do a pre order depth first traversal from this nested position
    for(const pos of position.nestedPositions)
        pos2.addNestedPosition(clipPosition(pos));

    logMessage("==== 6. End position: " + position.name +  " ====");

    return pos2;
}

/**
 * Recursively clip a {@link Model}.
 * <p>
 * This method does a pre-order, depth-first-traversal of the tree of
 * {@link Model}'s rooted at the parameter {@code model}.
 *       
 * @param {Model} model  the current {@link Model} object to recursively clip
 * @return {Model} a tree of clipped {@link Model} objects
 */
export function clipNestedModel(model)
{
    logMessage("==== 6. Clip Model: " + model.name + " ====");

    const mod2 = new Model(model.vertexList, 
                            model.primitiveList.map(clipModel)
                                            .filter(() => {return p != undefined && p != null}),
                            model.colorList, 
                            model.matrix, 
                            model.nestedModels, 
                            model.name, 
                            model.visible);

    logVertexList("6. clipped  ", mod2);
    logColorList("6. Clipped  ", mod2);
    logPrimitiveList("6. Clipped  ", mod2);

    // recursively clip every nested model of this model

    // a new model list to hold the transformed nested models
    const newNestedModelList = new Array();

    // do a pre order depth first traversel from this nested position
    for(const m of model.nestedModels)
        newNestedModelList.push(clipNestedModel(m));

    logMessage("==== 6. End Model: " + mod2.name + " ====");

    return new Model(mod2.vertexList, 
                     mod2.primitiveList, 
                     mod2.colorList, 
                     mod2.matrix,
                     newNestedModelList,
                     mod2.name, 
                     mod2.visible);
}

/**
 * Set whether or not to debug clipping
 * @param {boolean} val the value to set clipDebug to be
 */
export function setClipDebug(val)
{
    clipDebug = val;
}