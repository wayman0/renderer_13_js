/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import {LineSegment, Model, Vertex} from "../scene/SceneExport.js";

export default class Octahedron extends Model
{
    /**@type {number} */n1;
    /**@type {number} */n2;
    /**@type {number} */n3;

    constructor()
    {
        super(undefined, undefined, undefined, "Octahedron");

        this.n1 = 0;
        this.n2 = 0;
        this.n3 = 0;

        this.addVertex(new Vertex( 1,  0,  0),  // 4 vertices around the center plane
                       new Vertex( 0,  0, -1),
                       new Vertex(-1,  0,  0),
                       new Vertex( 0,  0,  1),
                       new Vertex( 0,  1,  0),  // vertex at the top
                       new Vertex( 0, -1,  0)); // vertex at the bottom

        this.addPrimitive(LineSegment.buildVertex(0, 1),
                          LineSegment.buildVertex(1, 2),
                          LineSegment.buildVertex(2, 3),
                          LineSegment.buildVertex(3, 0));

        // Edges going to the top vertex.
        this.addPrimitive(LineSegment.buildVertex(0, 4),
                          LineSegment.buildVertex(1, 4),
                          LineSegment.buildVertex(2, 4),
                          LineSegment.buildVertex(3, 4));

        // Edges going to the bottom vertex.
        this.addPrimitive(LineSegment.buildVertex(0, 5),
                          LineSegment.buildVertex(1, 5),
                          LineSegment.buildVertex(2, 5),
                          LineSegment.buildVertex(3, 5));
    }


    /**
     *
     * @param {number} n1a
     * @param {number} n1b
     * @param {number} n2a
     * @param {number} n2b
     * @param {number} n3a
     * @param {number} n3b
     */
    static buildMeshOctahedron(n1a, n1b, n2a, n2b, n3a, n3b)
    {
        if (typeof n1a != "number" ||
            typeof n1b != "number" ||
            typeof n2a != "number" ||
            typeof n2b != "number" ||
            typeof n3a != "number" ||
            typeof n3b != "number")
                throw new Error("All parameters must be numerical");

        if (n1a < 1) throw new Error("n1a must be greater than 0");
        if (n1b < 1) throw new Error("n1b must be greater than 0");
        if (n2a < 1) throw new Error("n2a must be greater than 0");
        if (n2b < 1) throw new Error("n2b must be greater than 0");
        if (n3a < 1) throw new Error("n3a must be greater than 0");
        if (n3b < 1) throw new Error("n3b must be greater than 0");

        const octo = new Octahedron();

        octo.n1 = n1a;
        octo.n2 = n2a;
        octo.n3 = n3a;

        const v0 = octo.vertexList[0];
        const v1 = octo.vertexList[1];
        const v2 = octo.vertexList[2];
        const v3 = octo.vertexList[3];
        const v4 = octo.vertexList[4];
        const v5 = octo.vertexList[5];

        octo.fan(n1a, 4, v0, v1, v2, v3); // fan out from v4 (top)
        octo.fan(n1b, 5, v0, v1, v2, v3); // fan out from v5 (bottom)
        octo.fan(n2a, 0, v3, v4, v1, v5); // fan out from v0
        octo.fan(n3a, 1, v0, v4, v2, v5); // fan out from v1
        octo.fan(n2b, 2, v1, v4, v3, v5); // fan out from v2
        octo.fan(n3b, 3, v2, v4, v0, v5); // fan out from v3

        return octo;
    }


    /**
     *
     * @param {number} n
     * @param {number} vIndex
     * @param {Vertex} v1
     * @param {Vertex} v2
     * @param {Vertex} v3
     * @param {Vertex} v4
     */
    fan(n, vIndex, v1, v2, v3, v4)
    {
        for (let i = 0; i < n; ++i)
        {
         // Use linear interpolation (lerp).
            const t = (i+1) / (n+1);
            const x = (1-t) * v1.x + t * v2.x;
            const y = (1-t) * v1.y + t * v2.y;
            const z = (1-t) * v1.z + t * v2.z;
            const v = new Vertex(x, y, z);
            const index = this.vertexList.length;
            this.addVertex(v);
            this.addPrimitive(LineSegment.buildVertex(vIndex, index));
        }

        for (let i = 0; i < n; ++i)
        {
           // Use linear interpolation (lerp).
           const t = (i+1) / (n+1);
           const x = (1-t) * v2.x + t * v3.x;
           const y = (1-t) * v2.y + t * v3.y;
           const z = (1-t) * v2.z + t * v3.z;
           const v = new Vertex(x, y, z);
           const index = this.vertexList.length;
           this.addVertex(v);
           this.addPrimitive(LineSegment.buildVertex(vIndex, index));
        }

        for (let i = 0; i < n; ++i)
        {
           // Use linear interpolation (lerp).
           const t = (i+1) / (n+1);
           const x = (1-t) * v3.x + t * v4.x;
           const y = (1-t) * v3.y + t * v4.y;
           const z = (1-t) * v3.z + t * v4.z;
           const v = new Vertex(x, y, z);
           const index = this.vertexList.length;
           this.addVertex(v);
           this.addPrimitive(LineSegment.buildVertex(vIndex, index));
        }

        for (let i = 0; i < n; ++i)
        {
           // Use linear interpolation (lerp).
           const t = (i+1) / (n+1);
           const x = (1-t) * v4.x + t * v1.x;
           const y = (1-t) * v4.y + t * v1.y;
           const z = (1-t) * v4.z + t * v1.z;
           const v = new Vertex(x, y, z);
           const index = this.vertexList.length;
           this.addVertex(v);
           this.addPrimitive(LineSegment.buildVertex(vIndex, index));
        }
    }
}
