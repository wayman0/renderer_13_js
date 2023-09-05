/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import {Model, Vertex, LineSegment} from "../scene/SceneExport.js";

export default class CylinderSector extends Model
{
    /**@type {number} */r;
    /**@type {number} */h;
    /**@type {number} */theta1;
    /**@type {number} */theta2;
    /**@type {number} */n;
    /**@type {number} */k;

    /**
     *
     * @param {number} rad
     * @param {number} height
     * @param {number} t1
     * @param {number} t2
     * @param {number} n
     * @param {number} k
     */
    constructor(rad = 1,
                height = 1,
                t1 = Math.PI/2,
                t2 = 3 *Math.PI/2,
                n = 15,
                k = 8)
    {
        super(undefined, undefined, undefined, "Cylinder Sector r = " + rad + " h = " + height + "theta1 = " + t1 + "theta2 = " + t2 + " n = " + n + "k = " + k);

        if (typeof rad != "number"    ||
            typeof height != "number" ||
            typeof t1 != "number"     ||
            typeof t2 != "number"     ||
            typeof n != "number"      ||
            typeof k != "number")
                throw new Error("All parameters must be numerical");

        if (n < 2) throw new Error("N must be less than 2");
        if (k < 4) throw new Error("k must be less than 4");

        this.r = rad;
        this.h = height;
        this.theta1 = t1;
        this.theta2 = t2;
        this.n = n;
        this.k = k;

        this.theta1 = this.theta1 % (2*Math.PI);
        this.theta2 = this.theta2 % (2*Math.PI);
        if (this.theta1 < 0) this.theta1 = 2*Math.PI + this.theta1;
        if (this.theta2 < 0) this.theta2 = 2*Math.PI + this.theta2;
        if (this.theta2 <= this.theta1) this.theta2 = this.theta2 + 2*Math.PI;

        const dH = 2 * this.h / (this.n - 1);
        const dTheta = (this.theta2 - this.theta1)/(this.k - 1);

        /**@type {Vertex[][]} */
        //const vertArr = new Array(new Array());
        const vertArr = new Array(n);
        for (let x = 0; x < vertArr.length; x += 1)
        {
            vertArr[x] = new Array(k);
        }

        // Create all the vertices.
        for (let j = 0; j < k; ++j) // choose an angle of longitude
        {
            const c = Math.cos(this.theta1 + j*dTheta);
            const s = Math.sin(this.theta1 + j*dTheta);
            for (let i = 0; i < n; ++i) // choose a circle of latitude
            {
                vertArr[i][j] = new Vertex( this.r * c,
                                            this.h - i * dH,
                                           -this.r * s );
            }
        }

        const topCenter    = new Vertex(0,  this.h, 0);
        const bottomCenter = new Vertex(0, -this.h, 0);

        // Add all of the vertices to this model.
        for (let i = 0; i < n; ++i)
        {
            for (let j = 0; j < k; ++j)
            {
                this.addVertex(vertArr[i][j]);
            }
        }
        this.addVertex(topCenter, bottomCenter);
        const topCenterIndex    = n * k;
        const bottomCenterIndex = n * k + 1;

        // Create the horizontal (partial) circles of latitude around the cylinder.
        for (let i = 0; i < n; ++i) // choose a circle of latitude
        {
            for (let j = 0; j < k - 1; ++j)
            {
                this.addPrimitive(LineSegment.buildVertex( (i * k) + j, (i * k) + (j+1) ));
            }
        }

        // Create the lines of longitude from the top to the bottom.
        for (let j = 0; j < k; ++j) // choose a line of longitude
        {   //                                                          v[0][j]
            this.addPrimitive(LineSegment.buildVertex( topCenterIndex, (0 * k) + j ));

            for (let i = 0; i < n - 1; ++i)
            {
                this.addPrimitive(LineSegment.buildVertex( (i * k) + j, ((i+1) * k) + j ));
            }
            this.addPrimitive(LineSegment.buildVertex( ((n-1) * k) + j, bottomCenterIndex ));
        }
    }
}