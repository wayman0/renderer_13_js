//@ts-check

import {Model, Vertex, LineSegment, Matrix} from "../../renderer/scene/SceneExport.js";

export default class RobotArmModel1 extends Model
{
    shoulderRotation = 0.0;
    elbowRotation = 0.0;
    wristRotation = 0.0;
    fingerRotation = 0.0;

    shoulderLength;
    elbowLength;
    wristLength;
    fingerLength;

    #elbow = Model.buildName("Elbow");
    #wrist = Model.buildName("Wrist");
    #finger = Model.buildName("Finger");

    /**
     * 
     * @param {string} name 
     * @param {number} sLength 
     * @param {number} eLength 
     * @param {number} wLength 
     * @param {number} fLength 
     */
    constructor(name, sLength, eLength, wLength, fLength)
    {
        super(undefined, undefined, undefined, undefined, undefined, name);

        this.shoulderLength = sLength;
        this.elbowLength = eLength;
        this.wristLength = wLength;
        this.fingerLength = fLength;

        const v0 = new Vertex(0, 0, 0);
        const v1 = new Vertex(1, 0, 0);

        this.addVertex(v0, v1);
        this.addPrimitive(LineSegment.buildVertex(0, 1));

        this.#elbow.addVertex(v0, v1);
        this.#elbow.addPrimitive(LineSegment.buildVertex(0, 1));
        this.addNestedModel(this.#elbow);

        this.#wrist.addVertex(v0, v1);
        this.#wrist.addPrimitive(LineSegment.buildVertex(0, 1));
        this.#elbow.addNestedModel(this.#wrist);

        this.#finger.addVertex(v0, v1);
        this.#finger.addPrimitive(LineSegment.buildVertex(0, 1));
        this.#wrist.addNestedModel(this.#finger);

        this.updateMatrices();
    }

    updateMatrices()
    {
        this.matrix = Matrix.rotateZ(this.shoulderRotation)
                        .timesMatrix(Matrix.scaleXYZ(this.shoulderLength, 
                                                     this.shoulderLength, 
                                                     1));

        this.#elbow.matrix = Matrix.translate(1, 0, 0)
                                .timesMatrix(Matrix.rotateZ(this.elbowRotation))
                                .timesMatrix(Matrix.scaleXYZ(this.elbowLength/this.shoulderLength, 
                                                             this.elbowLength/this.shoulderLength, 
                                                             1));

        this.#wrist.matrix = Matrix.translate(1, 0, 0)
                                .timesMatrix(Matrix.rotateZ(this.wristRotation))
                                .timesMatrix(Matrix.scaleXYZ(this.wristLength/this.elbowLength, 
                                                             this.wristLength/this.elbowLength, 
                                                             1));

        this.#finger.matrix = Matrix.translate(1, 0, 0)
                                .timesMatrix(Matrix.rotateZ(this.fingerRotation))
                                .timesMatrix(Matrix.scaleXYZ(this.fingerLength/this.wristLength, 
                                                             this.fingerLength/this.wristLength, 
                                                             1));

    }

    get elbow() { return this.#elbow; }

    get wrist() { return this.#wrist; }

    get finger() { return this.#finger; }
}