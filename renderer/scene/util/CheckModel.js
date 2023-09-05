/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Several static utility methods for checking
   and/or debugging a {@link Model}.
*/
//@ts-check

import {Camera, Matrix, Model, OrthoNorm, PerspNorm, Position, Scene, Vector, Vertex} from "../SceneExport.js";
import {Primitive, Point, LineSegment} from "../primitives/PrimitiveExport.js";

/**
 *  Give this {@code Primitive} the uniform {@link java.awt.Color} indexed
    by the given color index.
    <p>
    NOTE: This method does not put a {@link java.awt.Color} object
    into this {@link Primitive}'s {@link renderer.scene.Model} object.
    This method assumes that the given index is valid (or will be valid
    by the time this {@link Primitive} gets rendered).

 * @param {Model} model  the model to be checked
 */
export function check(model)
{
    if (model instanceof Model == false)
        throw new Error("Model is not a Model");

    let error = false;
    if (model.getVertexList().length == 0 &&
        model.getPrimitiveList().length != 0)
    {
        console.log("***WARNING: This model does not have any vertices.");
        error = true;
    }

    if (model.getVertexList().length != 0 &&
        model.getPrimitiveList().length == 0)
    {
        console.log("***WARNING: This model does not have any primitives");
        error = true;
    }
    if (model.getVertexList().length != 0 &&
        model.getColorList().length == 0)
    {
        console.log("***WARNING: This model does not have any colors.");
        error = true;
    }

    if (error)
        console.log(model.toString());
}


/**
 *  Check each {@link Primitive} in the {@link Model} to make sure that
    each index in the {@link Primitive}'s {@code vIndexList} refers to a
    valid {@link Vertex} in the {@link Model}'s {@code vertexList} and
    also that each index in the {@link Primitive}'s {@code cIndexList}
    refers to a valid {@link java.awt.Color} in the {@link Model}'s
    {@code colorList}

 * @param {Model} model the model to be checked for consistent indexes
 * @returns {boolean} true if no error, false if there is an error
 */
export function checkPrimitives(model)
{
    if (model instanceof Model == false)
        throw new Error("Model must be a Model");

    const numberOfVertices = model.getVertexList().length;
    let result = true;

    for (let p of model.getPrimitiveList())
    {
        for (let i = 0; i < p.getVertexIndexList().length; ++i)
        {
            if (i >= numberOfVertices)
            {
                console.log("This Primitve has invalid Vertex index: " + i);
                console.log(p);
                result = false;
            }
        }
    }

    const numberOfColors = model.getColorList().length;
    for (let p of model.getPrimitiveList())
    {
        for (let i = 0; i < p.getColorIndexList().length; ++ i)
        {
            if (i >= numberOfColors)
            {
                console.log("This Primitve has invalid Color index: " + i);
                console.log(p);
                result = false;
            }
        }
    }

    return result;
}
