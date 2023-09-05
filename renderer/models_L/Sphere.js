/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import {Model, Vertex, LineSegment} from "../scene/SceneExport.js";

export default class Sphere extends Model
{
    /**@type {number} */ r;
    /**@type {number} */ n;
    /**@type {number} */ k;

    constructor(r = 1, n = 15, k = 16)
    {
        if (typeof r != "number" ||
            typeof n != "number" ||
            typeof k != "number")
               throw new Error("All parameters must be numerical");

        super(undefined, undefined, undefined, "Speher r = " + r);

        if (n < 1) throw new Error("n must be greater than 1");
        if (k < 3) throw new Error("k must be greater than 3");

        this.r = r;
        this.n = n;
        this.k = k;

        const deltaPhi = Math.PI / (n + 1);
        const deltaTheta = (2 * Math.PI) / k;

        // An array of vertices to be used to create line segment
        const v = new Array(n);
        for (let x = 0; x < v.length; x += 1)
        {
            v[x] = new Array(k);
        }

        // Create all the vertices.
        for (let j = 0; j < k; ++j) // choose an angle of longitude
        {
            const c1 = Math.cos(j * deltaTheta);
            const s1 = Math.sin(j * deltaTheta);

            for (let i = 0; i < n; ++i) // choose an angle of latitude
            {
                const c2 = Math.cos(deltaPhi + i * deltaPhi);
                const s2 = Math.sin(deltaPhi + i * deltaPhi);
                v[i][j] = new Vertex( r * s2 * c1, r * c2, -r * s2 * s1 );
            }
        }

        const northPole = new Vertex(0,  r, 0);
        const southPole = new Vertex(0, -r, 0);

        // Add all of the vertices to this model.
        for (let i = 0; i < n; ++i)
        {
            for (let j = 0; j < k; ++j)
            {
                this.addVertex( v[i][j] );
            }
        }
        this.addVertex(northPole, southPole);
        const northPoleIndex = n * k;
        const southPoleIndex = northPoleIndex + 1;

        // Create the horizontal circles of latitude around the sphere.
        for (let i = 0; i < n; ++i)
        {
            for (let j = 0; j < k - 1; ++j)
            {
                this.addPrimitive(LineSegment.buildVertex( (i * k) + j,  (i * k) + (j+1) ));
            }

            // close the circle
            this.addPrimitive(LineSegment.buildVertex( (i * k) + (k-1), (i * k) + 0 ));
        }  //                                            v[i][k-1]        v[i][0]

        // Create the vertical half-circles of longitude from north to south pole.
        for (let j = 0; j < k; ++j)
        {  //                                                           v[0][j]
            this.addPrimitive(LineSegment.buildVertex( northPoleIndex, (0 * k) + j ));

            for (let i = 0; i < n - 1; ++i)
            {
                this.addPrimitive(LineSegment.buildVertex( (i * k) + j, ((i+1) * k) + j ));
            }
            //                                           v[n-1][j]
            this.addPrimitive(LineSegment.buildVertex( ((n-1) * k) + j, southPoleIndex ));
        }
    }
}