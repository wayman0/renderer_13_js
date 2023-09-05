/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import {LineSegment, Model, Vertex} from "../scene/SceneExport.js";
import {format} from "../scene/util/UtilExport.js";

export default class Tetrahedron extends Model
{
    n1;
    n2;

    constructor(n1 = 0, n2 = 0)
    {
        if (typeof n1 != "number" ||
            typeof n2 != "number")
               throw new Error("All parameters must be numerical");

        if (n1 < 0) throw new Error("n1 must be greater than 1");
        if (n2 < 0) throw new Error("n2 must be greater than 1");

        super(undefined, undefined, undefined, format("Tetrahedron %d %d", n1, n2));

        this.n1 = n1;
        this.n2 = n2;

        const v0 = new Vertex( 1,  1,  1),
              v1 = new Vertex(-1,  1, -1),
              v2 = new Vertex( 1, -1, -1),
              v3 = new Vertex(-1, -1,  1);

        this.addVertex(v0, v1, v2, v3);
        this.addPrimitive(LineSegment.buildVertex(0, 1), //top (bottom) edge
                          LineSegment.buildVertex(2, 3), //bottom (top) edge
                          LineSegment.buildVertex(0, 2),
                          LineSegment.buildVertex(0, 3),
                          LineSegment.buildVertex(1, 2),
                          LineSegment.buildVertex(1, 3));

        this.fan2(n1, 0, v2, v3); // fan out from v0
        this.fan2(n1, 1, v2, v3); // fan out from v1
        this.fan2(n2, 2, v0, v1); // fan out from v2
        this.fan2(n2, 3, v0, v1); // fan out from v3

    }

    fan2(n, vInd, v1, v2)
    {
        for (let i = 0; i < n; i += 1)
        {
            const t = (i+1) / (n+1);
            const x = (1-t) * v1.x + t * v2.x;
            const y = (1-t) * v1.y + t * v2.y;
            const z = (1-t) * v1.z + t * v2.z;
            const v = new Vertex(x, y, z);
            const index = this.vertexList.length;
            this.addVertex(v);
            this.addPrimitive(LineSegment.buildVertex(vInd, index));
        }
    }
}