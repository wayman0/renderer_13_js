//@ts-check

/**
 * Renderer 11. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
 */

import {Camera, Model} from "../scene/SceneExport.js";


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
export default function world2view(model, camera)
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