//@ts-check

/**
 * Renderer 11. the MIT Licens.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
 */

import {Position, Matrix, Model, Vertex} from "../scene/SceneExport.js";
import { check } from "../scene/util/CheckModel.js";
import { DEFAULT_COLOR } from "./Pipeline2.js";
import {logMessage, logVertexList} from "./PipelineLogger.js";

/**
   Transform each {@link Vertex} of a {@link Model} from the model's
   (private) local coordinate system to the (shared) world coordinate
   system.
<p>
   For each {@code Vertex} object in a {@code Model} object, use the
   current model-to-world transformation {@link Matrix} to transform
   the object's {@code Vertex} coordinates from a model's coordinate
   system to the world coordinate system.
*/

/**
 * Use the current model-to-world transformation {@link Matrix} to
 * transform each {@link Vertex} from a {@link Model}'s coordinate
 * system to the world coordinate system.
 * 
 * @param {Model} model {@link Model} with {@link Vertex} objects in model coordinate
 * @param {Matrix} ctm  the current model-to-world transofrmation {@link Matrix}
 * 
 * @return {Model} a new {@link Model} with {@link Vertex} objects in the world coordinate system
 */
export function model2worldModel(model, ctm)
{
    const newVertexList = new Array();

    for(const v of model.vertexList)
        newVertexList.push(ctm.timesVertex(v));

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
 * <p>
 * The pre-order "visit node" operation in this traversal first updates the
 * "current transformation matrix", ({@code ctm}), using the {@link Matrix}
 * in {@code position} and then transforms the {@link Model} in {@code position}
 * using the updated {@code ctm}.
 * 
 * @param {Position} position 
 * @param {Matrix} ctm 
 * @return {Position} a tree of transformed {@link Position} objects
 */
export function model2worldPosition(position, ctm)
{
   // opening message
   logMessage("==== 1. Render position: " + position.name + " ====");
   logMessage("---- Transformation matrix: \n" + position.matrix.toString());

   // update the current model to world transformation matrix
   const ctm2 = ctm.timesMatrix(position.matrix);

   // create a new position to hold the newly rendered model and sub positions
   let pos2 = Position.buildFromModelName(position.model, position.name);
   if(position.model.visible)
      // if this model is visible then render it
      pos2.model = model2worldNestedModel(position.model, ctm2);
      //pos2 = Position.buildFromModelName(model2worldNestedModel(position.model, ctm2), position.name);   
   else
   {   
      logMessage("====== 1. Hidden model: " + position.model.name + " ======");
      pos2 = Position.buildFromModelName(position.model, position.name);
   }

   // do a pre-order, depth first traversal from this nested Position
   for(const pos of position.nestedPositions)
   {
      if(pos.visible)
      {
         const m2wPos = model2worldPosition(pos, ctm2);
         pos2.addNestedPosition(m2wPos);
      }
      else
         logMessage("==== 1. Hidden position: " + pos.name + " ====");
   }

   // closing message
   logMessage("==== 1. End position: " + position.name + " ====");

   return pos2;
}

/**
 * This method does a pre-order, depth-first-traversal of the tree of
 * {@link Model}'s rooted at the parameter {@code model}.
 * <p>
 * The pre-order "visit node" operation in this traversal first updates the
 * "current transformation matrix", ({@code ctm}), using the {@link Matrix}
 * in {@code model} and then renders the geometry in {@code model}
 * using the updated {@code ctm} in the {@link Model2View} stage.
 * 
 * @param {Model} model 
 * @param {Matrix} ctm
 * @return {Model} a tree of transformed {@link Model} objects 
 */
export function model2worldNestedModel(model, ctm)
{
   logMessage("====== 1. Modeltoworld transformation of: " + model.name + " ======");
   check(model);

   // mostly for compatibility with renderers 1 through 3
   if(model.colorList.length == 0 && model.vertexList.length != 0)
   {
      for(let i = 0; i < model.vertexList.length; ++i)
         model.addColor(DEFAULT_COLOR);

      console.log("***WARNING: Added default color to model: " + model.name + ".");
   }

   logVertexList("0. Model    ", model);

   // update the current model to view transformation matrix
   const ctm2 = ctm.timesMatrix(model.matrix);
   const mod2 = model2worldModel(model, ctm2);

   logVertexList("1. World    ", mod2);

   // recursively transform every nested model of this model

   // a new model list to hold the transformed nested models
   const newNestedModelList = new Array();

   // do a pre-order, depth first traversal from this model
   for(const mod of model.nestedModels)
   {
      if(mod.visible)
         newNestedModelList.push(model2worldNestedModel(mod, ctm2));
      else
         logMessage("====== 1. Hidden model: " + mod.name + " ======");
   }

   logMessage("====== 1. End Model: " + mod2.name + " ======");

   return new Model(mod2.vertexList, 
                    mod2.primitiveList, 
                    mod2.colorList, 
                    Matrix.identity(),
                    newNestedModelList,
                    mod2.name, 
                    mod2.visible);
}
