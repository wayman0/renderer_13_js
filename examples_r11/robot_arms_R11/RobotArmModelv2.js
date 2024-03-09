//@ts-check

import {Model, Vertex, LineSegment, Matrix} from "../../renderer/scene/SceneExport.js";

export default class RobotArmModelv2 extends Model
{
    shoulderRotation = 0.0;
    elbowRotation1 = 0.0;
    elbowRotation2 = 0.0;
    wristRotation1 = 0.0;
    wristRotation2 = 0.0;
    fingerRotation1 = 0.0;
    fingerRotation2 = 0.0;
 
    shoulderLength;
    elbowLength1;
    elbowLength2;
    wristLength1;
    wristLength2;
    fingerLength1;
    fingerLength2;

    #elbow1 = Model.buildName("Elbow_1");
    #elbow2 = Model.buildName("Elbow_2");
    #wrist1 = Model.buildName("Wrist_1");
    #wrist2 = Model.buildName("Wrist_2");
    #finger1 = Model.buildName("Finger_1");
    #finger2 = Model.buildName("Finger_2");

    /**
     * 
     * @param {string} name 
     * @param {number} sLen 
     * @param {number} eLen1 
     * @param {number} wLen1 
     * @param {number} fLen1 
     * @param {number} eLen2 
     * @param {number} wLen2 
     * @param {number} fLen2 
     */
    constructor(name, sLen, eLen1, wLen1, fLen1, eLen2, wLen2, fLen2)
    {
        super(undefined, undefined, undefined, undefined, undefined, name);

        this.shoulderLength = sLen;
        this.elbowLength1 = eLen1;
        this.elbowLength2 = eLen2;
        this.wristLength1 = wLen1;
        this.wristLength2 = wLen2;
        this.fingerLength1 = fLen1;
        this.fingerLength2 = fLen2;

        const v0 = new Vertex(0, 0, 0);
        const v1 = new Vertex(1, 0, 0);

        this.addVertex(v0, v1);
        this.addPrimitive(LineSegment.buildVertex(0, 1));

        this.#elbow1.addVertex(v0, v1);
        this.#elbow1.addPrimitive(LineSegment.buildVertex(0, 1));

        this.#elbow2.addVertex(v0, v1);
        this.#elbow2.addPrimitive(LineSegment.buildVertex(0, 1));
    
        this.#wrist1.addVertex(v0, v1);
        this.#wrist1.addPrimitive(LineSegment.buildVertex(0, 1));

        this.#wrist2.addVertex(v0, v1);
        this.#wrist2.addPrimitive(LineSegment.buildVertex(0, 1));
        
        this.#finger1.addVertex(v0, v1);
        this.#finger1.addPrimitive(LineSegment.buildVertex(0, 1));

        this.#finger2.addVertex(v0, v1);
        this.#finger2.addPrimitive(LineSegment.buildVertex(0, 1));
    
        this.addNestedModel(this.#elbow1);
        this.addNestedModel(this.#elbow2);
        this.#elbow1.addNestedModel(this.#wrist1);
        this.#elbow2.addNestedModel(this.#wrist2);
        this.#wrist1.addNestedModel(this.#finger1);
        this.#wrist2.addNestedModel(this.#finger2);

        this.updateMatrices();
    }

    updateMatrices()
    {
        // Set the nested matrices for the sub models.
        this.matrix = Matrix.rotateZ(this.shoulderRotation)
                   .timesMatrix(Matrix.scaleXYZ(this.shoulderLength,
                                                this.shoulderLength,
                                                1));

        this.#elbow1.matrix = Matrix.translate(1, 0, 0)
                     .timesMatrix(Matrix.rotateZ(this.elbowRotation1))
                     .timesMatrix(Matrix.scaleXYZ(this.elbowLength1/this.shoulderLength,
                                                  this.elbowLength1/this.shoulderLength,
                                                  1));

        this.#elbow2.matrix = Matrix.translate(1, 0, 0)
                     .timesMatrix(Matrix.rotateZ(this.elbowRotation2))
                     .timesMatrix(Matrix.scaleXYZ(this.elbowLength2/this.shoulderLength,
                                                  this.elbowLength2/this.shoulderLength,
                                                  1));

        this.#wrist1.matrix = Matrix.translate(1, 0, 0)
                     .timesMatrix(Matrix.rotateZ(this.wristRotation1))
                     .timesMatrix(Matrix.scaleXYZ(this.wristLength1/this.elbowLength1,
                                                  this.wristLength1/this.elbowLength1,
                                                  1));

        this.#wrist2.matrix = Matrix.translate(1, 0, 0)
                     .timesMatrix(Matrix.rotateZ(this.wristRotation2))
                     .timesMatrix(Matrix.scaleXYZ(this.wristLength2/this.elbowLength2,
                                                  this.wristLength2/this.elbowLength2,
                                                  1));

        this.#finger1.matrix = Matrix.translate(1, 0, 0)
                      .timesMatrix(Matrix.rotateZ(this.fingerRotation1))
                      .timesMatrix(Matrix.scaleXYZ(this.fingerLength1/this.wristLength1,
                                                   this.fingerLength1/this.wristLength1,
                                                   1));

        this.#finger2.matrix = Matrix.translate(1, 0, 0)
                      .timesMatrix(Matrix.rotateZ(this.fingerRotation2))
                      .timesMatrix(Matrix.scaleXYZ(this.fingerLength2/this.wristLength2,
                                                   this.fingerLength2/this.wristLength2,
                                                   1));
    }

    get elbow1() { return this.#elbow1; }
    get elbow2() { return this.#elbow2; }

    get wrist1() { return this.#wrist1; }
    get wrist2() { return this.#wrist2; }

    get finger1() { return this.#finger1; }
    get finger2() { return this.#finger2; }
}