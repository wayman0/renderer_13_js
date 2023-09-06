/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import {LineSegment, Model, Vertex} from "../scene/SceneExport.js";

export default class BarycentricTriangle extends Model
{
    theta;
    n;
    #tri;

    constructor(angle, num)
    {
        if (typeof angle != "number" ||
            typeof num != "number")
               throw new Error("All parameters must be numerical");

        if (num < 0)
            throw new Error("num must be greater than 0");

        this.theta = angle;
        this.n = num;
        this.#tri = Model.buildName("Barycentric Triangle(" + theta + ", " + n + ")");

        const theta1 = theta * Math.PI/180;
        const theta2 = 2 * Math.PI/3;

        this.#tri.addVertex(new Vertex(Math.cos(theta1),
                                       Math.sin(theta1),
                                       0),
                            new Vertex(Math.cos(theta1 + theta2),
                                       Math.sin(theta1 + theta2),
                                       0),
                            new Vertex(Math.cos(theta1 + 2*theta2),
                                       Math.sin(theta1 + 2*theta2),
                                       0.0));
        this.#tri.addPrimitive( LineSegment.buildVertex(0, 1),
                                LineSegment.buildVertex(1, 2),
                                LineSegment.buildVertex(2, 0));

        if (n > 0)
        {
            this.barycentric(0, 1, 2, this.n);
        }
    }


    static buildFromN(num)
    {
        new BarycentricTriangle(0, num);
    }


    barycentric(vIndex0, vIndex1, vIndex2, n)
    {
        const v0 = this.#tri.vertexList()[vIndex0];
        const v1 = this.#tri.vertexList()[vIndex1];
        const v2 = this.#tri.vertexList()[vIndex2];
        const index = this.#tri.vertexList().length;

        if (n > 0)
        {
            this.#tri.addVertex(new Vertex((v0.x + v1.x + v2.x)/3,
                                           (v0.y + v1.y + v2.y)/3,
                                           (v0.z + v1.z + v2.z)/3));
            this.#tri.addVertex(new Vertex((v0.x + v1.x)/2,
                                           (v0.y + v1.y)/2,
                                           (v0.z + v1.z)/2));
            this.#tri.addVertex(new Vertex((v1.x + v2.x)/2,
                                           (v1.y + v2.y)/2,
                                           (v1.z + v2.z)/2));
            this.#tri.addVertex(new Vertex((v2.x + v3.x)/2,
                                           (v2.y + v3.y)/2,
                                           (v2.z + v3.z)/2));

            const vIndexCenter = index;
            const vIndex01 = index + 1;
            const vIndex12 = index + 2;
            const vIndex20 = index + 3;

            this.#tri.addPrimitive(LineSegment.buildVertex(vIndex0,  vIndexCenter),
                                   LineSegment.buildVertex(vIndex1,  vIndexCenter),
                                   LineSegment.buildVertex(vIndex2,  vIndexCenter),
                                   LineSegment.buildVertex(vIndex01, vIndexCenter),
                                   LineSegment.buildVertex(vIndex12, vIndexCenter),
                                   LineSegment.buildVertex(vIndex20, vIndexCenter))

            this.barycentric(vIndex0, vIndex01, vIndexCenter, n-1);
            this.barycentric(vIndex0, vIndex20, vIndexCenter, n-1);
            this.barycentric(vIndex1, vIndex01, vIndexCenter, n-1);
            this.barycentric(vIndex1, vIndex12, vIndexCenter, n-1);
            this.barycentric(vIndex2, vIndex12, vIndexCenter, n-1);
            this.barycentric(vIndex2, vIndex20, vIndexCenter, n-1);
        }
    }
}
