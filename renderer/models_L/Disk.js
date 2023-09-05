/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import { LineSegment, Model, Vertex } from "../scene/SceneExport.js";

export default class Disk extends Model
{
    /**@type{number}*/r;
    /**@type{number}*/n;
    /**@type{number}*/k;

    constructor(r = 1, n = 6, k = 12)
    {
        super(undefined, undefined, undefined, "Disk(" + r + ", " + n + ", " + k + ")");

        if (typeof r != "number" ||
            typeof n != "number" ||
            typeof k != "number")
            throw new Error("All parameters must be numerical");

        if (n < 1) throw new Error("n must be greater than 1");
        if (k < 3) throw new Error("k must be greater than 3");

        this.r = r;
        this.n = n;
        this.k = k;

        const deltaR = r/n;
        const deltaT = 2 * Math.PI/k;

        /**@type {Vertex[][]} */
        const v = new Array(n);
        for (let x = 0; x < v.length; x += 1)
        {
            v[x] = new Array(k);
        }

        for (let j = 0; j < k; j += 1)
        {
            const c = Math.cos(j * deltaT);
            const s = Math.sin(j * deltaT);

            for (let i = 0; i < n; i += 1)
            {
                const ri = (i + 1) * deltaR;
                v[i][j] = new Vertex(ri * c, ri *s, 0);
            }
        }

        for (let i = 0; i < n; i += 1)
        {
            for (let j = 0; j < k; j += 1)
            {
                this.addVertex(v[i][j]);
            }
        }

        const center = new Vertex(0, 0, 0);
        this.addVertex(center);
        const centIndex = n * k;

        for(let j = 0; j < k; j += 1)
        {
            this.addPrimitive(LineSegment.buildVertex(centIndex, (0*k) + j));

            for(let i = 0; i < n-1; i += 1)
            {
                this.addPrimitive(LineSegment.buildVertex((i*k) + j, ((i+1)*k) + j));
            }
        }

        for(let i = 0; i < n; i += 1)
        {
            for(let j = 0; j < k-1; j += 1)
            {
                this.addPrimitive(LineSegment.buildVertex((i * k) + j, (i * k) + (j + 1)))
            }

            this.addPrimitive(LineSegment.buildVertex((i * k) + (k-1), (i * k) + 0))
        }
    }
}