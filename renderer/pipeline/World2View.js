//@ts-check

/**
 * Renderer 11. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
 */

import {Camera, Position, Model} from "../scene/SceneExport.js";
import { logMessage, logVertexList } from "./PipelineLogger.js";


/**
   Transform each {@link Vertex} of a {@link Model} from the world
   coordinate system to the {@link Camera}'s view coordinate system.
<p>
   For each {@code Vertex} object in a {@code Model} object, use the
   {@link Camera}'s world-to-view translation {@link Vector} to transform
   the object's {@code Vertex} coordinates from the world coordinate
   system to the camera's view coordinate system.
*/

/**
   Use a {@link Camera}'s world-to-view translation {@link Vector} to
   transform each {@link Vertex} from the world coordinate system to
   the camera's view coordinate system.

   @param {Model} model   {@link Model} with {@link Vertex} objects in the world coordinate system
   @param {Camera} camera  a {@link Camera} with a translation {@link Vector}
   @return {Model} a new {@link Model} with {@link Vertex} objects in the {@link Camera}'s view coordinate system
*/
export function world2viewModel(model, camera)
{
    // We translate each vertex in the opposite
    // direction of what the camera was translated by
    const negViewVector = camera.getViewVector().timesConstant(-1);

    // A new vertex list to hold the transformed vertices
    const newVertexList = new Array();

    // Replace each Vertex object with one that
    // contains veiw coordinates
    for(const v of model.vertexList)
        // We translate the vertex in the opposite direction
        // of what the camera was translated by
        newVertexList.push(negViewVector.plusVertex(v));
    
    return new Model(newVertexList, 
                     model.primitiveList, 
                     model.colorList, 
                     model.matrix, 
                     model.nestedModels,
                     model.name, 
                     model.visible);
}

/**
 * Recursively transform a {@link Position}.
 * <p>
 * This method does a pre-order, depth-first-traversal of the tree of
 * {@link Position}'s rooted at the parameter {@code position}.
 * 
 * @param {Position} position the current {@link Position} object to recursively transform
 * @param {Camera} camera the {@link Scene}'s {@link Camera} with its location data
 * @return {Position} a tree of transformed {@link Position} objects
 */
export function world2viewPosition(position, camera)
{
   logMessage("==== 2. Render position: " + position.name + " ====");

   // create a new position to hold the newly rendered model and rendered sub positions
   const pos2 = Position.buildFromModelName(position.model, position.name);

   // if this positions model is visible render it
   if(position.model.visible)
      pos2.model = world2viewNestedModel(position.model, camera);
   else
      logMessage("====== 2. Hidden model: " + position.model.name + " ======");

   // do a preorder depth first traversal from this nested position
   for(const pos of position.nestedPositions)
      pos2.addNestedPosition(world2viewPosition(pos, camera));

   logMessage("==== 2. End position: " + position.name + " ====");

   return pos2;
}

/**
 * Recursively transform a {@link Model}.
 * <p>
 * This method does a pre-order, depth-first-traversal of the tree of
 * {@link Model}'s rooted at the parameter {@code model}.
 * 
 * @param {Model} model the current {@link Model} object to recursively transform
 * @param {Camera} camera the {@link Scene}'s {@link Camera} with the view volume data
 * @return {Model} a tree of transformed {@link Model} objects
 */
function world2viewNestedModel(model, camera)
{
   logMessage("==== 2. World-to-View transformation of: " + model.name + " ====");

   const mod2 = world2viewModel(model, camera);
   logVertexList("2. View    ", mod2);

   // recursively transform every nested model of this model

   // a new model list to hold the transformed nested models
   const newNestedModelList = new Array();

   // do a preorder depth first traversal from this model.
   for(const m of model.nestedModels)
      newNestedModelList.push(world2viewNestedModel(m, camera));

   logMessage("==== 2. End Model: " + mod2.name + " ====");

   return new Model(mod2.vertexList, 
                    mod2.primitiveList, 
                    mod2.colorList,
                    mod2.matrix,
                    newNestedModelList,
                    mod2.name, 
                    mod2.visible)
}