/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   A {@code LineSegment} object has four integers that
   represent the endpoints of the line segment and the
   color at each endpoint. Two of the integers are indices
   into the {@link renderer.scene.Vertex} list of a
   {@link renderer.scene.Model} object and the other two
   integers are indices into the {@link java.awt.Color}
   list of that {@link renderer.scene.Model} object.
*/

//@ts-check
import Primitive from "./Primitive.js";
// import {Primitive} from "./PrimitiveExport.js"; doesnt work gives me an error

export default class LineSegment extends Primitive
{
    /**
     * Constructs a {@code LineSegment} using the 2 given {@link Array}s of integer indices.
     * <p>
     * NOTE: This constructor does nut put any {@link renderer.scene.Vertex} or {@link renderer.color.Color} into this
     * {@link Primitive} {@link renderer.scene.Model} object. This constructor assumes that
     * the given indices are valid or will be by the time this {@link Primitive} is rendered.
     *
     * @param {number[]} [vIndList=new Array(2)] list of integer indexes to a {@link renderer.scene.Vertex} list
     * @param {number[]} [cIndList=new Array(2)] list of integer indexes to a {@link renderer.color.Color} list
     */
    constructor(vIndList = new Array(2), cIndList = new Array(2))
    {
        if (Array.isArray(vIndList) == false ||
            Array.isArray(cIndList) == false)
            throw new Error("Vertex Index List and Color Index List must be an array. ");

        if (vIndList.length != 2 ||
            cIndList.length != 2)
            throw new Error("Need 2 points to make a line segment");

        super(vIndList, cIndList);
    }


    /**
     * Construct a {@code LineSegment} using the two gien integer indexes
     * to access both the vertex and color list in the {@link renderer.scene.Model}.
     * NOTE: Uses 0 and 1 as the default indexes.
     *
     * @param {number} i0 the first endpoint index into the vertex and color list
     * @param {number} i1 the second endpoint index into the vertex and color list
     * @returns the new {@code LineSegment} created from the given data
     */
    static buildVertex(i0 = 0, i1 = 1)
    {
        return new LineSegment(new Array(i0, i1),
                               new Array(i0, i1));
    }


    /**
     * Construct a {@code LineSemgnet} using the 2 integer indexes for the
     * vertexes and the one index for the colors.
     * Note: Uses 0 and 1 as the default index for the vertexes and 0 for the color.
     *
     * @param {number} i0 the first endpoint index into the vertex list
     * @param {number} i1 the second endpoint index into the vertex list
     * @param {number} c the color index into the color list
     * @returns a new {@code LineSegment} containing the given data.
     */
    static buildVertexColor(i0 = 0, i1 = 1, c = 0)
    {
        return new LineSegment(new Array(i0, i1),
                               new Array(c, c));
    }


    /**
     * Construct a {@code LineSegment} using the 2 integer indexes for the
     * vertexes and the 2 integer indexes for the colors.
     * Note: Uses 0 and 1 as the default first and second indexes.
     *
     * @param {number} i0 the first endpoint index into the vertex list
     * @param {number} i1 the second endpoint index into the vertex list
     * @param {number} c0 the first endopoint color index int the color list
     * @param {number} c1 the second endpoint color index into the color list
     * @returns a new {@code LineSegment} containing the given data.
     */
    static buildVertexColors(i0 = 0, i1 = 1, c0 = 0, c1 = 1)
    {
        return new LineSegment(new Array(i0, i1),
                               new Array(c0, c1));
    }


    /**
     * For debugging.
     *
     * @returns {string} representation of this {@code LineSegment}
     */
    toString()
    {
        return ("LineSegment: ([" + this.getVertexIndexList()[0] + ", " + this.getVertexIndexList()[1] + "], "
                            + "[" + this.getColorIndexList()[0]  + ", " + this.getColorIndexList()[1] + "])");
    }
}