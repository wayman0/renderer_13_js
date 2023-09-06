/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import {ConeSector} from "./ModelsExport.js";

export default class Cone extends ConeSector
{
    /**
     *
     * @param {number} rad
     * @param {number} height
     * @param {number} n
     * @param {number} k
     */
    constructor(rad=1, height=1, n=15, k=16)
    {
        super(rad, height, height, 0, 2 * Math.PI, n, k);
        this.name = "Cone r=" + rad + "h = " + height + "n = " + n + "k = " + k;
    }
}