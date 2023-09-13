// @ts-check

import {createReadStream, createWriteStream} from "node:fs";
import * as ReadLine from "node:readline";

if(process.argv.length != 4)
    throw new Error("Usage: node ScaleOBJ.js <OBJ File Name> [<scale-factor>]");

const file = process.argv[2];
const scale = +process.argv[3];

const inputStream = createReadStream(file);
const readLine = ReadLine.createInterface(
                           { input: inputStream, 
                             crlfDelay: Infinity
                           });

const outputPath = file.substring(1 + file.indexOf("\\"), file.indexOf(".")) 
                                    + "-Scale(" + scale + ").obj";
const outputStream = createWriteStream(outputPath, { encoding: "utf8" });

for await (const line of readLine)
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
      const vertexLine = line.substring(line.indexOf("v") + 2);
      const nums = vertexLine.split("  ");

      const x = +nums[0];
      const y = +nums[1];
      const z = +nums[2];

      outputStream.write("v  ");
      outputStream.write((x * scale).toFixed(6) + "  " +
                         (y * scale).toFixed(6) + "  " + 
                         (z * scale).toFixed(6) + "  " + "\n");
   }
   else
   {
      outputStream.write(line + "\n");
      console.log(line);
   }
}

inputStream.close();
outputStream.close();
