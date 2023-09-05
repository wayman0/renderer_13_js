/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   A {@code Primitive} is something that we can build
   geometric shapes out of (a "graphics primitive").
<p>
   See <a href="https://en.wikipedia.org/wiki/Geometric_primitive" target="_top">
                https://en.wikipedia.org/wiki/Geometric_primitive</a>
<p>
   We have two geometric primitives,
   <ul>
   <li>{@link LineSegment},
   <li>{@link Point}.
   </ul>
<p>
   Each {@code Primitive} holds two lists of integer indices.
<p>
   One list is of indices into its {@link renderer.scene.Model}'s
   {@link List} of {@link renderer.scene.Vertex} objects. These
   are the vertices that determine the primitive's geometry.
<p>
   The other list is of indices into its {@link renderer.scene.Model}'s
   {@link List} of {@link java.awt.Color} objects.
<p>
   The two lists of integer indices must always have the same
   length. For every {@link renderer.scene.Vertex} index in a
   {@code Primitive} there must be a {@link java.awt.Color} index.
*/
/*
   NOTE: The Primitive class could be an inner class of
         the Model class. Then each Primitive object would
         automatically have access to the actual Vertex and
         Color lists that the Primitive is indexing into.
*/

//@ts-check
export default class Primitive
{
    /**@type {number[]} the array of vertex indexes into the models vertex list for this primitive*/ #vIndexList;
    /**@type {number[]} the array of color indexes into the models color listfor this primitive*/ #cIndexList;

    /**
     * Construct a {@code Primitive} using the two given {@link Array} of integer inexes.
     * <p>
     * NOTE: This constructor does not put any {@link renderer.scene.Vertex}
      or {@link renderer.color.Color} objects into this {@link Primitive}'s
      {@link renderer.scene.Model} object. This constructor assumes that
      the given indices are valid (or will be valid by the time this
      {@link Primitive} gets rendered).
      <p>
      NOTE: Uses the default values of empty arrays.

     * @param {number[]} [vIndList=new Array()] the list of integer indexes into the {@link renderer.scene.Vertex} list
     * @param {number[]} [cIndList=new Array()] the list of integer indexes into the {@link renderer.color.Color} list
     */
    constructor(vIndList = new Array(), cIndList = new Array())
    {
        if (! Array.isArray(vIndList) ||
            ! Array.isArray(cIndList))
            throw new Error("Vertex and Color index lists must be Array types");

        // If the user pases an empty array have to make sure the check accounts for that
        // hence why making sure the data is okay to be undefined.
        for (let x = 0; x < vIndList.length; x += 1)
        {
            if (typeof vIndList[x] != "number" &&
                typeof vIndList[x] != undefined)
            {
                throw new Error("All Vertex indexes must be numerical");
			}
		}

        for (let y = 0; y < cIndList.length; y += 1)
        {
            if (typeof cIndList[y] != "number" &&
                typeof cIndList[y] != undefined)
            {
                throw new Error("All Color indexes must be numerical");
			}
		}

        this.#vIndexList = vIndList;
        this.#cIndexList = cIndList;
    }


    /**
     * Construct a {@code Primitive} with the given array of indices for the
      {@link renderer.scene.Vertex} and {@link renderer.color.Color} index lists.
      <p>
      NOTE: This constructor does not put any {@link renderer.scene.Vertex}
      or {@link renderer.color.Color} objects into this {@link Primitive}'s
      {@link renderer.scene.Model} object. This constructor assumes that
      the given indices are valid (or will be valid by the time this
      {@link Primitive} gets rendered).

     * @param  {...number} indices array of indexes into the vertex and color list to place in this {@code Primitve}
     * @returns a new {@code Primitive} created from the given indexes
     */
    static buildIndices(...indices)
    {
        let thisP = new Primitive();

        for (let i of indices)
        {
            if (typeof i == "number")
            {
                thisP.addIndices(i, i);
			}
            else
            {
                throw new Error("indice " + i + " must be numerical");
			}
        }

        return thisP;
    }


    /**
     * Add the given array of indices to the {@link renderer.scene.Vertex}
      and {@link java.awt.Color} index lists.
      <p>
      NOTE: This method does not put any {@link renderer.scene.Vertex}
      or {@link java.awt.Color} objects into this {@link Primitive}'s
      {@link renderer.scene.Model} object. This method assumes that
      the given indices are valid (or will be valid by the time this
      {@link Primitive} gets rendered).
     * @param  {...any} indices array of vertex and color indexes to add to this primitive
     */
    addIndex(... indices)
    {
        for (let i of indices)
        {
            this.addIndices(i, i);
		}
    }


    /**
     * Add the given indices to the {@link renderer.scene.Vertex} and
      {@link java.awt.Color} index lists.
      <p>
      NOTE: This method does not put any {@link renderer.scene.Vertex}
      or {@link java.awt.Color} objects into this {@link Primitive}'s
      {@link renderer.scene.Model} object. This method assumes that
      the given indices are valid (or will be valid by the time this
      {@link Primitive} gets rendered).

     * @param {number} vIndex the vertex index to be added
     * @param {number} cIndex the color index to be added
     */
    addIndices(vIndex = 0, cIndex = 0)
    {
        if (typeof vIndex != "number" ||
            typeof cIndex != "number")
              throw new Error("Vertex and Color indexes must be numerical");

        this.#vIndexList[this.#vIndexList.length] = vIndex;
        this.#cIndexList[this.#cIndexList.length] = cIndex;
    }


    /**
     * Set the {@link java.awt.Color} index list to the given array of indices.
      <p>
      NOTE: This method does not put any {@link java.awt.Color} objects
      into this {@link Primitive}'s {@link renderer.scene.Model} object.
      This method assumes that the given indices are valid (or will be
      valid by the time this {@link Primitive} gets rendered).
     * @param  {...any} cIndices array of color indexes to be added
     */
    setColorIndices(... cIndices)
    {
        if (this.#cIndexList.length != cIndices.length)
            throw new Error("Wront number of color indexes");

        const origLength = this.#cIndexList.length;

        for(let x = 0; x < cIndices.length; x += 1)
        {
            if (typeof (cIndices[x]) != "number")
            {
                this.#cIndexList.length = origLength;
                throw new Error("Color index " + x + " is not numerical");
            }
            else
            {
                this.#cIndexList.push(cIndices[x]);
			}
        }

        this.#cIndexList.splice(origLength, this.#cIndexList.length);
    }


    /**
     * Give this {@code Primitive} the uniform {@link java.awt.Color} indexed
      by the given color index.
      <p>
      NOTE: This method does not put a {@link java.awt.Color} object
      into this {@link Primitive}'s {@link renderer.scene.Model} object.
      This method assumes that the given index is valid (or will be valid
      by the time this {@link Primitive} gets rendered).

     * @param {number} cIndex the color index
     */
    setColorIndex(cIndex = 0)
    {
        if (typeof cIndex != "number")
            throw new Error("Color index is not numerical");

        for (let x = 0; x < this.#cIndexList.length; x += 1)
        {
            this.#cIndexList[x] = cIndex;
		}
    }


    getVertexIndexList()
    {
        return this.#vIndexList;
    }

    get vIndexList()
    {
        return this.#vIndexList;
    }


    getColorIndexList()
    {
        return this.#cIndexList;
    }

    get cIndexList()
    {
        return this.#cIndexList;
    }
}