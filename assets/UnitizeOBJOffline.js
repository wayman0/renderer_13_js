//@ts-check
import {createReadStream, createWriteStream} from "node:fs";
import * as ReadLine from "node:readline";

if(process.argv.length != 3)
   throw new Error("Usage: node UnitizeOBJ <OBJ-File-Name> ");

const file = process.argv[2];

const findMaxStream = createReadStream(file);
let readLine = ReadLine.createInterface(
    { input: findMaxStream, 
      crlfDelay: Infinity
    });

let maxX = -Infinity
let minX = +Infinity
let maxY = -Infinity
let minY = +Infinity
let maxZ = -Infinity
let minZ = +Infinity

for await(const line of readLine)
{
    if(line.startsWith("v"))
    {
        const vertexLine = line.substring(line.indexOf("v") + 2);
        const nums = vertexLine.split("  ");
        const x = +nums[0];
        const y = +nums[1];
        const z = +nums[2];
       
        if(x > maxX) maxX = x;
        if(x < minX) minX = x;
        if(y > maxY) maxY = y;
        if(y < minY) minY = y;
        if(z > maxZ) maxZ = z;
        if(z < minZ) minZ = z;
    }
}
findMaxStream.close();

const xFactor = -(maxX + minX)/2.0;
const yFactor = -(maxY + minY)/2.0;
const zFactor = -(maxZ + minZ)/2.0;
const scaleFactor = 1/(Math.max(Math.max(maxX-minX, maxY-minY), maxZ-minZ)/2.0);


const inputStream = createReadStream(file);
readLine = ReadLine.createInterface(
                           { input: inputStream, 
                             crlfDelay: Infinity
                           });

const outputPath = file.substring(1 + file.indexOf("\\"), file.indexOf(".")) + "-Unitize.obj";
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

      let x = +nums[0];
      let y = +nums[1];
      let z = +nums[2];

      x += xFactor;
      y += yFactor;
      z += zFactor;

      x *= scaleFactor;
      y *= scaleFactor;
      z *= scaleFactor;

      outputStream.write("v  ");
      outputStream.write(x.toFixed(6) + "  " +
                         y.toFixed(6) + "  " + 
                         z.toFixed(6) + "  " + "\n");
   }
   else
   {
      outputStream.write(line + "\n");
      console.log(line);
   }
}

inputStream.close();
outputStream.close();