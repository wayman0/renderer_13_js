/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import {LineSegment, Model, Vertex} from "../scene/SceneExport.js";
import {format} from "../scene/util/UtilExport.js";

export default class Ring extends Model
{
    r1;
    r2;
    n;
    k;

    constructor(r1 = 1, r2 = 1/3, n = 4, k = 12)
    {
        if (typeof r1 != "number" ||
            typeof r2 != "number" ||
            typeof n != "number"  ||
            typeof  k != "number")
                throw new Error("All parameters must be numerical");

        if (n < 1) throw new Error("n must be greater than 1");
        if (k < 3) throw new Error("k must be greater than 1");

        super(undefined, undefined, undefined, format("Pyramid Frustum %.2f, %.2f, %d, %d", r1, r2, n, k));

        this.r1 = r1;
        this.r2 = r2;
        this.n = n;
        this.k = k;

        const deltaR = (r1 - r2) / n;
        const deltaTheta = (2 * Math.PI)/k;

        /**@type {Vertex[][]} */
        const v = new Array(n+1);
        for (let i = 0; i < v.length; i += 1)
        {
            v[i] = new Array(k);
        }

        // Create all the vertices.
        for (let j = 0; j < k; ++j) // choose a spoke (an angle)
        {
            const c = Math.cos(j * deltaTheta);
            const s = Math.sin(j * deltaTheta);
            for (let i = 0; i < n + 1; ++i) // move along the spoke
            {
                const ri = r2 + i * deltaR;
                v[i][j] = new Vertex(ri * c,
                                     ri * s,
                                     0);
            }
        }

        // Add all of the vertices to this model.
        for (let i = 0; i < n + 1; ++i)
        {
            for (let j = 0; j < k; ++j)
                this.addVertex( v[i][j] );
        }

        // Create line segments around each concentric ring.
        for (let i = 0; i < n + 1; ++i)  // choose a ring
        {
            for (let j = 0; j < k - 1; ++j)
            {
                this.addPrimitive(LineSegment.buildVertex( (i * k) + j, (i * k) + (j+1) ));
            }
            // close the circle
            this.addPrimitive(LineSegment.buildVertex( (i * k) + (k-1), (i * k) + 0 ));
        }   //                                           v[i][k-1]         v[i][0]

        // Create the spokes.connecting the inner circle to the outer circle.
        for (let j = 0; j < k; ++j) // choose a spoke
        {
            for (let i = 0; i < n; ++i)
            {
                this.addPrimitive(LineSegment.buildVertex( (i * k) + j, ((i+1) * k) + j ));
            }
        }
    }
}