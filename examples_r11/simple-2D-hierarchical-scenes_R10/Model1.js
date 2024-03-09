/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import {Model, Vertex, LineSegment} from "../../renderer/scene/SceneExport.js";

export default class Model1 extends Model
{
    constructor()
    {
      super(undefined, undefined, undefined, undefined, undefined, "Model_1 (basic model)");

      // Create the model's geometry.
      const v0 = new Vertex( 1.0,  1.0, 0.0);  // a square
      const v1 = new Vertex(-1.0,  1.0, 0.0);
      const v2 = new Vertex(-1.0, -1.0, 0.0);
      const v3 = new Vertex( 1.0, -1.0, 0.0);

      this.addVertex(v0, v1, v2, v3);
      this.addPrimitive(LineSegment.buildVertex(0, 1),
                   LineSegment.buildVertex(1, 2),
                   LineSegment.buildVertex(2, 3),
                   LineSegment.buildVertex(3, 0));

      const v4 = new Vertex( 2.0,  2.0, 0.0);  // another square
      const v5 = new Vertex(-2.0,  2.0, 0.0);
      const v6 = new Vertex(-2.0, -2.0, 0.0);
      const v7 = new Vertex( 2.0, -2.0, 0.0);

      this.addVertex(v4, v5, v6, v7);
      this.addPrimitive(LineSegment.buildVertex(4, 5),
                   LineSegment.buildVertex(5, 6),
                   LineSegment.buildVertex(6, 7),
                   LineSegment.buildVertex(7, 4));

      // two more line segments
      const v8 = new Vertex(-2.0,  1.0, 0.0);
      const v9 = new Vertex( 1.0, -2.0, 0.0);

      this.addVertex(v8, v9);
      this.addPrimitive(LineSegment.buildVertex(0, 4),
                   LineSegment.buildVertex(8, 9));
    }
}