/*
 * Renderer 13. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

import { LineFan, LineLoop, Lines, LineSegment, LineStrip, Model, Point, Points } from "../scene/SceneExport";

/**
   Assemble a {@link Model}'s {@link List} of {@link Primitive}s
   into a {@link List} containing only {@link LineSegment}
   and {@link Points} {@link Primitive}s.
<p>
   In order to clip a {@link Primitive}, we need to convert the
   {@link Primitive} into individual {@link LineSegment}s, and
   then clip each line segment separately.
*/

/**
   Assemble a {@link Model}'s {@link List} of {@link Primitive}s into a
   {@link List} containing only {@link LineSegment} and {@link Points}
   {@link Primitive}s.
   @param {Model} model  {@link Model} whose {@link Primitive}s need to be assembled
   @return {Model} containing just {@link LineSegment} and {@link Points} primitives
*/
export function assemble(model)
{
   const newPrimitiveList = new Array();
   for (const p of model.primitiveList)
   {
      if (p instanceof LineSegment)
      {
         newPrimitiveList.push(p);
      }
      else if (p instanceof Lines)
      {
         // Convert the Lines into individual LineSegments.
         for (let i = 0; i < p.vIndexList.length; i += 2)
         {
            newPrimitiveList.push(new LineSegment(new Array(p.vIndexList[i+0], p.vIndexList[i+1]),
                                                  new Array(p.cIndexList[i+0], p.cIndexList[i+1])));
         }
      }
      else if (p instanceof LineLoop)
      {
         // Convert the LineLoop into individual LineSegments.
         for (let i = 0; i < p.vIndexList.length - 1; ++i)
         {
            newPrimitiveList.push(new LineSegment(new Array(p.vIndexList[i], p.vIndexList[i+1]),
                                                  new Array(p.cIndexList[i], p.cIndexList[i+1])));
         }
         // Close the LineLoop into a loop of line segments.
         newPrimitiveList.push(new LineSegment(new Array(p.vIndexList[p.vIndexList.length - 1], p.vIndexList[0]),
                                               new Array(p.cIndexList[p.vIndexList.length - 1], p.cIndexList[0])));
      }
      else if (p instanceof LineStrip)
      {
         // Convert the LineStrip into individual LineSegments.
         for (let i = 0; i < p.vIndexList.length - 1; ++i)
         {
            newPrimitiveList.push(new LineSegment(new Array(p.vIndexList[i], p.vIndexList[i+1]),
                                                  new Array(p.cIndexList[i], p.cIndexList[i+1])));
         }
      }
      else if (p instanceof LineFan)
      {
         // Convert the LineFan into individual LineSegments.
         for (let i = 1; i < p.vIndexList.length; ++i)
         {
            newPrimitiveList.push(new LineSegment(new Array(p.vIndexList[0], p.vIndexList[i]),
                                                  new Array(p.cIndexList[0], p.cIndexList[i])));
         }
      }
      else if (p instanceof Points)
      {
         newPrimitiveList.push(p);
      }
      else if (p instanceof Point)
      {
         // Convert the Point object into a Points object.
         const points = new Points(new Array(), new Array());
         points.radius = /**@type {Point} */(p).radius;
         points.addIndices(p.vIndexList[0], p.cIndexList[0]);
         newPrimitiveList.push(points);
      }
   }
   // Replace the model's original list of primitives
   // with the list of line segments and points.
   return new Model(model.vertexList,
                    newPrimitiveList,
                    model.colorList,
                    model.matrix,
                    model.nestedModels,
                    model.name,
                    model.visible);
}