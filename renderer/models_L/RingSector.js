/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import {LineSegment, Model, Vertex} from "../scene/SceneExport.js";
import {format} from "../scene/util/UtilExport.js";

export default class RingSector extends Model
{
    r1;
    r2;
    theta1;
    theta2;
    n;
    k;

    constructor(r1 = 1, r2 = 1/3, theta1 = 0, theta2 = Math.PI, n = 5, k =7)
    {
        if (typeof r1 != "number"     ||
            typeof r2 != "number"     ||
            typeof theta1 != "number" ||
            typeof theta2 != "number" ||
            typeof n != "number"      ||
            typeof k != "number")
                throw new Error("All parameters must be numerical");

        if (n < 2) throw new Error("n must be greater than 1");
        if (k < 4) throw new Error("K must be greater than 3");

        super(undefined, undefined, undefined, format("Ring Sector %.2f %.2f, %.2f, %.2f, %d, %d", r1, r2, theta1, theta2, n, k));

        theta1 = theta1 % (2*Math.PI);
        theta2 = theta2 % (2*Math.PI);

        if (theta1 < 0) theta1 = 2*Math.PI + theta1;
        if (theta2 < 0) theta2 = 2*Math.PI + theta2;
        if (theta2 <= theta1) theta2 = theta2 + 2*Math.PI;

        this.r1 = r1;
        this.r2 = r2;
        this.theta1 = theta1;
        this.theta2 = theta2;
        this.n = n;
        this.k = k;

        const deltaR = (r1-r2)/(n-1)
        const deltaTheta = (theta1 - theta2)/(k-1)

        const v = new Array(n);
        for (let i = 0; i < v.length; i += 1)
        {
            v[i] = new Array(k);
        }

        // Create all the vertices.
        for (let j = 0; j < k; ++j) // choose a spoke (an angle)
        {
            const c = Math.cos(theta1 + j * deltaTheta);
            const s = Math.sin(theta1 + j * deltaTheta);

            for (let i = 0; i < n; ++i) // move along the spoke
            {
                const ri = r2 + i * deltaR;
                v[i][j] = new Vertex(ri * c,
                                     ri * s,
                                     0);
            }
        }

        // Add all of the vertices to this model.
        for (let i = 0; i < n; ++i)
        {
            for (let j = 0; j < k; ++j)
            {
                this.addVertex( v[i][j] );
            }
        }

        // Create line segments around each concentric ring.
        for (let i = 0; i < n; ++i)  // choose a ring
        {
            for (let j = 0; j < k - 1; ++j)
            {
                this.addPrimitive(LineSegment.buildVertex( (i * k) + j, (i * k) + (j+1) ));
            }
        }

        // Create the spokes.connecting the inner circle to the outer circle.
        for (let j = 0; j < k; ++j) // choose a spoke
        {
            for (let i = 0; i < n - 1; ++i)
            {
                this.addPrimitive(LineSegment.buildVertex( (i * k) + j, ((i+1) * k) + j ));
            }
        }
    }
}