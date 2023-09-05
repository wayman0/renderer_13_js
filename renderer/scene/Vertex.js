/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   A {@code Vertex} object has four doubles which represent the
   homogeneous coordinates of a point in 3-dimensional space.
   The fourth, homogeneous, coordinate will usually be 1, but in
   some stages of the graphics rendering pipeline it can be some
   other (non-zero) number.
<p>
   When a {@code Vertex} object is created in a client program,
   before the {@code Vertex} object moves down the graphics rendering
   pipeline, the coordinates in the {@code Vertex} will be in
   some model's local coordinate system.
<p>
   As a {@code Vertex} object moves down the graphics rendering
   pipeline, the coordinates in the {@code Vertex} will be transformed
   from one coordinate system to another.
<p>
   A {@code Vertex} object is immutable, so after it gets created it
   cannot be modified (mutated). So a {@code Vertex} object does not
   really "move" down the graphics pipeline. When a {@code Vertex}
   object needs to be transformed, we replace it, with a new
   {@code Vertex} object, instead of mutating it.
*/

// @ts-check
import {Camera, Matrix, Model, OrthoNorm, PerspNorm, Position, Scene, Vector} from "./SceneExport.js";
import {format} from "../scene/util/UtilExport.js";

export default class Vertex
{
    /** @type {number} #x the x value of this vector*/ #x;
    /** @type {number} #y the y value of this vector*/ #y;
    /** @type {number} #z the z value of this vector*/ #z;
    /** @type {number} #w the w value of this vector*/ #w;

    /**
      Construct a new {@code Vertex} with the given homogeneous coordinates.
      Uses the default value of 1 for w if not given.

      @param {number} x  x-coordinate of the new {@code Vertex}
      @param {number} y  y-coordinate of the new {@code Vertex}
      @param {number} z  z-coordinate of the new {@code Vertex}
      @param {number} w  w-coordinate of the new {@code Vertex}
   */
    constructor(x, y, z, w = 1.0)
    {
        if (typeof x != "number" ||
            typeof y != "number" ||
            typeof z != "number" ||
            typeof w != "number")
                throw new Error("All parameters must be numerical");

        this.#x = x;
        this.#y = y;
        this.#z = z;
        this.#w = w;
    }


    /**
     * @returns {number} the x value of this {@code Vertex}
     */
    getX()
    {
        return this.#x;
    }

    /**
     * @returns {number} the x value of this {@code Vertex}
     */
    get x()
    {
        return this.#x;
    }


    /**
     * @returns {number} the y value of this {@code Vertex}
     */
    getY()
    {
        return this.#y;
    }

    /**
     * @returns {number} the y value of this {@code Vertex}
     */
    get y()
    {
        return this.#y;
    }


    /**
     * @returns {number} the z value of this {@code Vertex}
     */
    getZ()
    {
        return this.#z;
    }

    /**
     * @returns {number} the z value of this {@code Vertex}
     */
    get z()
    {
        return this.#z;
    }


    /**
     * @returns {number} the w value of this {@code Vertex}
     */
    getW()
    {
        return this.#w;
    }

    /**
     * @returns {number} the x value of this {@code Vertex}
     */
    get w()
    {
        return this.#w
    }


   /**
    * For debugging.
    *
    * @returns {string} the string representation of this {@code Vertex}
    */
    toString()
    {
        return format("(x, y, z, w) = (%3.5d, %3.5d, %3.5d, %3.5d)", this.#x, this.#y, this.#z, this.#w);
    }

    static main()
    {
        console.log("Creating vertex v1 = 1, 1, 1, 1");
        const v1 = new Vertex(1, 1, 1);

        console.log("Checking functions of v1");

        console.log("")
        console.log("v1.x: ");
        console.log(v1.x);
        console.log("v1.getX(): ");
        console.log(v1.getX());

        console.log("");
        console.log("v1.y: ");
        console.log(v1.y);
        console.log("v1.getY(): ");
        console.log(v1.getY());

        console.log("");
        console.log("v1.z: ");
        console.log(v1.z);
        console.log("v1.getZ(): ");
        console.log(v1.getZ());

        console.log("");
        console.log("v1.w: ");
        console.log(v1.w);
        console.log("v1.getW(): ");
        console.log(v1.getW());

        console.log("");
        console.log("v1: ");
        console.log(v1);
        console.log("v1.toString(): ");
        console.log(v1.toString());
   }
}

