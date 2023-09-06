/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import {CylinderSector} from "./ModelsExport.js";

export default class Cylinder extends CylinderSector
{
    /**
     *
     * @param {number} r
     * @param {number} h
     * @param {number} n
     * @param {number} k
     */
    constructor(r=1, h=1, n=15, k=16)
    {
        super(r, h, 0, 2 * Math.PI, n, k);
        this.name = "Cylinder r = " + r + "h = " + h + "n = " + n + " k = " + k;
    }
}