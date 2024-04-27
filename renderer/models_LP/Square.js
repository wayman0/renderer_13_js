/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Create a wireframe model of a square in the xy-plane centered at the origin.
<p>
   Here is a picture showing how the square's four vertices are labeled.
<pre>{@code
                   y
                   |
                   |
      v1           |            v2
        +----------------------+
        |          |           |
        |          |           |
        |          |           |
        |          |           |
  ------|----------+-----------|-------> x
        |          |           |
        |          |           |
        |          |           |
        +----------------------+
      v0           |            v3
                   |
                   |
}</pre>
*/
//@ts-check 

import {Model, Vertex, LineSegment, LineLoop} from "../scene/SceneExport.js";
import {format} from "../scene/util/UtilExport.js";

export default class Square extends Model
{
   /**
      Create a square in the xy-plane with corners {@code (�r, �r, 0)}.

      @param {number} [r=1]  determines the corners of the square
   */
   constructor(r=1)
   {
      super(undefined, undefined, undefined, undefined, undefined,  format("Square(%.2f)", r));

      if (r <= 0)
         throw new Error("r must be greater than 0");

      // Create the square's geometry.
      this.addVertex(new Vertex(-r, -r, 0),
                     new Vertex(-r,  r, 0),
                     new Vertex( r,  r, 0),
                     new Vertex( r, -r, 0));

      this.addPrimitive(new LineLoop(0, 1, 2, 3));
   }
}//Square
