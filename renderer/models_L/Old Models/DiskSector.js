/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import {Model, Vertex, LineSegment} from "../scene/SceneExport.js";

export default class DiskSector extends Model
{
    /**@type {number} */r;
    /**@type {number} */theta1;
    /**@type {number} */theta2;
    /**@type {number} */n;
    /**@type {number} */k;

    constructor(rad = 1, t1 = 0, t2 = Math.PI, n = 6, k = 8)
    {
        super(undefined, undefined, undefined, "Disk Sector r = " + rad + "theta1 = " + t1 + "theta 2 = " + t2 + "n = " + n + "k = " + k);

        if (typeof rad != "number" ||
            typeof t1 != "number"  ||
            typeof t2 != "number"  ||
            typeof n != "number"   ||
            typeof k != "number")
                throw new Error("All parameters must be numerical");

        this.r = rad;
        this.theta1 = t1;
        this.theta2 = t2;
        this.n = n;
        this.k = k;

        this.theta1 = this.theta1 % (2*Math.PI);
        this.theta2 = this.theta2 % (2*Math.PI);
        if (this.theta1 < 0) this.theta1 = 2*Math.PI + this.theta1;
        if (this.theta2 < 0) this.theta2 = 2*Math.PI + this.theta2;
        if (this.theta2 <= this.theta1) this.theta2 = this.theta2 + 2*Math.PI;

        // Create the disk's geometry.
        const deltaR = this.r / n;
        const deltaTheta = (this.theta2 - this.theta1) / (k - 1);

        /**@type {Vertex[][]} */
        //const vertArr = new Array(new Array());
        const vertArr = new Array(n)
        for (let x = 0; x < vertArr.length; x += 1)
        {
            vertArr[x] =  new Array(k);
        }

        for (let j = 0; j < k; ++j) // choose a spoke (an angle)
        {
            const c = Math.cos(this.theta1 + j * deltaTheta);
            const s = Math.sin(this.theta1 + j * deltaTheta);
            for (let i = 0; i < n; ++i) // move along the spoke
            {
                const ri = (i + 1) * deltaR;
                vertArr[i][j] = new Vertex(ri * c,
                                           ri * s,
                                           0 );
            }
        }
        const center = new Vertex(0, 0, 0);

        for (let x = 0; x < n; x += 1)
        {
            for (let y = 0; y < k; y += 1)
            {
                this.addVertex(vertArr[x][y]);
            }
        }
        this.addVertex(center);
        const centerIndex = n * k;

        // Create the spokes connecting the center to the outer circle.
        for (let j = 0; j < k; ++j) // choose a spoke
        {   //                                                        v[0][j]
            this.addPrimitive(LineSegment.buildVertex( centerIndex, (0 * k) + j ));

            for (let i = 0; i < n - 1; ++i)
            {
                this.addPrimitive(LineSegment.buildVertex( (i * k) + j, ((i+1) * k) + j ));
            }
        }

        // Create the line segments around each (partial) concentric circle.
        for (let i = 0; i < n; ++i)  // choose a circle
        {
            for (let j = 0; j < k - 1; ++j)
            {
                this.addPrimitive(LineSegment.buildVertex( (i * k) + j, (i * k) + (j + 1) ));
            }
        }
    }
}