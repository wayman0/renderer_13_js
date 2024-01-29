/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/*
import {clip as ClipLine} from "./Clip_Line.js";
import {clip as ClipPoint} from "./Clip_Point.js";
import {debug as ClipDebug, clip as Clip} from "./Clip.js";
import {Model2View as M2V} from "./Model2View.js";
import {clip as NearLine} from "./NearClip_Line.js";
import {clip as NearPoint} from "./NearClip_Point.js";
import {doNearClip as doNear, debug as NearDebug, clip as Near} from "./NearClip.js";
import {renderFB, render} from "./Pipeline.js";
import {debugScene, debugPosition, logMessage, logVertexList, logColorList, logPrimitiveList, logPrimitive, logPixelMessage, logPixel, logPixelsYAA, logPixelsXAA} from "./PipelineLogger.js";
import {project} from "./Project.js";
import {rasterize as RastLine} from "./Rasterize_AntiAlias_Line.js";
import {rasterize as RastPoint} from "./Rasterize_Clip_Point.js";
import {debug as RastDebug, doAntiAliasing, doGamma, GAMMA, rasterize} from "./Rasterize.js";
import {view2camera as V2C} from "./View2Camera.js";

export var ClipLine;
export var ClipPoint;
export var ClipDebug;
export var Clip;
export var M2V;
export var NearLine;
export var NearPoint;
export var doNear;
export var NearDebug;
export var Near;
export var renderFB;
export var render;
export var debugScene;
export var debugPosition;
export var logMessage;
export var logVertexList;
export var logColorList;
export var logPrimitiveList;
export var logPrimitive;
export var logPixelMessage;
export var logPixel;
export var logPixelsYAA;
export var logPixelsXAA;
export var project;
export var RastLine;
export var RastPoint;
export var RastDebug;
export var doAntiAliasing;
export var doGamma;
export var GAMMA;
export var rasterize;
export var V2C;
*/


export {default as LineClip} from "./Clip_Line.js";
export {default as PointClip} from "./Clip_Point.js";
export * from "./Clip.js";
export {default as M2V} from "./Model2View.js";
export {default as NearLine} from "./NearClip_Line.js";
export {default as NearPoint} from "./NearClip_Point.js";
export {doNearClipping, setDoNearClipping, nearDebug, setNearDebug, clip as NearClip} from "./NearClip.js";
export * from "./Pipeline.js";
export * from "./PipelineLogger.js";
export {default as Project} from "./Project.js";
export {default as RastLine} from "./Rasterize_AntiAlias_Line.js";
export {default as RastPoint} from "./Rasterize_Clip_Point.js";
export * from "./Rasterize.js";
export {default as V2C} from "./View2Camera.js";