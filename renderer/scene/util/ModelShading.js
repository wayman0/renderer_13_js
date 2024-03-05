/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   This is a library of static methods that
   add color shading to a {@link Model}.
*/

//@ts-check
import {Camera, Matrix, Model, OrthoNorm, PerspNorm, Position, Scene, Vector, Vertex} from "../SceneExport.js";
import {Color} from "../../framebuffer/FramebufferExport.js";

/**
 * Set each vertex in the model to be the same color.
 *
 * @param {Model} model the model whose colors are to be changed
 * @param {Color} color the color to set all the vertexes to be
 */

export function setColor(model, color)
{
    if (model instanceof Model == false)
        throw new Error("Model must be a Model");

    if (color instanceof Color == false)
        throw new Error("Color must be a Color");

    if (model.getColorList().length == 0)
    {
        for (let i = 0; i < model.getVertexList().length; i += 1)
        {
            model.addColor(color);
		}
    }
    else
    {
        for (let i = 0; i < model.getColorList().length; i += 1)
        {
            model.getColorList()[i] = color;
		}
	}

    for(const m of model.nestedModels)
        setColor(m, color);
}


/**
 * Set each vertex in the model to be the same random color.
 *
 * @param {Model} model the model whose color is to be changed
 */
export function setRandomColor(model)
{
    setColor(model, randomColor());
}

/**
 * Set each {@link Color} in the {@link Model} color list 
 * to a different random {@link Color}
 * 
 * @param {Model} model whose color list is being manipulated 
 */
export function setRandomColors(model)
{
    if(model instanceof Model == false)
        throw new Error("Model must be a model");

    if(model.colorList.length == 0)
    {
        for(let i = 0; i < model.vertexList.length; ++i)
            model.colorList[i] = randomColor();
    }
    else
    {
        for(let i = 0; i < model.colorList.length; ++i)
            model.colorList[i] = randomColor();
    }

    for(const m of model.nestedModels)
        setRandomColors(m);
}


/**
 * Give each of this kModels nested models a different random color
 *
 * @param {Model} model whose color list is being manipualted
 */
export function setRandomNestedModelColors(model)
{
    const c = randomColor();

    if(model.colorList.length == 0)
    {
        for(let i = 0; i < model.vertexList.length; ++i)
            model.colorList[i] = c;
    }
    else
    {
        for(let i = 0; i < model.colorList.length; ++i)
            model.colorList[i] = c;
    }

    for(const m of model.nestedModels)
        setRandomNestedModelColors(m);
}

/**
 * Set each vertex to have a different random color.
 * NOTE: This will destroy the color structure of the model.
 *
 * @param {Model} model the model whose colors are to be changed
 */
export function setRandomVertexColor(model)
{
    if (model instanceof Model == false)
        throw new Error("Model must be a Model");

    model.getColorList().length = 0;
    for (let i = 0; i < model.getVertexList().length; i += 1)
    {
        model.addColor(randomColor());
	}

    for( let p of model.getPrimitiveList())
    {
        for (let i = 0; i < p.getVertexIndexList().length; i += 1)
        {
            p.getColorIndexList()[i] = p.getVertexIndexList()[i];
		}
    }

    for(const m of model.nestedModels)
        setRandomVertexColor(m);
}


/**
 * Set each primitive to be a different random color.
 * NOTE: This will destroy the color structure of the model.
 *
 * @param {Model} model the model whose colors are to be changed
 */
export function setRandomPrimitiveColor(model)
{
    if (model instanceof Model == false)
        throw new Error("Model must be a model");

    model.getColorList().length = 0;
    let cIndex = 0;
    for (let p of model.getPrimitiveList())
    {
        model.addColor(randomColor());
        for (let i = 0; i < p.getColorIndexList().length; i += 1)
        {
            p.getColorIndexList()[i] = cIndex;
		}
        ++cIndex;
    }

    for(const m of model.nestedModels)
        setRandomPrimitiveColor(m);
}


/**
 * Set each primitive to be a random color, this creates a
 * 'rainbow primitive' effect.
 * NOTE: This will destory the color structure of the model.
 *
 * @param {Model} model the model whose colors are to be changed
 */
export function setRainbowPrimitiveColors(model)
{
    if (model instanceof Model == false)
        throw new Error("Model must be a Model");

    model.getColorList().length = 0;
    let cIndex = 0;
    for (let p of model.getPrimitiveList())
    {
        for (let i = 0; i < p.getColorIndexList().length; ++i)
        {
            model.addColor(randomColor());
            p.getColorIndexList()[i] = cIndex;
            ++cIndex;
        }
    }

    for(const m of model.nestedModels)
        setRainbowPrimitiveColors(m);
}


/**
 * Create a random color by randomly generating a r, g, and b value.
 * @returns {Color} a random color
 */
export function randomColor()
{
    let r = Math.random() * 255;
    let g = Math.random() * 255;
    let b = Math.random() * 255;

    return new Color(r, g, b);
}

