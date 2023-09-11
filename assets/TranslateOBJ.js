//@ts-check

import { execFile } from "node:child_process";
import {createWriteStream, readFileSync} from "node:fs";

if(process.argv.length != 6)
   throw new Error("Usage: node TranslateOBJ <OBJ-File-Name> [<x-amount> [<y-amount> [<z-amount>]]]");

const file = process.argv[2];
const xTrans = +process.argv[3];
const yTrans = +process.argv[4];
const zTrans = +process.argv[5];

const fileData = readFileSync(file);
const fileLines = fileData.toString().split("\n"); 

const outputPath = file.substring(1 + file.indexOf("\\"), file.indexOf(".")) 
                        + "-Trans(" + xTrans + ", " + yTrans +  ", " + zTrans + ").grs";
const outputStream = createWriteStream(outputPath, { encoding: "utf8" });

// x++ execute then increment x
// ++x increment x then execute
let lineIndex = 0;
let line = fileLines[lineIndex++]; 

while(lineIndex < fileLines.length)
{
   if(   line.startsWith("#")
      || line.startsWith("vt")
      || line.startsWith("vn")
      || line.startsWith("f")
      || line.startsWith("s")
      || line.startsWith("g")
      || line.startsWith("o")
      || line.startsWith("usemtl")
      || line.startsWith("mtllib"))
   {
      outputStream.write(line + "\n");
   }
   else if(line.startsWith("v"))
   {
      line = fileLines[lineIndex++];

      const nums = line.split("  ");
      const x = +nums[0];
      const y = +nums[1];
      const z = +nums[2];

      outputStream.write((x + xTrans).toFixed(6) + "  " +
                         (y + yTrans).toFixed(6) + "  " + 
                         (z + zTrans).toFixed(6) + "  " + "\n");
   }
   else
   {
      line = fileLines[lineIndex++];
      outputStream.write(line + "\n");
      console.log(line);
   }

   outputStream.close();
}