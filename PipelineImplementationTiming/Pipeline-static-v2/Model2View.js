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
import {Model, Position, Matrix, Vertex} from "../../renderer/scene/SceneExport.js";

import {upperLvl} from "./PipelineExport.js";

/**
 * Use the current model-to-view transformation {@link Matrix} to transform
   each {@link Vertex} from a {@link Model}'s coordinate system to
   the {@link Camera}'s view coordinate system.

 * @param {Vertex} vert the position with the model
 * @returns {Vertex} the transformed Vertex 
 */
export default function model2view(vert)
{
   return upperLvl[upperLvl.length-1].timesVertex(vert);
}
