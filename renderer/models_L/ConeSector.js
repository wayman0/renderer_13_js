/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import {Model, Vertex, LineSegment} from "../scene/SceneExport.js";

export default class ConeSector extends Model
{
    /**@type{number}*/r
    /**@type{number}*/h
    /**@type{number}*/t
    /**@type{number}*/theta1
    /**@type{number}*/theta2
    /**@type{number}*/n
    /**@type{number}*/k

    /**
     *
     * @param {number} rad
     * @param {number} height
     * @param {number} top
     * @param {number} t1
     * @param {number} t2
     * @param {number} n
     * @param {number} k
     */
    constructor(rad=1, height=1, top = height, t1=Math.PI/2, t2=Math.PI/2, n=15, k=8)
    {
        super(undefined, undefined, undefined, "Cone Sector: r = " + rad + "h = " + height +
                                                            "t = " + top + "theta1 = " + t1 +
                                                            "theta2 = " + t2 + "n = " + n + "k = " + k);

        if (typeof rad != "number"    ||
            typeof height != "number" ||
            typeof top != "number" ||
            typeof t1 != "number"  ||
            typeof t2 != "number"  ||
            typeof n != "number"   ||
            typeof k != "number")
                throw new Error("All parameters must be numerical");

        if(n < 2) throw new Error("N must be greater than 2");
        if(k < 4) throw new Error("K must be greater than 4");
        if(height < top) throw new Error("Height must be greater than top");

        this.r = rad;
        this.h = height;
        this.t = top;
        this.theta1 = t1;
        this.theta2 = t2;
        this.n = n;
        this.k = k;

        this.theta1 = this.theta1 % (2*Math.PI);
        this.theta2 = this.theta2 % (2*Math.PI);
        if (this.theta1 < 0) this.theta1 = 2*Math.PI + this.theta1;
        if (this.theta2 < 0) this.theta2 = 2*Math.PI + this.theta2;
        if (this.theta2 <= this.theta1) this.theta2 = this.theta2 + 2*Math.PI;

        const dH = this.h / (this.n - 1);
        const dTheta = (this.theta2 - this.theta1)/(this.k - 1);

        /**@type {number[][]} */
        //const vertInd = new Array(new Array());
        const vertInd = new Array(n);
        for (let x = 0; x < vertInd.length; x += 1)
        {
            vertInd[x] = new Array(k);
        }

        let index = 0;

        for (let j = 0; j < k; ++j) // choose an angle of longitude
        {
            let c = Math.cos(this.theta1 + j * dTheta);
            let s = Math.sin(this.theta1 + j * dTheta);

            for (let i = 0; i < n; ++i) // choose a circle of latitude
            {
                const slantRadius = this.r * (1 - i * dH / this.h);
                this.addVertex( new Vertex( slantRadius * c,
                                            i * dH,
                                            slantRadius * s) );
                vertInd[i][j] = index++;
            }
        }

        this.addVertex(new Vertex(0, this.h, 0));
        const heightIndex = index++;

        this.addVertex(new Vertex(0, 0, 0));
        const baseIndex = index++;

        for (let x = 0; x < n; x += 1)
        {
            for (let y = 0; y < k-1; y += 1)
            {
                this.addPrimitive(LineSegment.buildVertex(vertInd[x][y],
                                                          vertInd[x][y]+1));
            }
        }

        for (let x = 0; x < k; x += 1)
        {
            this.addPrimitive(LineSegment.buildVertex(baseIndex, vertInd[0][x]));

            for (let y = 0; y < n-1; y += 1)
            {
                this.addPrimitive(LineSegment.buildVertex(vertInd[y][x],
                                                          vertInd[y+1][x]));
            }
        }
    }
}