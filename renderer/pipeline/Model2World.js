//@ts-check

/**
 * Renderer 11. the MIT Licens.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
 */

import {Matrix, Model, Vertex} from "../scene/SceneExport.js";

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
export default function model2world(model, ctm)
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