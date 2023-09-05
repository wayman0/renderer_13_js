/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import {LineSegment, Model, Vertex} from "../scene/SceneExport.js";

export default class Circle extends Model
{
    /**@type {number} */r;
    /**@type {number} */n;

    /**
     *
     * @param {number} rad
     * @param {number} num
     */
    constructor(rad = 1, num = 16)
    {
        super(undefined, undefined, undefined, "Circle(" + rad + "," + num + ")");

        if (typeof rad != "number" ||
            typeof num != "number")
               throw new Error("All parameters must be numerical");

        if(num < 3)
            throw new Error("N must be greater than 3");

        this.r = rad;
        this.n = num;

        const deltaTheta = (2 * Math.PI)/this.n;

        for (let i = 0; i < this.n; ++i)
        {
            this.addVertex(new Vertex(this.r * Math.cos(i * deltaTheta),
                                      this.r * Math.sin(i * deltaTheta),
                                      0));
        }

        for (let i = 0; i < this.n - 1; ++i)
        {
            this.addPrimitive(LineSegment.buildVertex(i, i + 1));
        }

        this.addPrimitive(LineSegment.buildVertex(this.n-1, 0));
    }
}