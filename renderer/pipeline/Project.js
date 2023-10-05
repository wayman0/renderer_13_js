/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Project each {@link Vertex} of a {@link Model} from camera
   coordinates to the {@link Camera}'s image plane {@code z = -1}.
<p>
   Let us derive the formulas for the perspective projection
   transformation (the formulas for the parallel projection
   transformation are pretty obvious). We will derive the
   x-coordinate formula; the y-coordinate formula is similar.
<p>
   Let {@code (x_c, y_c, z_c)} denote a point in the 3-dimensional
   camera coordinate system. Let {@code (x_p, y_p, -1)} denote the
   point's perspective projection into the image plane, {@code z = -1}.
   Here is a "picture" of just the xz-plane from camera space. This
   picture shows the point {@code (x_c, z_c)} and its projection to
   the point {@code (x_p, -1)} in the image plane.
<pre>{@code
           x
           |                             /
           |                           /
       x_c +                         + (x_c, z_c)
           |                       / |
           |                     /   |
           |                   /     |
           |                 /       |
           |               /         |
           |             /           |
       x_p +           +             |
           |         / |             |
           |       /   |             |
           |     /     |             |
           |   /       |             |
           | /         |             |
           +-----------+-------------+------------> -z
        (0,0)         -1            z_c
}</pre>
<p>
   We are looking for a formula that computes {@code x_p} in terms of
   {@code x_c} and {@code z_c}. There are two similar triangles in this
   picture that share a vertex at the origin. Using the properties of
   similar triangles we have the following ratios. (Remember that these
   are ratios of positive lengths, so we write {@code -z_c}, since
   {@code z_c} is on the negative z-axis).
<pre>{@code
                 x_p       x_c
                -----  =  -----
                  1       -z_c
}</pre>
<p>
   If we solve this ratio for the unknown, {@code x_p}, we get the
   projection formula,
<pre>{@code
                 x_p = -x_c / z_c.
}</pre>
<p>
   The equivalent formula for the y-coordinate is
<pre>{@code
                 y_p = -y_c / z_c.
}</pre>
*/

//@ts-check
import {Model, Vertex, Camera} from "../scene/SceneExport.js";

/**
 *  Project each {@link Vertex} from a {@link Model} to
    the {@link Camera}'s image plane {@code z = -1}.

 * @param {Model} model the model whose vertexes are to be projected
 * @param {Camera} camera the scenes camera object
 * @returns {Model} a new model containing the projected vertexes
 */
export default function project(model, camera)
{
    const newVertexList = new Array();

    for (let x = 0; x < model.vertexList.length; x += 1)
    {
        const v = model.vertexList[x];

        if (camera.perspective)
            newVertexList[x] = new Vertex(v.x/-v.z, v.y/-v.z, -1);
        else
            newVertexList[x] = new Vertex(v.x, v.y, 0);
    }

    return new Model(newVertexList,
                     model.primitiveList,
                     model.colorList,
                     model.name,
                     model.visible);
}