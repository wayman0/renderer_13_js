/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

import {Camera, Matrix, Model, OrthoNorm, PerspNorm, Position, Scene, Vector, Vertex} from "../SceneExport.js";
import {Primitive, Point, LineSegment, Points} from "../primitives/PrimitiveExport.js";
import {Color} from "../../framebuffer/FramebufferExport.js";

/**
   Convert a {@link Model} object into a point cloud {@link Model}.
<p>
   See <a href="https://en.wikipedia.org/wiki/Point_cloud" target="_top">
                https://en.wikipedia.org/wiki/Point_cloud</a>
*/

/**
 * Convert a model into a model made of only points.
 *
 * @param {Model} model
 * @param {number} [pointSize=0]
 * @returns {Model} the new model in the form of points
 */
export function make(model, pointSize = 0)
{
    if (model instanceof Model == false)
        throw new Error("Model must be a model");

    if (typeof pointSize != "number")
        throw new Error("Point Size must be a number");

    //have to copy the models vertex list into new vertex list
    let newVertexList = new Array();
    for (let x = 0; x < model.getVertexList().length; x += 1)
    {
        newVertexList[x] = model.vertexList[x];
	}

    let newColorList = new Array()
    for (let x = 0; x < model.getColorList().length; x += 1)
    {
        newColorList[x] = model.colorList[x];
	}

    let pointCloud = new Model(newVertexList,
                               new Array(),
                               newColorList,
                               undefined, 
                               undefined, 
                               "PointCloud: " + model.getName(),
                               model.visible);

    for(const p of model.primitiveList)
        pointCloud.addPrimitive(new Points(p.vIndexList, p.cIndexList));

    for(const p of pointCloud.primitiveList)
        /**@type {Points}*/ (p).radius = pointSize;

    for(const m of model.nestedModels)
        pointCloud.addNestedModel(make(m, pointSize));

    return pointCloud;
}
