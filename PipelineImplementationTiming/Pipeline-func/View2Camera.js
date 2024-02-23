/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Transform each {@link Vertex} of a {@link Model} from
   view coordinates to normalized camera coordinates.
<p>
   This stage transforms the {@link Camera}'s view volume from a
   user defined shape (in the view coordinate system) into the
   standard normalized view volume (in the camera coordinate system)
   used by the {@link Clip} pipeline stage.
<p>
   There are two standard normalized view volumes, one for perspective
   projection and one for orthographic projection.
<p>
   The standard normalized perspective view volume is the infinitely
   long pyramid with its apex at the origin and intersecting the plane
   {@code z = -1} at the corners {@code (-1, -1, -1)} and
   {@code (+1, +1, -1)}.
<p>
   The standard normalized orthographic view volume is the infinitely
   long parallelepiped centered on the z-axis and intersecting the
   xy-plane at the corners {@code (-1, -1, 0)} and {@code (+1, +1, 0)}.
<p>
   The user defined view volume (determined by the {@link Scene}'s
   {@link Camera} object) is either the infinitely long pyramid with its
   apex at the origin and intersecting the plane {@code z = -near} at the
   corners {@code (left, bottom, -near)} and {@code (right, top, -near)},
   or it is the infinitely long parallelepiped parallel to the z-axis and
   intersecting the xy-plane at the corners {@code (left, bottom, 0)}
   and {@code (right, top, 0)}.
<p>
   The view coordinate system is relative to the user defined view volume.
<p>
   The normalized camera coordinate system is relative to the normalized
   view volume.
<p>
   The transformation formulas that transform the user defined view volume
   into the normalized view volume also transforms the view coordinate
   system into the normalized camera coordinate system.
*/

//@ts-check
import {Model, Camera, Vertex} from "../../renderer/scene/SceneExport.js";

/**
 *  Use the {@link Camera}'s view volume data to transform each
    {@link Vertex} from the {@link Camera}'s view coordinate system
    to the normalized camera coordinate system.

 * @param {Model} model model wiht the vertexes in the cameras view coordinate system
 * @param {Camera} camera camera with the view volume data
 * @returns {Model} a new model with the vertexes in the normalized camera coordinate system
 */
export default function view2camera(model, camera)
{
    const l = camera.left;
    const r = camera.right;
    const b = camera.bottom;
    const t = camera.top;
    const near = -camera.n;

    //const newVertexList = new Array();
    //for (let x = 0; x < model.vertexList.length; x += 1)
    //{
    //    const v = model.vertexList[x];
    //
    //    let v_x = undefined;
    //    let v_y = undefined;
    //    let v_z = undefined;
    //
    //    if (camera.perspective)
    //    {
    //        v_z = v.z;
    //        v_x = v.x - v_z * (r + l)/(2 * near);
    //        v_y = v.y - v_z * (t + b)/(2 * near);
    //
    //        v_x = (2 * near * v_x)/(r - l);
    //        v_y = (2 * near * v_y)/(t - b);
    //    }
    //    else
    //    {
    //        v_z = v.z;
    //        v_x = v.x - (r + l)/2;
    //        v_y = v.y - (t + b)/2;
    //
    //        v_x = (2 * v_x)/(r - l);
    //        v_y = (2 * v_y)/(t - b);
    //    }
    //
    //    newVertexList[x] = new Vertex(v_x, v_y, v_z);
    //}

    // use map because we are 'mapping' from view space to camera space and it is non mutative
    
    // this method is slower
    const newVertexList = model.vertexList.map(
                          (v) => {
                                    let v_x = undefined;
                                    let v_y = undefined;
                                    let v_z = undefined;

                                    if (camera.perspective)
                                    {
                                        v_z = v.z;
                                        v_x = v.x - v_z * (r + l)/(2 * near);
                                        v_y = v.y - v_z * (t + b)/(2 * near);
                                        v_x = (2 * near * v_x)/(r - l);
                                        v_y = (2 * near * v_y)/(t - b);
                                    }
                                    else
                                    {
                                        v_z = v.z;
                                        v_x = v.x - (r + l)/2;
                                        v_y = v.y - (t + b)/2;
                                        v_x = (2 * v_x)/(r - l);
                                        v_y = (2 * v_y)/(t - b);
                                    }

                                    return new Vertex(v_x, v_y, v_z);
                           });
    

    return new Model(newVertexList,
                     model.primitiveList,
                     model.colorList,
                     undefined, 
                     undefined, 
                     model.name,
                     model.visible);
}