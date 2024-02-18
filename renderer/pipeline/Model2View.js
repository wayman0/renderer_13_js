/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Transform each {@link Vertex} of a {@link Model} from the model's
   (private) local coordinate system to the {@link Camera}'s (shared)
   view coordinate system.
<p>
   For each {@code Vertex} object in a {@code Model} object, use the
   current model-to-view transformation {@link Matrix} to transform the
   object's {@code Vertex} coordinates from the model's coordinate
   system to the camera's view coordinate system.
*/

//@ts-check
import {Model, Position, Matrix, Vertex} from "../scene/SceneExport.js";

/**
 * Use the current model-to-view transformation {@link Matrix} to transform
   each {@link Vertex} from a {@link Model}'s coordinate system to
   the {@link Camera}'s view coordinate system.

 * @param {Position} position the position with the model
 * @param {Matrix} ctm the current model to view transformation matrix
 * @returns {Model} a new model with vertexes inside the cameras view coordinate system
 */
export function model2viewModel(position, ctm)
{
    const model = position.model;
    /*
    let newVertexList = new Array();
    for (let x = 0; x < model.vertexList.length; x += 1)
        newVertexList[x] = ctm.timesVertex(model.vertexList[x]);
   */
    
    // this method is slower
    // use map because we are 'mapping' from model space to view space and it is non mutative
    const newVertexList = model.vertexList.map( (v) => {return ctm.timesVertex(v);});
    

    return new Model(newVertexList,
                     model.primitiveList,
                     model.colorList,
                     position.name + "::" + model.name,
                     model.visible);
}

export function model2viewPosition()
{
   
}
