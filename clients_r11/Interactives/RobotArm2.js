//@ts-check
import {Model, Vertex, LineSegment, Matrix} from "../../renderer/scene/SceneExport.js";

export default class RobotArm2 extends Model
{
    elbow1;
    elbow2;
    wrist1;
    wrist2;
    finger1;
    finger2;

    #shoulderRotation = 0;
    #elbowRotation1 = 15;
    #wristRotation1 = 0; 
    #fingerRotation1 = 0; 
    #elbowRotation2 = -15;
    #wristRotation2 = 0;
    #fingerRotation2 = 0;

    constructor(vList, pList, cList, matrix, nestedMod, name, vis)
    {
        super(vList, pList, cList, matrix, nestedMod, name, vis);

        if(nestedMod)
        {
            this.elbow1 = this.getNestedModel(0);
            this.elbow2 = this.getNestedModel(1);

            this.wrist1 = this.elbow1.getNestedModel(0);
            this.wrist2 = this.elbow1.getNestedModel(0);

            this.finger1 = this.wrist1.getNestedModel(0);
            this.finger2 = this.wrist2.getNestedModel(0);
        }
        else
        {
            this.elbow1 = new Model();
            this.elbow2 = new Model();
            this.wrist1 = new Model();
            this.wrist2 = new Model();
            this.finger1 = new Model();
            this.finger2 = new Model();
        }
    }

    /**
     * 
     * @param {string} name 
     * @param {number} sLength 
     * @param {number} eLength1 
     * @param {number} wLength1 
     * @param {number} fLength1 
     * @param {number} eLength2 
     * @param {number} wLength2 
     * @param {number} fLength2 
     */
    static buildArm(name, sLength , eLength1, wLength1, fLength1, eLength2, wLength2, fLength2)
    {
        const arm = new RobotArm2(undefined, undefined, undefined, 
                                  Matrix.rotateZ(0).timesMatrix(
                                  Matrix.scaleXYZ(sLength, sLength, 1)), 
                                  undefined, name);

        // build the elbows
        arm.elbow1 = Model.buildNameMatrix(name + ":elbow-1", 
                            Matrix.translate(1, 0, 0)
                                  .timesMatrix(Matrix.rotateZ(arm.#elbowRotation1))
                                  .timesMatrix(Matrix.scaleXYZ( eLength1/sLength, 
                                                                eLength1/sLength, 
                                                                1)));

        arm.elbow2 = Model.buildNameMatrix(name + ":elbow-2", 
                            Matrix.translate(1, 0, 0)
                                  .timesMatrix(Matrix.rotateZ(arm.#elbowRotation2))
                                  .timesMatrix(Matrix.scaleXYZ( eLength2/sLength, 
                                                                eLength2/sLength, 
                                                                1)));
                          
        // build the wrists
        arm.wrist1 = Model.buildNameMatrix(name + ":wrist-1", 
                            Matrix.translate(1, 0, 0)
                                  .timesMatrix(Matrix.rotateZ(arm.#wristRotation1))
                                  .timesMatrix(Matrix.scaleXYZ( wLength1/eLength1, 
                                                                wLength1/eLength1, 
                                                                1)));
                                    
        arm.wrist2 = Model.buildNameMatrix(name + ":wrist-2", 
                            Matrix.translate(1, 0, 0)
                                  .timesMatrix(Matrix.rotateZ(arm.#wristRotation2))
                                  .timesMatrix(Matrix.scaleXYZ( wLength2/eLength2, 
                                                                wLength2/eLength2, 
                                                                1)));
        
        
        // build the fingers
        arm.finger1 = Model.buildNameMatrix(name + ":finger-1", 
                            Matrix.translate(1, 0, 0)
                                  .timesMatrix(Matrix.rotateZ(arm.#fingerRotation1))
                                  .timesMatrix(Matrix.scaleXYZ( fLength1/eLength1, 
                                                                fLength1/eLength1, 
                                                                1)));

        arm.finger2 = Model.buildNameMatrix(name + ":finger-2", 
                            Matrix.translate(1, 0, 0)
                                  .timesMatrix(Matrix.rotateZ(arm.#fingerRotation2))
                                  .timesMatrix(Matrix.scaleXYZ( fLength2/eLength2, 
                                                                fLength2/eLength2, 
                                                                1)));

        /*
            Be sure to draw a picture of the 
            (simple) tree that arm code creates 
        */

        const v0 = new Vertex(0, 0, 0);
        const v1 = new Vertex(1, 0, 0);
        arm.addVertex(v0, v1);
        arm.addPrimitive(LineSegment.buildVertex(0, 1));

        arm.elbow1.addVertex(v0, v1);
        arm.elbow1.addPrimitive(LineSegment.buildVertex(0, 1));
        arm.addNestedModel(arm.elbow1);

        arm.elbow2.addVertex(v0, v1);
        arm.elbow2.addPrimitive(LineSegment.buildVertex(0, 1));
        arm.addNestedModel(arm.elbow2);

        arm.wrist1.addVertex(v0, v1);
        arm.wrist1.addPrimitive(LineSegment.buildVertex(0, 1));
        arm.elbow1.addNestedModel(arm.wrist1);

        arm.wrist2.addVertex(v0, v1);
        arm.wrist2.addPrimitive(LineSegment.buildVertex(0, 1));
        arm.elbow2.addNestedModel(arm.wrist2);

        arm.finger1.addVertex(v0, v1);
        arm.finger1.addPrimitive(LineSegment.buildVertex(0, 1));
        arm.wrist1.addNestedModel(arm.finger1);

        arm.finger2.addVertex(v0, v1);
        arm.finger2.addPrimitive(LineSegment.buildVertex(0, 1));
        arm.wrist2.addNestedModel(arm.finger2);

        return arm;
    }

    /**
     * @param {Matrix} matrix
     */
    transform(matrix)
    {
        return new RobotArm2(this.vertexList, 
                             this.primitiveList, 
                             this.colorList, 
                             matrix, 
                             this.nestedModels,
                             this.name,
                             this.visible)
    }

    /**
     * 
     * @param {number} sRotation 
     * @param {number} eRotation1 
     * @param {number} wRotation1 
     * @param {number} fRotation1 
     * @param {number} eRotation2 
     * @param {number} wRotation2 
     * @param {number} fRotation2 
     * @param {number} sLength 
     * @param {number} eLength1 
     * @param {number} wLength1 
     * @param {number} fLength1 
     * @param {number} eLength2 
     * @param {number} wLength2 
     * @param {number} fLength2 
     */
    rebuild(sRotation, eRotation1, wRotation1, fRotation1, eRotation2, wRotation2, fRotation2, 
            sLength,   eLength1,   wLength1,   fLength1,   eLength2,   wLength2,   fLength2)
    {
        /**@type {RobotArm2} */
        const newRobotArm = this.transform(Matrix.rotateZ(sRotation).timesMatrix(Matrix.scaleXYZ(sLength, sLength, 1)));

        newRobotArm.setNestedModel(0, this.elbow1.transform(Matrix.translate(1, 0, 0)
                                                            .timesMatrix(Matrix.rotateZ( eRotation1))
                                                            .timesMatrix(Matrix.scaleXYZ(eLength1/sLength, 
                                                                                         eLength1/sLength, 
                                                                                         1))));
        
        newRobotArm.setNestedModel(1, this.elbow1.transform(Matrix.translate(1, 0, 0)
                                                            .timesMatrix(Matrix.rotateZ( eRotation2))
                                                            .timesMatrix(Matrix.scaleXYZ(eLength2/sLength, 
                                                                                         eLength2/sLength, 
                                                                                         1))));

        newRobotArm.elbow1.setNestedModel(0, this.wrist1.transform(Matrix.translate(1, 0, 0)
                                                                    .timesMatrix(Matrix.rotateZ( wRotation1))
                                                                    .timesMatrix(Matrix.scaleXYZ(wLength1/eLength1, 
                                                                                                 wLength1/eLength1, 
                                                                                                 1))));

        newRobotArm.elbow2.setNestedModel(0, this.wrist2.transform(Matrix.translate(1, 0, 0)
                                                                    .timesMatrix(Matrix.rotateZ( wRotation2))
                                                                    .timesMatrix(Matrix.scaleXYZ(wLength2/eLength2, 
                                                                                                 wLength2/eLength2, 
                                                                                                 1))));

        newRobotArm.wrist1.setNestedModel(0, this.finger1.transform(Matrix.translate(1, 0, 0)
                                                                    .timesMatrix(Matrix.rotateZ( fRotation1))
                                                                    .timesMatrix(Matrix.scaleXYZ(fLength1/wLength1, 
                                                                                                 fLength1/wLength1, 
                                                                                                 1))));

        newRobotArm.wrist2.setNestedModel(0, this.finger2.transform(Matrix.translate(1, 0, 0)
                                                                    .timesMatrix(Matrix.rotateZ( fRotation2))
                                                                    .timesMatrix(Matrix.scaleXYZ(fLength2/wLength2, 
                                                                                                 fLength2/wLength2, 
                                                                                                 1))));

        return newRobotArm;
    }
}