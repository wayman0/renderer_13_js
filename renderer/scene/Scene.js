/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   A {@code Scene} data structure is a {@link List} of {@link Position}
   data structures and a {@link Camera} data structure.
<p>
   Each {@link Position} object represents a {@link Model} object in a
   distinct position in three-dimensional view space.
<p>
   Each {@link Model} object represents a distinct geometric object
   in the scene.
<p>
   The {@link Camera} object determines a "view volume", which
   determines how much of the scene is actually visible (to the
   camera) and gets rendered into the framebuffer.
*/

//@ts-check
import {Camera, Matrix, Model, OrthoNorm, PerspNorm, Position, Vector, Vertex, LineSegment} from "./SceneExport.js";
// for testing purposes
import {Color} from "../framebuffer/FramebufferExport.js";

export default class Scene
{
    /**@type {Position[]} the array of positions in this scene*/ #positionList;
    /**@type {Camera} the camera for this scene*/ #camera;
    /**@type {string} the name of this scene*/#name;
    /**@type {boolean} whether to debug this scene */ debug = false;

    /**
     * Create a scene with the given data
     * @param {Camera} [camera=new Camera()] the camera for this scene
     * @param {Position[]} [positionList=new Array()] the array of positions in this scene
     * @param {string} [name=""] the name for this scene
     * @param {boolean} [debug=false] whether to debug this scene
     */
    constructor(camera = new Camera(),
                positionList = new Array(),
                name = "",
                debug = false)
    {
        if (camera instanceof Camera == false)
            throw new Error("Camera must be a camera");

        if (! Array.isArray(positionList))
            throw new Error("Position List must be an array and is type: " + typeof positionList );

        if (typeof name != "string")
            throw new Error("Name must be a String");

        if (typeof debug != "boolean")
            throw new Error("Debug must be a boolean");

        let posLength = 0;
        this.#positionList = new Array();
        for (let x = 0; x < positionList.length; x += 1)
        {
            if (positionList[x] instanceof Position == false)
            {
                this.#positionList.length = posLength;
                throw new Error("Position List can only contain Positions");
            }
            else
            {
                this.#positionList.push(positionList[x]);
                posLength += 1;
            }
        }

        this.#camera = camera;
        this.#name = name;
        this.debug = debug;
    }


    /**
     * Build a Scene with the given name and default camera and empty position list.
     * @param {string} name
     */
    static buildFromName(name)
    {
        return new Scene(new Camera(), new Array(), name);
    }


    /**
     * Build a scene with the given camera and empty position list.
     * @param {Camera} cam
     */
    static buildFromCamera(cam)
    {
        return new Scene(cam);
    }


    /**
     * Build a Scene with the given camera and name with an empty position list.
     * @param {Camera} cam
     * @param {string} name
     */
    static buildFromCameraName(cam, name)
    {
        return new Scene(cam, new Array(), name);
    }


    /**
     * Get the name of this scene.
     * @returns {string} this scenes name
     */
    getName()
    {
        return this.#name;
    }

    /**
     * Get the name of this scene.
     * @returns {string} this scenes name
     */
    get name()
    {
        return this.#name;
    }


    /**
     * Get the camera for this scene.
     * @returns {Camera} this scenes camera
     */
    getCamera()
    {
        return this.#camera;
    }

    /**
     * Get the camera for this scene.
     * @returns {Camera} this scenes camera
     */
    get camera()
    {
        return this.#camera;
    }


    /**
     * Set this scenes camera to be the given camera.
     * @param {Camera} camera the new camera for this scene
     */
    setCamera(camera)
    {
        if (camera instanceof Camera == false)
            throw new Error("Camera must be a Camera");

        this.#camera = camera;
    }

    /**
     * Set this scenes camera to be the given camera.
     * @param {Camera} cam the new camera for this scene
     */
    set camera(cam)
    {
        if (cam instanceof Camera == false)
            throw new Error("Camera must be a Camera");

        this.#camera = cam;
    }


    /**
     * Get the array of positions for this scene.
     * @returns {Position[]} this scenes array of positions
     */
    getPositionList()
    {
        return this.#positionList;
    }

    /**
     * Get the array of positions for this scene.
     * @returns {Position[]} this scenes array of positions
     */
    get positionList()
    {
        return this.#positionList;
    }


    /**
     * Get the position at the specified index.
     * @param {number} index the index of the position to be returned
     * @returns {Position} the position at the given index
     */
    getPosition(index)
    {
        if (typeof index != "number")
            throw new Error("Index must be numerical");

        return this.#positionList[index];
    }


    /**
     * Set the position at the specified index to be the specified position.
     * @param {number} index the index of the position to be set
     * @param {Position} position the position that will be set at the given index
     */
    setPosition(index, position)
    {
        if (typeof index != "number")
            throw new Error("Index must be numerical");

        if (position instanceof Position == false)
            throw new Error("Position must be a Position");

        this.#positionList[index] = position;
    }


    /**
     * Add the given positions to this scenes array of positions.
     * @param {Position[]} pArray the positions to be added to the scene
     */
    addPosition(... pArray)
    {
        for (let pos of pArray)
        {
            if (pos instanceof Position == false)
                throw new Error("Can only add Positions");

            this.#positionList.push(pos);
        }
    }


    /**
     * Get the first model with the given name in this scenes
     * array of positions.
     * @param {string} name the name of the model to be gotten
     * @returns {Model | undefined} the model with the specified name or undefined if unfound
     */
    getModelByName(name)
    {
        if (typeof name != "string")
            throw new Error("Name must be a String");

        for (let pos of this.#positionList)
        {
            if (name === pos.getModel().getName())
            {
                return pos.getModel();
			}
        }

        return undefined;
    }


    /**
     * Get the first Position with the given model name in
     * this scenes array of positions.
     * @param {string} name the name of the model
     * @returns {Position | undefined} returns the position containing the specified model name or undefined if unfound
     */
    getPositionByModelName(name)
    {
        if (typeof name != "string")
            throw new Error("Name must be a String");

        for (let pos of this.#positionList)
        {
            if (name === pos.getModel().getName())
            {
                return pos;
			}
        }

        return undefined;
    }


    /**
     * For debugging.
     * @returns {string} a string representation of this scene
     */
    toString()
    {
        let result = "";
        result += "Scene: " + this.#name + "\n";
        result += this.#camera.toString();
        result += "This Scene has " + this.#positionList.length + " positions\n";

        let i = 0;
        for (let p of this.#positionList)
        {
            result += "Position " + (i++) + "\n";
            if (p == undefined)
            {
                result += "missing position \n";
			}
            else
            {
                result += p.toString();
			}
        }

        result += "\n"
        return result;
    }


    /**
     * For Testing.
     */
    static main()
    {
        const line = new Model();
        line.addColor(Color.orange);
        line.addVertex(new Vertex(-1, 0, 0),
                        new Vertex(1, 0, 0));
        line.addPrimitive(LineSegment.buildVertexColor(0, 1, 0));
        line.setName("Line Model");

        const pos1 = Position.buildFromModelName(line, "Pos 1");
        //pos1.setName("Pos 1");

        const cam = new Camera();

        console.log("Creating scene1 = new Scene()");
        const scene1 = new Scene();
        console.log("Creating scene2 = Scene.buildFromCamera(cam = new Camera)");
        const scene2 = Scene.buildFromCamera(cam);
        console.log("Creating scene3 = Scene.buildFromName('scene 3')");
        const scene3 = Scene.buildFromName("Scene 3");
        console.log("Creating scene4 = Scene.buildFromCameraName(new Camera, 'Scene 4')");
        const scene4 = Scene.buildFromCameraName(cam, "Scene 4");

        console.log("");
        console.log("Scene1: ");
        console.log(scene1.toString());

        console.log("");
        console.log("scene 2: ");
        console.log(scene2.toString());

        console.log("");
        console.log("Scene 3: ");
        console.log(scene3.toString());

        console.log("");
        console.log("Scene 4: ");
        console.log(scene4.toString());

        console.log("");
        console.log("Scene1.getName(): ");
        console.log(scene1.getName());


        console.log("");
        console.log("scene1.name");
        console.log(scene1.name);

        console.log("");
        console.log("scene2.getCamera()")
        console.log(scene2.getCamera());

        console.log("");
        console.log("scene2.camera");
        console.log(scene2.camera);

        console.log("");
        console.log("scene3.getPositionList() ");
        console.log(scene3.getPositionList());


        console.log("");
        console.log("scene3.positionList");
        console.log(scene3.positionList);

        /*
        console.log("");
        console.log("scene1.setCamera(cam): ");
        scene1.setCamera(cam);
        console.log(scene1.toString());
        */

        console.log("");
        console.log("scene1.camera = cam");
        scene1.camera = cam;
        console.log(scene1.toString());


        console.log("");
        console.log("scene2.setPosition(1, pos1)");
        scene2.setPosition(1, pos1);
        console.log(scene2.toString());

        console.log("");
        console.log("scene3.addPosition(pos1)");
        scene3.addPosition(pos1);
        console.log(scene3.toString());

        console.log("");
        console.log("scene3.getPosition(0) ");
        console.log(scene3.getPosition(0).toString());

        console.log("");
        console.log("scene4.addPosition(pos1, pos1, pos1)");
        scene4.addPosition(pos1, pos1, pos1);
        console.log(scene4.toString());

        console.log("");
        console.log("scene4.getModelByName(Line Model)")
        console.log(scene4.getModelByName("Line Model")?.toString());

        console.log("");
        console.log("scene4.getPositionByModelName(Pos 1)");
        console.log(scene4.getPositionByModelName("Pos 1")?.toString());

        console.log("");
        console.log("scene4.getPositionByModelName(Line Model)");
        console.log(scene4.getPositionByModelName("Line Model")?.toString());
    }
}