/**
 * Renderer 13. The MIT License
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details
 */

import {Primitive} from "./PrimitiveExport.js";

/**
   A {@code Lines} object has {@code 2n} integers that
   represent the endpoints of {@code n} line segments
   and another {@code 2n} integers that represent the
   {@link java.awt.Color} at each of those endpoints.
<p>
   The integers are indices into the {@link renderer.scene.Vertex}
   and {@link java.awt.Color} lists of a {@link renderer.scene.Model}
   object.
*/

export default class Lines extends Primitive
{
    /**
      Construct a {@code Lines} with the given array of indices for
      the {@link renderer.scene.Vertex} and {@link java.awt.Color} index lists.
      <p>
      NOTE: This constructor does not put any {@link renderer.scene.Vertex}
      or {@link java.awt.Color} objects into this {@link Primitive}'s
      {@link renderer.scene.Model} object. This constructor assumes that
      the given indices are valid (or will be valid by the time this
      {@link Primitive} gets rendered).

      @param indices  array of {@link renderer.scene.Vertex} and {@link java.awt.Color} indices to place in this {@code Lines}
    */
    constructor(... indices)
    {
        super(indices, indices);
    }

    /**
     * For Debugging.
     * 
     * @return {string} representation of this Lines
     */
    toString()
    {
        let result = "Lines: ([";
        for(let i = 0; i < this.vIndexList.length -1; ++i)
            result += this.vIndexList[i] + ", ";
        result += this.vIndexList[this.vIndexList.length -1] + "], [";

        for(let i = 0; i < this.cIndexList.length -1; ++i)
            result += this.cIndexList[i] + ", ";
        result += this.cIndexList[this.cIndexList.length-1] + "])";

        return result;
    }

}