//@ts-check
import {createReadStream, createWriteStream} from "node:fs";
import * as ReadLine from "node:readline";

if(process.argv.length != 6)
   throw new Error("Usage: node TranslateOBJ <OBJ-File-Name> [<x-amount> [<y-amount> [<z-amount>]]]");

const file = process.argv[2];
const xTrans = +process.argv[3];
const yTrans = +process.argv[4];
const zTrans = +process.argv[5];

const inputStream = createReadStream(file);
const readLine = ReadLine.createInterface(
                           { input: inputStream, 
                             crlfDelay: Infinity
                           });

const outputPath = file.substring(1 + file.indexOf("\\"), file.indexOf(".")) 
                                    + "-Trans(" + xTrans + ", " + yTrans +  ", " + zTrans + ").obj";
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
      outputStream.write((x + xTrans).toFixed(6) + "  " +
                         (y + yTrans).toFixed(6) + "  " + 
                         (z + zTrans).toFixed(6) + "  " + "\n");
   }
   else
   {
      outputStream.write(line + "\n");
      console.log(line);
   }
}

inputStream.close();
outputStream.close();



/*
const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('input.txt');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    console.log(`Line from file: ${line}`);
  }
}
*/


/*
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
*/