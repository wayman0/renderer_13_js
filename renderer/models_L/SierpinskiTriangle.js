//@ts-check
import {Model, Vertex, LineSegment, Matrix} from "../scene/SceneExport.js";
import { format } from "../scene/util/StringFormat.js";

export default class SierpinskiTriangle extends Model
{
    /**@type {number} */ #n;

    /**
     * Create a Sierpinski Sponge centered at the origin using n recursive iterations
     * 
     * @param {number} [n=7] number of recursive iterations
     */
    constructor(n = 7)
    {
        super(undefined, undefined, undefined, 
            undefined, undefined, format("Sierpinski_Triangle(%d)", n));

        if(n < 0)
            throw new Error("N must be greater than 0");

        this.#n = n;

        if(0 == n)
        {
            this.addVertex( new Vertex( 1.0,  0.0,   0),
                            new Vertex(-0.5,  0.866, 0),
                            new Vertex(-0.5, -0.866, 0))

            this.addPrimitive(LineSegment.buildVertex(0, 1),
                              LineSegment.buildVertex(1, 2),
                              LineSegment.buildVertex(2, 0));        }
        else
        {
            this.addNestedModel(this.#subTriangles(n-1,  0.50,  0.0), 
                                this.#subTriangles(n-1, -0.25,  0.433),
                                this.#subTriangles(n-1, -0.25, -0.433));
        }
    }

    /**
     * 
     * @param {number} n 
     * @param {number} tX 
     * @param {number} tY 
     * @returns {Model}
     */
    #subTriangles(n, tX, tY)
    {
        const model = Model.buildNameMatrix("Sierpinski Triangle: level " + n + "(" + tX + ", " +  tY + ")",
                                            Matrix.translate(tX, tY, 0).timesMatrix(Matrix.scale(.5)));

        if(0 == n)
        {
            model.addVertex( new Vertex( 1.0,  0.0,   0),
                             new Vertex(-0.5,  0.866, 0),
                             new Vertex(-0.5, -0.866, 0));

            model.addPrimitive(LineSegment.buildVertex(0, 1),
                               LineSegment.buildVertex(1, 2),
                               LineSegment.buildVertex(2, 0));
        }
        else
        {
            this.addNestedModel(this.#subTriangles(n-1,  0.50,  0), 
                                this.#subTriangles(n-1, -0.25,  0.433),
                                this.#subTriangles(n-1, -0.25, -0.433));        
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

        return new SierpinskiTriangle(newN)
    }
}