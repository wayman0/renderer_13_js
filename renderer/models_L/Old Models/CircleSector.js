/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import {LineSegment, Model, Vertex} from "../scene/SceneExport.js";
import Circle from "./Circle.js";

export default class CircleSector extends Model
{
    /**@type{number}*/ r
    /**@type{number}*/ theta1
    /**@type{number}*/ theta2
    /**@type{number}*/ n

    /**
     *
     * @param {number} rad
     * @param {number} t1
     * @param {number} t2
     * @param {number} num
     */
    constructor(rad = 1, t1 = 0, t2 = Math.PI, num = 8)
    {
        super(undefined, undefined, undefined, "Circle Sector(r=" + rad + "theta1=" + t1 + "theta2=" + t2 + "n=" + num);

        if (typeof rad != "number" ||
            typeof num != "number" ||
            typeof t1 != "number"  ||
            typeof t2 != "number")
                throw new Error("All parameters must be numerical");

        if (num < 4)
            throw new Error("N must be greater than 3");

        this.r = rad;
        this.theta1 = t1 % (2 * Math.PI);
        this.theta2 = t2 % (2 * Math.PI);
        this.n = num;

        if( this.theta1 < 0) this.theta1 = 2 * Math.PI + this.theta1;
        if (this.theta2 < 0) this.theta2 = 2 * Math.PI + this.theta2;
        if (this.theta2 <= this.theta1) this.theta2 = 2 * Math.PI + this.theta2;

        const diffTheta = (this.theta2 - this.theta1) / (this.n - 1);

        for (let x = 0; x < this.n; x += 1)
        {
            this.addVertex(new Vertex(this.r * Math.cos(this.theta1 + x * diffTheta),
                                      this.r * Math.sin(this.theta1 + x * diffTheta),
                                      0));
        }

        for (let x = 0; x < this.n - 1; x += 1)
        {
            this.addPrimitive(LineSegment.buildVertex(x, x +1));
        }
    }
}
