/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import {Model, Vertex, LineSegment} from "../scene/SceneExport.js";

export default class ConeFrustum extends Model
{
    /**@type{number}*/r1;
    /**@type{number}*/r2;
    /**@type{number}*/h;
    /**@type{number}*/n;
    /**@type{number}*/k;

    /**
     *
     * @param {number} b
     * @param {number} t
     * @param {number} h
     * @param {number} n
     * @param {number} k
     */
    constructor(b=1, t=.5, h=.5, n=7, k=16)
    {
        super(undefined, undefined, undefined, "Cone Frustrum r1 = " + b + " r2 = " + t + "h = " + h + "n = " + n + " k = " + k);

        if (typeof b != "number" ||
            typeof t != "number" ||
            typeof h != "number" ||
            typeof n != "number" ||
            typeof k != "number")
                throw new Error("All parameters must be numerical");

        if(n < 2) throw new Error("n must be greater than 2");
        if(k < 3) throw new Error("k must be greater than 3");

        this.r1 = b;
        this.r2 = t;
        this.h = h;
        this.n = n;
        this.k = k;

        const dTheta = 2 * Math.PI / k;

        /**@type {number[][]} */
        //const vertInd = new Array(new Array());
        const vertInd = new Array(n);
        for(let x = 0; x < vertInd.length; x += 1)
            vertInd[x] = new Array(k);

        let index = 0;

        for (let j = 0; j < k; ++j) // choose an angle of longitude
        {
            const c = Math.cos(j * dTheta);
            const s = Math.sin(j * dTheta);
            for (let i = 0; i < n; ++i) // choose a circle of latitude
            {
                const slantRadius = (i/(n-1)) * this.r1 + ((n-1-i)/(n-1)) * this.r2;
                this.addVertex(new Vertex(slantRadius * c,
                                          h - (i*h)/(n-1),
                                          slantRadius * s) );
                vertInd[i][j] = index++;
            }
        }

        this.addVertex(new Vertex(0, this.h, 0));
        const topIndex = index++;

        this.addVertex(new Vertex(0, 0, 0));
        const botIndex = index++;

        for (let i = 0; i < n; ++i)
        {
            for (let j = 0; j < k-1; ++j)
            {
                this.addPrimitive(LineSegment.buildVertex(vertInd[i][j], vertInd[i][j+1]));
            }

            // close the circle
            this.addPrimitive(LineSegment.buildVertex(vertInd[i][k-1], vertInd[i][0]));
        }

        // Create the vertical half-trapazoids of longitude from north to south pole.
        for (let j = 0; j < k; ++j)
        {
            // Create the triangle fan at the top.
            this.addPrimitive(LineSegment.buildVertex(topIndex, vertInd[0][j]));
            // Create the slant lines from the top to the base.
            this.addPrimitive(LineSegment.buildVertex(vertInd[0][j], vertInd[n-1][j]));
            // Create the triangle fan at the base.
            this.addPrimitive(LineSegment.buildVertex(vertInd[n-1][j], botIndex));
        }

    }
}