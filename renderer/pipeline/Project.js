/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Project each {@link Vertex} of a {@link Model} from camera
   coordinates to the {@link Camera}'s image plane {@code z = -1}.
<p>
   Let us derive the formulas for the perspective projection
   transformation (the formulas for the parallel projection
   transformation are pretty obvious). We will derive the
   x-coordinate formula; the y-coordinate formula is similar.
<p>
   Let {@code (x_c, y_c, z_c)} denote a point in the 3-dimensional
   camera coordinate system. Let {@code (x_p, y_p, -1)} denote the
   point's perspective projection into the image plane, {@code z = -1}.
   Here is a "picture" of just the xz-plane from camera space. This
   picture shows the point {@code (x_c, z_c)} and its projection to
   the point {@code (x_p, -1)} in the image plane.
<pre>{@code
           x
           |                             /
           |                           /
       x_c +                         + (x_c, z_c)
           |                       / |
           |                     /   |
           |                   /     |
           |                 /       |
           |               /         |
           |             /           |
       x_p +           +             |
           |         / |             |
           |       /   |             |
           |     /     |             |
           |   /       |             |
           | /         |             |
           +-----------+-------------+------------> -z
        (0,0)         -1            z_c
}</pre>
<p>
   We are looking for a formula that computes {@code x_p} in terms of
   {@code x_c} and {@code z_c}. There are two similar triangles in this
   picture that share a vertex at the origin. Using the properties of
   similar triangles we have the following ratios. (Remember that these
   are ratios of positive lengths, so we write {@code -z_c}, since
   {@code z_c} is on the negative z-axis).
<pre>{@code
                 x_p       x_c
                -----  =  -----
                  1       -z_c
}</pre>
<p>
   If we solve this ratio for the unknown, {@code x_p}, we get the
   projection formula,
<pre>{@code
                 x_p = -x_c / z_c.
}</pre>
<p>
   The equivalent formula for the y-coordinate is
<pre>{@code
                 y_p = -y_c / z_c.
}</pre>
*/

//@ts-check
import {Model, Vertex, Camera, Position} from "../scene/SceneExport.js";
import { logMessage, logVertexList } from "./PipelineLogger.js";

/**
 *  Project each {@link Vertex} from a {@link Model} to
    the {@link Camera}'s image plane {@code z = -1}.

 * @param {Model} model the model whose vertexes are to be projected
 * @param {Camera} camera the scenes camera object
 * @returns {Model} a new model containing the projected vertexes
 */
export function projectModel(model, camera)
{
   /*
    const newVertexList = new Array();
    for (let x = 0; x < model.vertexList.length; x += 1)
    {
        const v = model.vertexList[x];

        if (camera.perspective)
            newVertexList[x] = new Vertex(v.x/-v.z, v.y/-v.z, -1);
        else
            newVertexList[x] = new Vertex(v.x, v.y, 0);
    }
    */

    
    // this method is slower
    const newVertexList = model.vertexList.map(
                          (v) => {
                                    if(camera.perspective)
                                       return new Vertex(v.x/-v.z, v.y/-v.z, -1);
                                    else
                                       return new Vertex(v.x, v.y, 0);
                                 });
    

    return new Model(newVertexList,
                     model.primitiveList,
                     model.colorList,
                     model.matrix,
                     model.nestedModels,
                     model.name,
                     model.visible);
}

/**
 * Recursively project a {@link Position}.
 * <p>
 * This method does a pre-order, depth-first-traversal of the tree of
 * {@link Position}'s rooted at the parameter {@code position}.
 * 
 * @param {Position} position  the current {@link Position} object to recursively project
 * @param {Camera} camera    the {@link Scene}'s {@link Camera} with the view volume data
 * @return {Position} a tree of projected {@link Position} objects
*/
export function projectPosition(position, camera)
{
   logMessage("==== 5. Render position: " + position.name + " ====");

   //create a new position to hold the newly rendered model and the newly rendered sub positions
   const pos2 = Position.buildFromModelName(position.model, position.name);

   // render this positions model if it is visible
   if(position.model.visible)
      pos2.model = projectNestedModel(position.model, camera);
   else
      logMessage("====== 5. Hidden model: " + position.model.name + " ======");

   // do a preorder depth first traversal from this nested position
   for(const pos of position.nestedPositions)
      pos2.addNestedPosition(projectPosition(pos, camera));

   logMessage("==== 5. End position: " + position.name + " ====");

   return pos2;
}

/** 
 * Recursively project a {@link Model}.
 * <p>
 * This method does a pre-order, depth-first-traversal of the tree of
 * {@link Model}'s rooted at the parameter {@code model}.
 *       
 * @param {Model} model   the current {@link Model} object to recursively project
 * @param {Camera} camera  a reference to the {@link Scene}'s {@link Camera} object
 * @return {Model} a tree of projected {@link Model} objects
*/
function projectNestedModel(model, camera)
{
   logMessage("==== 5. Project model: " + model.name + " ====");

   const mod2 = projectModel(model, camera);

   logVertexList("5. Projected", mod2);

   // recursively project every nested model of this model

   // a new model list to hold the transformed nested models
   const newNestedModelList = new Array();

   // do a pre order depth first traversal from this nested position
   for(const m of model.nestedModels)
      newNestedModelList.push(projectNestedModel(m, camera));

   logMessage("==== 5. End Model: " + mod2.name + " ====");

   return new Model(mod2.vertexList, 
                    mod2.primitiveList, 
                    mod2.colorList, 
                    mod2.matrix,
                    newNestedModelList, 
                    mod2.name, 
                    mod2.visible);
}