/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import {LineSegment, Model, Vertex} from "../scene/SceneExport.js";
import {Color} from "../framebuffer/FramebufferExport.js";

export default class Axes3D extends Model
{
    /**
     *
     * @param {number} xMin
     * @param {number} xMax
     * @param {number} yMin
     * @param {number} yMax
     * @param {number} zMin
     * @param {number} zMax
     * @param {Color} cX
     * @param {Color} cY
     * @param {Color} cZ
     */
    constructor(xMin = -1,
                xMax = 1,
                yMin = -1,
                yMax = -1,
                zMin = -1,
                zMax = 1,
                cX = Color.white, cY = Color.white, cZ = Color.white)
    {
        super(undefined, undefined, undefined, "Axes 3D");

        if (typeof xMin != "number" ||
            typeof xMax != "number" ||
            typeof yMin != "number" ||
            typeof yMax != "number" ||
            typeof zMin != "number" ||
            typeof zMax != "number")
                throw new Error("All parameters besides cX, cY, cZ must be numerical");

        if (cX instanceof Color == false ||
            cY instanceof Color == false ||
            cZ instanceof Color == false)
                throw new Error("Axis colors must be of Color type");

        this.addVertex(new Vertex(xMin, 0, 0),
                       new Vertex(xMax, 0, 0),
                       new Vertex(0, yMin, 0),
                       new Vertex(0, yMax, 0),
                       new Vertex(0, 0, zMin),
                       new Vertex(0, 0, zMax));

        this.addColor(cX, cY, cZ);
        this.addPrimitive(LineSegment.buildVertexColor(0, 1, 0),
                          LineSegment.buildVertexColor(2, 3, 1),
                          LineSegment.buildVertexColor(4, 5, 2));
    }


    /**
     *
     * @returns {Axes3D}
     */
    static buildDefaultAxes()
    {
        return new Axes3D();
    }


    /**
     *
     * @param {number} xVal
     * @param {number} yVal
     * @param {number} zVal
     * @returns {Axes3D}
     */
    static buildEvenSizedAxes(xVal, yVal, zVal)
    {
        return new Axes3D(-xVal, xVal, -yVal, yVal, -zVal, zVal);
    }


    /**
     *
     * @param {number} xVal
     * @param {number} yVal
     * @param {number} zVal
     * @param {Color} c
     * @returns {Axes3D}
     */
    static build1ColorEvenSizedAxes(xVal, yVal, zVal, c)
    {
        return new Axes3D(-xVal, xVal, -yVal, yVal, -zVal, zVal, c, c, c);
    }


    /**
     *
     * @param {number} xVal
     * @param {number} yVal
     * @param {number} zVal
     * @param {Color} cx
     * @param {Color} cy
     * @param {Color} cz
     * @returns {Axes3D}
     */
    static build3ColorEvenSizedAxes(xVal, yVal, zVal, cx, cy, cz)
    {
        return new Axes3D(-xVal, xVal, -yVal, yVal, -zVal, zVal, cx, cy, cz);
    }


    /**
     *
     * @param {number} xMin
     * @param {number} xMax
     * @param {number} yMin
     * @param {number} yMax
     * @param {number} zMin
     * @param {number} zMax
     * @returns {Axes3D}
     */
    static buildSizedAxes(xMin, xMax, yMin, yMax, zMin, zMax)
    {
        return new Axes3D(xMin, xMax, yMin, yMax, zMin, zMax);
    }


    /**
     *
     * @param {number} xMin
     * @param {number} xMax
     * @param {number} yMin
     * @param {number} yMax
     * @param {number} zMin
     * @param {number} zMax
     * @param {Color} c
     * @returns {Axes3D}
     */
    static build1ColorSizedAxes(xMin, xMax, yMin, yMax, zMin, zMax, c)
    {
        return new Axes3D(xMin, xMax, yMin, yMax, zMin, zMax, c, c, c);
    }
}