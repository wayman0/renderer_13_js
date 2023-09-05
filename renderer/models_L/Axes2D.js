/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import {LineSegment, Model, Vertex} from "../scene/SceneExport.js";
import {Color} from "../framebuffer/FramebufferExport.js";

export default class Axes2D extends Model
{
    /**
     *
     * @param {number} xMin
     * @param {number} xMax
     * @param {number} yMin
     * @param {number} yMax
     * @param {number} xMarks
     * @param {number} yMarks
     * @param {Color} cX
     * @param {Color} cY
     * @param {number} z
     */
    constructor(xMin = -1, xMax = 1, yMin = -1, yMax = 1, xMarks = 5, yMarks = 5, cX = Color.White, cY = Color.white, z = 0)
    {
        /** @type {Model} the model built by the constructuor*/
        super(undefined, undefined, undefined, "Axes 2D");

        if (typeof xMin != "number" ||
            typeof xMax != "number" ||
            typeof yMin != "number" ||
            typeof yMax != "number" ||
            typeof xMarks != "number" ||
            typeof yMarks != "number" ||
            typeof z != "number")
                throw new Error("All Parameters besides cX and cY must be numerical");

        if (cX instanceof Color == false ||
            cY instanceof Color == false)
                throw new Error("axis color must be a Color");

        this.addColor(cX, cY);
        this.addVertex(new Vertex(xMin, 0, z),
                       new Vertex(xMax, 0, z));
        this.addPrimitive(LineSegment.buildVertexColor(0, 1, 0));

        this.addVertex(new Vertex(0, yMin, z),
                       new Vertex(0, yMax, z));
        this.addPrimitive(LineSegment.buildVertexColor(2, 3, 1));

        let index = 4;

        let xDelta = (xMax - yMin)/xMarks;
        let yDelta = (yMax - yMin)/50;

        for (let x = xMin; x <= xMax; x += xDelta)
        {
            this.addVertex(new Vertex(x,  yDelta/2, z),
                           new Vertex(x, -yDelta/2, z));
            this.addPrimitive(LineSegment.buildVertexColor(index + 0, index + 1, 0));
            index += 2;
        }

        xDelta = (xMax - yMin)/50;
        yDelta = (yMax - yMin)/yMarks;
        for (let y = yMin; y <= yMax; y += yDelta)
        {
            this.addVertex(new Vertex( xDelta/2, y, z),
                           new Vertex(-xDelta/2, y, z));
            this.addPrimitive(LineSegment.buildVertexColor(index + 0, index + 1, 1));
            index += 2;
        }
    }


    /**
     *
     * @returns {Axes2D}
     */
    static buildDefaultAxes()
    {
        return new Axes2D();
    }


    /**
     *
     * @param {number} xMin
     * @param {number} xMax
     * @param {number} yMin
     * @param {number} yMax
     * @returns {Axes2D}
     */
    static buildSizedAxes(xMin, xMax, yMin, yMax)
    {
        return new Axes2D(xMin, xMax, yMin, yMax);
    }


    /**
     *
     * @param {number} xMin
     * @param {number} xMax
     * @param {number} yMin
     * @param {number} yMax
     * @param {number} xMarks
     * @param {number} yMarks
     * @returns {Axes2D}
     */
    static buildSpacedAxes(xMin, xMax, yMin, yMax, xMarks, yMarks)
    {
        return new Axes2D(xMin, xMax, yMin, yMax, xMarks, yMarks);
    }


    /**
     *
     * @param {number} xMin
     * @param {number} xMax
     * @param {number} yMin
     * @param {number} yMax
     * @param {number} xMarks
     * @param {number} yMarks
     * @param {Color} c
     * @returns {Axes2D}
     */
    static buildColorAxes(xMin, xMax, yMin, yMax, xMarks, yMarks, c)
    {
        return new Axes2D(xMin, xMax, yMin, yMax, xMarks, yMarks, c, c);
    }


    /**
     *
     * @param {number} xMin
     * @param {number} xMax
     * @param {number} yMin
     * @param {number} yMax
     * @param {number} xMarks
     * @param {number} yMarks
     * @param {Color} cX
     * @param {Color} cY
     * @returns {Axes2D}
     */
    static buildColorsAxes(xMin, xMax, yMin, yMax, xMarks, yMarks, cX, cY)
    {
        return new Axes2D(xMin, xMax, yMin, yMax, xMarks, yMarks, cX, cY);
    }
}