/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   A {@code Matrix} object has four {@link Vector} objects.
<p>
   The four {@link Vector} objects represent the four column vectors
   of the 4-by-4 matrix (as in a Linear Algebra course).
<p>
   In computer graphics, the points and vectors of 3-dimensional space
   are represented using 4-dimensional homogeneous coordinates.
   So each transformation of 3-dimensional space is represented by
   a 4-by-4 (homogeneous) matrix.
<p>
   A 4-by-4 matrix represents a transformation of 3-dimensional space.
   The most common transformations are translation, rotation, and
   scaling. A 4-by-4 matrix can also represent a projection transformation.
*/
//@ts-check
import {format} from "../scene/util/UtilExport.js";
import {Camera, Model, OrthoNorm, PerspNorm, Position, Scene, Vector, Vertex} from "./SceneExport.js";

export default class Matrix
{

   /** @type {Vector} v1 the first column vector of this matrix*/ v1;
   /** @type {Vector} v2 the second column vector of this matrix*/ v2;
   /** @type {Vector} v3 the third column vector of this matrix*/ v3;
   /** @type {Vector} v4 the fourth column vector of this matrix*/ v4;
   /** @type {boolean} #instantiable, allows private constructor*/ static #instantiable = false;

   /**
    * Construct an arbitrary 4x4 {@code Matrix} with the given column {@link Vector}s.
    *
    * NOTE: Use the Static Factory methods to create a matrix.
    * This is for internal use only.
    *
    * @param {Vector} v1 1st column for the new {@code Matrix}
    * @param {Vector} v2 2nd column for the new {@code Matrix}
    * @param {Vector} v3 3rd column for the new {@code Matrix}
    * @param {Vector} v4 4th column for the new {@code Matrix}
    */
   constructor(v1, v2, v3, v4)
   {
      if (Matrix.#instantiable == false)
         throw new Error("NON INSTANTIABLE Class");

      if (v1 instanceof Vector == false ||
          v2 instanceof Vector == false ||
          v3 instanceof Vector == false ||
          v4 instanceof Vector == false)
            throw new Error("All parameters must be Vectors");

      this.v1 = v1;
      this.v2 = v2;
      this.v3 = v3;
      this.v4 = v4;

      Matrix.#instantiable = false;
   }


   /**
    * This is a static Factory method.
    *
    * Construct a 4x4 {@code Matrix} using the given column {@link Vector}s.
    * @param {Vector} c1 1st column for the new {@code Matrix}
    * @param {Vector} c2 2nd column for the new {@code Matrix}
    * @param {Vector} c3 3rd column for the new {@code Matrix}
    * @param {Vector} c4 4th column for the new {@code Matrix}
    * @returns {Matrix} a new {@code Matrix} made from c1, c2, c3, c4
    */
   static buildFromColumns(c1, c2, c3, c4)
   {
      Matrix.#instantiable = true;
      return new Matrix(c1, c2, c3, c4);
   }


   /**
    * This is a static factory method.
    *
    * Construct a 4x4 {@code Matrix} using the given row {@link Vector}s.
    * @param {Vector} r1 1st row for the new {@code Matrix}
    * @param {Vector} r2 2nd row for the new {@code Matrix}
    * @param {Vector} r3 3rd row for the new {@code Matrix}
    * @param {Vector} r4 4th row for the new {@code Matrix}
    * @returns {Matrix} a new {@code Matrix} made from r1, r2, r3, r4
    */
   static buildFromRows(r1, r2, r3, r4)
   {
      if (r1 instanceof Vector == false ||
          r2 instanceof Vector == false ||
          r3 instanceof Vector == false ||
          r4 instanceof Vector == false)
            throw new Error("All parameters must be Vectors");

      const c1 = new Vector(r1.x, r2.x, r3.x, r4.x);
      const c2 = new Vector(r1.y, r2.y, r3.y, r4.y);
      const c3 = new Vector(r1.z, r2.z, r3.z, r4.z);
      const c4 = new Vector(r1.w, r2.w, r3.w, r4.w);

      Matrix.#instantiable = true;

      return new Matrix(c1, c2, c3, c4);
   }


   /**
    * This is a static factory method.
    * Construct an identity {@code Matrix}.
    *
    * @returns {Matrix} an identity {@code Matrix}
    */
   static identity()
   {
      return Matrix.scaleXYZ(1, 1, 1);
   }


   /**
    * This is a static Factory Method.
    * Construct a translation {@code Matrix} that translates by the
    * given amounts in the x, y, and z directions.
    *
    * @param {number } x translation factor for the x direction.
    * @param {number} y translation factor for the y direction.
    * @param {number} z translation factor for the z direction.
    * @returns {Matrix} a new translation {@code Matrix}
    */
   static translate(x, y, z)
   {
      if (typeof x != "number"
       || typeof y != "number"
       || typeof z != "number")
         throw new Error("All parameters must be numerical");

      Matrix.#instantiable = true;
      return new Matrix(new Vector(1, 0, 0, 0),
                        new Vector(0, 1, 0, 0),
                        new Vector(0, 0, 1, 0),
                        new Vector(x, y, z, 1));
   }


   /**
    * This is a static Factory method.
    * Construct a diagonal {@code Matrix} with the given number on the diagonal.
    * @param {number} d the diagonal value for the new {@code Matrix}
    * @returns {Matrix} a new scale {@code Matrix}
    */
   static scale(d)
   {
      if (typeof d != "number")
         throw new Error("D must be numerical");

      return Matrix.scaleXYZ(d, d, d);
   }


   /**
    * This is a static factory mehtod.
    * Construct a diagonal {@code Matrix} that scales in the
    * x, y, and z directions by the given values.
    *
    * @param {number} x scale factor for the x direction
    * @param {number} y scale factor for the y direction
    * @param {number} z scale factor for the z direction
    * @returns {Matrix} a new scaling {@code Matrix}
    */
   static scaleXYZ(x, y, z)
   {
      if (typeof x != "number"
       || typeof y != "number"
       || typeof z != "number")
         throw new Error("All parameters must be numercial");

      Matrix.#instantiable = true;
      return new Matrix(new Vector(x, 0, 0, 0),
                        new Vector(0, y, 0, 0,),
                        new Vector(0, 0, z, 0),
                        new Vector(0, 0, 0, 1));
   }


   /**
    * This is a static factory mehtod.
    * Construct a rotation {@code Matrix} that rotates around
    * the x axis by the given angle theta.
    *
    * @param {number} theta angle in degrees to rotate around the x axis by
    * @returns {Matrix} a new rotation {@code Matrix}
    */
   static rotateX(theta)
   {
      if (typeof theta != "number")
         throw new Error("Theta must be numerical");

      Matrix.#instantiable = true;
      return Matrix.rotate(theta, 1, 0, 0);
   }


   /**
    * This is a static factory mehtod.
    * Construct a rotation {@code Matrix} that rotates around
    * the y axis by the given angle theta.
    *
    * @param {number} theta angle in degrees to rotate around the y axis by
    * @returns {Matrix} a new rotation {@code Matrix}
    */
   static rotateY(theta)
   {
      if (typeof theta != "number")
         throw new Error("Theta must be numerical");

      Matrix.#instantiable = true;
      return Matrix.rotate(theta, 0, 1, 0);
   }


   /**
    * This is a static factory mehtod.
    * Construct a rotation {@code Matrix} that rotates around
    * the z axis by the given angle theta.
    *
    * @param {number} theta angle in degrees to rotate around the z axis by
    * @returns {Matrix} a new rotation {@code Matrix}
    */
   static rotateZ(theta)
   {
      if (typeof theta != "number")
         throw new Error("Theta must be numerical");

      Matrix.#instantiable = true;
      return Matrix.rotate(theta, 0, 0, 1);
   }


   /**
      This is a static facory method.
      <p>
      Construct a rotation {@code Matrix} that rotates around
      the axis vector {@code (x,y,z)} by the angle {@code theta}.
      <p>
      See
      <a href="https://www.opengl.org/sdk/docs/man2/xhtml/glRotate.xml" target="_top">
               https://www.opengl.org/sdk/docs/man2/xhtml/glRotate.xml</a>

    * @param {number} theta angle in degrees to rotate around the axis vector by
    * @param {number} x the x component of the axis vector to rotate around
    * @param {number} y the y component of the axis vector to rotate around
    * @param {number} z the z component of the axis vector to rotate around
    * @returns {Matrix} a new rotation {@code Matrix}
    */
   static rotate(theta, x, y, z)
   {
      if (typeof theta != "number" ||
          typeof x != "number" ||
          typeof y != "number" ||
          typeof z != "number")
            throw new Error("All parameters need to be numerical");

      const norm = Math.sqrt(x*x + y*y + z*z);
      const ux = x/norm;
      const uy = y/norm;
      const uz = z/norm;

      const c = Math.cos( Math.PI/180 * theta);
      const s = Math.sin( Math.PI/180 * theta);

      Matrix.#instantiable = true;
      return new Matrix(
		         new Vector(ux*ux*(1-c)+c,      uy*ux*(1-c)+(uz*s), uz*ux*(1-c)-(uy*s), 0.0),
                 new Vector(ux*uy*(1-c)-(uz*s), uy*uy*(1-c)+c,      uz*uy*(1-c)+(ux*s), 0.0),
                 new Vector(ux*uz*(1-c)+(uy*s), uy*uz*(1-c)-(ux*s), uz*uz*(1-c)+c,      0.0),
                 new Vector(0.0,                0.0,                0.0,                1.0));

   }


   /**
    * A scalar times this {@code Matrix} returns a new {@code Matrix}.
    *
    * @param {number} s scalar value to multiply this {@code Matrix} by
    * @returns {Matrix} a new scaled {@code Matrix} = this * s
    */
   timesScalar(s)
   {
      if (typeof s != "number")
         throw new Error("S must be numerical");

      Matrix.#instantiable = true;
      return new Matrix(this.v1.timesScalar(s),
                        this.v2.timesScalar(s),
                        this.v3.timesScalar(s),
                        this.v4.timesScalar(s));
   }


   /**
    * This {@code Matrix} times a {@link Vertex} returns a new {@link Vertex}.
    *
    * @param {Vertex} v the vertex to be multiplied by this {@code Matrix}
    * @returns {Vertex}  a new {@link Vertex} = this * v
    */
   timesVertex(v)
   {
      if (v instanceof Vertex == false)
         throw new Error("V must be a Vertex");

      const newX = this.v1.x * v.x + this.v2.x * v.y + this.v3.x * v.z + this.v4.x * v.w;
      const newY = this.v1.y * v.x + this.v2.y * v.y + this.v3.y * v.z + this.v4.y * v.w;
      const newZ = this.v1.z * v.x + this.v2.z * v.y + this.v3.z * v.z + this.v4.z * v.w;
      const newW = this.v1.w * v.x + this.v2.w * v.y + this.v3.w * v.z + this.v4.w * v.w;

      return new Vertex(newX, newY, newZ, newW);
   }


   /**
    * This {@code Matrix} times a {@link Vector} returns a new {@link Vector}.
    *
    * @param {Vector} v the vector to be multiplied by this {@code Matrix}
    * @returns {Vector}  a new {@link Vector} = this * v
    */
   timesVector(v)
   {
      if (v instanceof Vector == false)
         throw new Error("V is not a Vector");

      const newX = this.v1.x * v.x + this.v2.x * v.y + this.v3.x * v.z + this.v4.x * v.w;
      const newY = this.v1.y * v.x + this.v2.y * v.y + this.v3.y * v.z + this.v4.y * v.w;
      const newZ = this.v1.z * v.x + this.v2.z * v.y + this.v3.z * v.z + this.v4.z * v.w;
      const newW = this.v1.w * v.x + this.v2.w * v.y + this.v3.w * v.z + this.v4.w * v.w;

      return new Vector(newX, newY, newZ, newW);
   }


   /**
    * This {@code Matrix} times {@code Matrix} returns a new {@code Matrix}.
    *
    * @param {Matrix} m the matrix to be multiplied on the right of this {@code Matrix}
    * @returns {Matrix}  a new {@code Matrix} = this * m
    */
   timesMatrix(m)
   {
      if (m instanceof Matrix == false)
         throw new Error("M is not a Matrix");

      Matrix.#instantiable = true;
      return new Matrix(this.timesVector(m.v1),
                        this.timesVector(m.v2),
                        this.timesVector(m.v3),
                        this.timesVector(m.v4));
   }


   /**
    * Mutate this {@code Matrix} to contain the product of this * s.
    *
    * @param {number} s the number to scale this {@code Matrix} by
    * @returns {Matrix}  a reference to this scaled {@code Matrix}
    */
   timesEqualsScalar(s)
   {
      if (typeof s != "number")
         throw new Error("S is not numerical");

      this.v1.timesEqualsScalar(s);
      this.v2.timesEqualsScalar(s);
      this.v3.timesEqualsScalar(s);
      this.v4.timesEqualsScalar(s);

      return this;
   }


   /**
    * Mutate this {@code Matrix} to contain the product of this * m.
    * @param {Matrix} m the matrix to be multiplied on the right of this {@link Matrix}
    * @returns {Matrix}  a reference to this multiplied {@ Matrix} to facilitate chaining methods
    */
   mult(m)
   {
      if (m instanceof Matrix == false)
         throw new Error("M is not a Matrix");

      let x = 0, y = 0, z = 0, w = 0;
      x = m.v1.x;
      y = m.v1.y;
      z = m.v1.z;
      w = m.v1.w;
      const x1 = this.v1.x * x + this.v2.x * y + this.v3.x * z + this.v4.x * w;
      const y1 = this.v1.y * x + this.v2.y * y + this.v3.y * z + this.v4.y * w;
      const z1 = this.v1.z * x + this.v2.z * y + this.v3.z * z + this.v4.z * w;
      const w1 = this.v1.w * x + this.v2.w * y + this.v3.w * z + this.v4.w * w;

      x = m.v2.x;
      y = m.v2.y;
      z = m.v2.z;
      w = m.v2.w;
      const x2 = this.v1.x * x + this.v2.x * y + this.v3.x * z + this.v4.x * w;
      const y2 = this.v1.y * x + this.v2.y * y + this.v3.y * z + this.v4.y * w;
      const z2 = this.v1.z * x + this.v2.z * y + this.v3.z * z + this.v4.z * w;
      const w2 = this.v1.w * x + this.v2.w * y + this.v3.w * z + this.v4.w * w;

      x = m.v3.x;
      y = m.v3.y;
      z = m.v3.z;
      w = m.v3.w;
      const x3 = this.v1.x * x + this.v2.x * y + this.v3.x * z + this.v4.x * w;
      const y3 = this.v1.y * x + this.v2.y * y + this.v3.y * z + this.v4.y * w;
      const z3 = this.v1.z * x + this.v2.z * y + this.v3.z * z + this.v4.z * w;
      const w3 = this.v1.w * x + this.v2.w * y + this.v3.w * z + this.v4.w * w;

      x = m.v4.x;
      y = m.v4.y;
      z = m.v4.z;
      w = m.v4.w;
      const x4 = this.v1.x * x + this.v2.x * y + this.v3.x * z + this.v4.x * w;
      const y4 = this.v1.y * x + this.v2.y * y + this.v3.y * z + this.v4.y * w;
      const z4 = this.v1.z * x + this.v2.z * y + this.v3.z * z + this.v4.z * w;
      const w4 = this.v1.w * x + this.v2.w * y + this.v3.w * z + this.v4.w * w;

      this.v1.x = x1;
      this.v1.y = y1;
      this.v1.z = z1;
      this.v1.w = w1;

      this.v2.x = x2;
      this.v2.y = y2;
      this.v2.z = z2;
      this.v2.w = w2;

      this.v3.x = x3;
      this.v3.y = y3;
      this.v3.z = z3;
      this.v3.w = w3;

      this.v4.x = x4;
      this.v4.y = y4;
      this.v4.z = z4;
      this.v4.w = w4;

      return this;
   }


   /**
    * Mutate this {@code Matrix} to contain the product of m * this.
    * @param {Matrix} m the matrix to be multiplied on the left of this {@code Matrix}
    * @returns {Matrix}  a reference to this multiplied {@code Matrix} for method chaining
    */
   multLeft(m)
   {
      if (m instanceof Matrix == false)
         throw new Error("M is not a  Matrix");

      this.v1.timesEqualsMatrix(m);
      this.v2.timesEqualsMatrix(m);
      this.v3.timesEqualsMatrix(m);
      this.v4.timesEqualsMatrix(m);

      return this;
   }


   /**
    * For debugging.
    *
    * @returns {string} representation of this {@code Matrix}
    */
   toString()
   {
      let result = "";

      result += format("[[%3.5f  %3.5f  %3.5f  %3.5f ]\n", this.v1.x, this.v2.x, this.v3.x, this.v4.x);
      result += format(" [%3.5f  %3.5f  %3.5f  %3.5f ]\n", this.v1.y, this.v2.y, this.v3.y, this.v4.y);
      result += format(" [%3.5f  %3.5f  %3.5f  %3.5f ]\n", this.v1.z, this.v2.z, this.v3.z, this.v4.z);
      result += format(" [%3.5f  %3.5f  %3.5f  %3.5f ]]",  this.v1.w, this.v2.w, this.v3.w, this.v4.w);

      //result += "[[" + this.v1.x + " " + this.v2.x + " " + this.v3.x + " " + this.v4.x + "]\n";
      //result += " [" + this.v1.y + " " + this.v2.y + " " + this.v3.y + " " + this.v4.y + "]\n";
      //result += " [" + this.v1.z + " " + this.v2.z + " " + this.v3.z + " " + this.v4.z + "]\n";
      //result += " [" + this.v1.w + " " + this.v2.w + " " + this.v3.w + " " + this.v4.w + "]]\n";

      return result;
   }


   /**
    * Static function used to test methods.
    */
    static main()
    {
        console.log("Creating vector v1 = new Vector(1, 2, 3)");
        console.log("Creating vector v2 = new Vector(4, 5, 6)");
        console.log("Creating vector v3 = new Vector(7, 8, 9)");
        console.log("Creating vector v4 = new Vector(10, 11, 12)");
        const v1 = new Vector(1, 2, 3), v2 = new Vector(4, 5, 6);
        const v3 = new Vector(7, 8, 9), v4 = new Vector(10, 11, 12);

        console.log("");
        console.log("Creating m1 = buildColumns(v1, v2, v3, v4) : ");
        const m1 = Matrix.buildFromColumns(v1, v2, v3, v4);
        console.log(m1.toString());

        console.log("");
        console.log("Creating m2 = buildRows(v1, v2, v3, v4): ");
        const m2 = Matrix.buildFromRows(v1, v2, v3, v4);
        console.log(m2.toString());

        console.log("");
        console.log("Creating id = identity(): ");
        const id = Matrix.identity();
        console.log(id.toString());

        console.log("");
        console.log("Creating trans = translate(1, 1, 1): ");
        const trans = Matrix.translate(1, 1, 1);
        console.log(trans.toString());

        console.log("");
        console.log("Creating sc = scale(2): ");
        const sc = Matrix.scale(2);
        console.log(sc.toString());

        console.log("");
        console.log("Creating scXYZ = scale(3, 3, 3): ");
        const scXYZ = Matrix.scaleXYZ(3, 3, 3);
        console.log(scXYZ.toString());

        console.log("");
        console.log("Creating rotX = rotateX(90): ");
        const rotX = Matrix.rotateZ(90);
        console.log(rotX.toString());

        console.log("");
        console.log("Creating rotY = rotateY(90): ");
        const rotY = Matrix.rotateY(90);
        console.log(rotY.toString());

        console.log("");
        console.log("Creating rotZ = rotateZ(90): ");
        const rotZ = Matrix.rotateZ(90);
        console.log(rotZ.toString());

        console.log("");
        console.log("Creating rot = rotate(90, 1, 1, 1): ");
        const rot = Matrix.rotate(90, 1, 1, 1);
        console.log(rot.toString());

        console.log("");
        console.log("Creating timesSC = m1.timesScalar(5): ");
        const timesSC = m1.timesScalar(5);
        console.log(timesSC.toString());

        console.log("");
        console.log("Creating timesVert = m1.timesVertex(new Vertex(10, 10, 10)): ");
        const timesVert = m1.timesVertex(new Vertex(10, 10, 10));
        console.log(timesVert.toString());

        console.log("");
        console.log("Creating timesVect = m1.timesVect(v1): ");
        const timesVect = m1.timesVector(v1);
        console.log(timesVect.toString());


        console.log("");
        console.log("Outputing m1 and m2 to allow for checking of subsequent functions");
        console.log(m1.toString());
        console.log(m2.toString());


        // this is wrong doesn't give right answer when checked using calculator
        console.log("");
        console.log("Creating timesMat = m1.timesMatrix(m2): ");
        const timesMat = m1.timesMatrix(m2);
        console.log(timesMat.toString());


        //can comment out to allow for checking of m1.timesMatrix vs m1.mult

        // this is wrong, v3 doesn't get multiplied right
        console.log("");
        console.log("m1.timesEqualsScalar(5): ");
        m1.timesEqualsScalar(5);
        console.log(m1.toString());


        console.log("");
        console.log("m1.mult(m2): ");
        m1.mult(m2);
        console.log(m1.toString());

        // this throws a m is not a matrix error but m1 is made using constructor
        // it throws the error whether done before or after m1.mult(m2) so can't be
        // that m1 got mutated.
        console.log("");
        console.log("m2.multLeft(m1): ");
        m2.multLeft(m1);
        console.log(m2.toString());
    }
}