/**
 * Renderer 13. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
 */

import {Primitive} from "./PrimitiveExport.js";

/**
   A {@code Points} object has {@code n} integers that
   represent points in space and another {@code n}
   integers that represent the {@link java.awt.Color} at
   each of those points.
<p>
   The integers are indices into the {@link renderer.scene.Vertex}
   and {@link java.awt.Color} lists of a {@link renderer.scene.Model}
   object.
*/

export default class Points extends Primitive
{
    /**@type {number}*/ radius = 0;

    /**
      Construct a {@code Points} object using the two given
      {@link List}s of integer indices.
      <p>
      NOTE: This constructor does not put any {@link renderer.scene.Vertex}
      or {@link java.awt.Color} objects into this {@link Primitive}'s
      {@link renderer.scene.Model} object. This constructor assumes that
      the given indices are valid (or will be valid by the time this
      {@link Primitive} gets rendered).

      @param {number[]} vIndexList  {@link Array} of integer indices into a {@link renderer.scene.Vertex} list
      @param {number[]} cIndexList  {@link Array} of integer indices into a {@link java.awt.Color} list
   */
    constructor(vIndexList, cIndexList)
    {
        super(vIndexList, cIndexList);
    }

    /**
       Construct a {@code Points} with the given array of indices for
       the {@link renderer.scene.Vertex} and {@link java.awt.Color} index lists.
       <p>
       NOTE: This constructor does not put any {@link renderer.scene.Vertex}
       or {@link java.awt.Color} objects into this {@link Primitive}'s
       {@link renderer.scene.Model} object. This constructor assumes that
       the given indices are valid (or will be valid by the time this
       {@link Primitive} gets rendered).
       
       @param {... number} indices  array of {@link renderer.scene.Vertex} and {@link java.awt.Color} indices to place in this {@code Points}
       @returns {Points} the Points object constructed from the given indices
    */
    static buildIndices(... indices)
    {
        return new Points(indices, indices);
    }

    /**
     * For Debugging.
     * 
     * @return {string} representation of this Points
     */
    toString()
    {
        let result = "Points: ([";
        for(let i = 0; i < this.vIndexList.length -1; ++i)
            result += this.vIndexList[i] + ", ";
        result += this.vIndexList[this.vIndexList.length -1] + "], [";

        for(let i = 0; i < this.cIndexList.length -1; ++i)
            result += this.cIndexList[i] + ", ";
        result += this.cIndexList[this.cIndexList.length-1] + "])";
        
        result += "radius = " + this.radius;

        return result;
    }

}