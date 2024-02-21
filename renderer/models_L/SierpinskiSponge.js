//@ts-check
import {Model, Vertex, LineSegment, Matrix} from "../scene/SceneExport.js";
import { format } from "../scene/util/StringFormat.js";

export default class SierpinskiSponge extends Model
{
    /**@type {number} */ #n;

    /**
     * Create a Sierpinski Sponge centered at the origin using n recursive iterations
     * 
     * @param {number} [n=5] number of recursive iterations
     */
    constructor(n = 5)
    {
        super(undefined, undefined, undefined, 
            undefined, undefined, format("Sierpinski_Sponge(%d)", n));

        if(n < 0)
            throw new Error("N must be greater than 0");

        this.#n = n;

        if(0 == n)
        {
            this.addVertex( new Vertex( 1,  1,  1),
                            new Vertex(-1,  1, -1),
                            new Vertex( 1, -1, -1),
                            new Vertex(-1, -1,  1));

            this.addPrimitive(LineSegment.buildVertex(0, 1),
                              LineSegment.buildVertex(2, 3),
                              LineSegment.buildVertex(0, 2),
                              LineSegment.buildVertex(0, 3),
                              LineSegment.buildVertex(1, 2),
                              LineSegment.buildVertex(1, 3));
        }
        else
        {
            this.addNestedModel(this.#subSponges(n-1,  1,  1,  1), 
                                this.#subSponges(n-1, -1,  1, -1),
                                this.#subSponges(n-1,  1, -1, -1),
                                this.#subSponges(n-1, -1, -1,  1));
        }
    }

    /**
     * 
     * @param {number} n 
     * @param {number} pmX 
     * @param {number} pmY 
     * @param {number} pmZ 
     * @returns {Model}
     */
    #subSponges(n, pmX, pmY, pmZ)
    {
        const model = Model.buildNameMatrix("Sierpinski Sponge: level " + n + "(" + pmX + ", " + pmY + ", " + pmZ + ",",
                                            Matrix.translate(pmX * .5, pmY * .5, pmZ * .5).timesMatrix(Matrix.scale(.5)));

        if(0 == n)
        {
            model.addVertex( new Vertex( 1,  1,  1),
                            new Vertex(-1,  1, -1),
                            new Vertex( 1, -1, -1),
                            new Vertex(-1, -1,  1));

            model.addPrimitive(LineSegment.buildVertex(0, 1),
                              LineSegment.buildVertex(2, 3),
                              LineSegment.buildVertex(0, 2),
                              LineSegment.buildVertex(0, 3),
                              LineSegment.buildVertex(1, 2),
                              LineSegment.buildVertex(1, 3));
        }
        else
        {
            this.addNestedModel(this.#subSponges(n-1,  1,  1,  1), 
                                this.#subSponges(n-1, -1,  1, -1),
                                this.#subSponges(n-1,  1, -1, -1),
                                this.#subSponges(n-1, -1, -1,  1));
        }

        return model;
    }

    getHorzCount() { return this.#n};
    getVertCount() { return this.#n};
    remake(n, k)
    {
        let newN = k
        if(n != this.#n)
            newN = n;

        return new SierpinskiSponge(newN)
    }
}