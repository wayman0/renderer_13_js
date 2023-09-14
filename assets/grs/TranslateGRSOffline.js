//@ts-check

import {createReadStream, createWriteStream} from "node:fs";
import * as ReadLine from "node:readline";

if(process.argv.length != 5)
   throw new Error("Usage: node TranslateGRS.js <GRS-File-Name> [<x-amount> [<y-amount>]]");

const file = process.argv[2];
const xTrans = +process.argv[3];
const yTrans = +process.argv[4];

const inputStream = createReadStream(file);
const readLine = ReadLine.createInterface(
                           { input: inputStream, 
                             crlfDelay: Infinity
                           });

const outputPath = file.substring(1 + file.indexOf("\\"), file.indexOf(".")) 
                                    + "-Trans(" + xTrans + ", " + yTrans + ").grs";
const outputStream = createWriteStream(outputPath, { encoding: "utf8" });

// create a variable to keep track of if we have hit the star line
let hitStars = false;

// count the lines we have read 
let linesCounted = 0;

// number of chunks of vertices
let lineChunks = 0;

// create an array to store the number of vertexes in a chunk
let vertexesInChunk = new Array();

// create an index for the array to know which chunk we are in.
let vertexChunk = 0;

for await(const line of readLine)
{
   if(line.startsWith("*"))
      hitStars = true;

   if(!hitStars)  // write all lines up to the star line
      outputStream.write(line + "\n");
   else if(hitStars && line.startsWith("*"))// write the star line
      outputStream.write(line + "\n");
   else if(hitStars)//we are now past the star line so we have numerical data to use
   {
      linesCounted += 1;

      if(linesCounted == 1)// handle the first lin: top bottom right left
      {
         const nums = line.split("  ");
         
         const left  = +nums[0];
         const top   = +nums[1];
         const right = +nums[2];
         const bot   = +nums[3];

         outputStream.write((left  + xTrans).toFixed(6) + "  " +
                            (top   + yTrans).toFixed(6) + "  " + 
                            (right + xTrans).toFixed(6) + "  " + 
                            (bot   + yTrans).toFixed(6) + "  " + "\n");
      }
      else if(linesCounted == 2)// handle the second line, the number of line chunks
      {
         lineChunks = +line;
         outputStream.write(line + "\n");
      }
      else if(linesCounted == 3)// handle the third line, the number of vertices in this chunk
      {
         vertexesInChunk[vertexChunk++] = +line;
         outputStream.write(line + "\n");
      }
      else if(line.startsWith("  "))// next is the vertexes in this chunk which start with '  '
      {
         const nums = line.split("  ");

         const x = (+nums[1]) + xTrans;
         const y = (+nums[2]) + yTrans;

         outputStream.write("  " + x.toFixed(4) + 
                            "  " + y.toFixed(4) + "\n");
      }
      else if(!isNaN(line))// make sure line is numerical since all that should be left is the next vertex count 
      {
         vertexesInChunk[vertexChunk++] = +line;
         outputStream.write(line + "\n");
      }
      else // unknown data so record it to console
      {
         outputStream.write(line + "\n");
         console.log(line);
      }

   }
}

/*
// create a variable to keep track of if we have hit the star line
let hitStars = false;

// create a variable to keep track of if we have hit the vertex data
let hitVertexes = false;

// keep track of how many lines we have read to allow us to handle the first three lines after * line
let numLinesCounted = 0;

// the number of line strips to be found in the 2nd line of text and used in the for loops for vertexes
let numLineStrips = 0; 

// the number of vertices to be found in the 3rd line of text and used in the for loops for vertexes
let numVertices = 0; 
for await (const line of readLine)
{
   // record if we have hit the star line
   if(line.startsWith("*"))
      hitStars = true; 

   // if we haven't hit the star line then just keep writing the data to the file
   if(!hitStars)
      outputStream.write(line + "\n");
   else // if we have hit the star line then we need to treat each line individually
   {
      // if we have the star line record it 
      if(line.startsWith("*"))
         outputStream.write(line + "\n"); 
      else  // we are reading a line past the star line so these are data that need to be transformed
      {
         // record we are reading a line past the * line
         numLinesCounted += 1;

         // record whether we have hit vertexes or are still getting the start info
         if(line.startsWith("  "))
            hitVertexes = true;
      
         // the first line is the start data, bottom left top and right
         if(!hitVertexes && numLinesCounted == 1)
         {
            const nums = line.split("  ");
            
            const left  = +nums[0];
            const top   = +nums[1];
            const right = +nums[2];
            const bot   = +nums[3];
            
            outputStream.write((left  + xTrans).toFixed(6) + "  " +
                               (top   + yTrans).toFixed(6) + "  " + 
                               (right + xTrans).toFixed(6) + "  " + 
                               (bot   + yTrans).toFixed(6) + "  " + "\n");
         }// end if for the first line
         // the second line is the number of vertexes
         else if(!hitVertexes && numLinesCounted == 2)
         {
            numLineStrips = +line;
            outputStream.write(numLineStrips + "\n");
         }// end if for the second line
         else if(!hitVertexes && numLinesCounted == 3)
         {
            numVertices = +line;
            outputStream.write(numVertices + "\n");
         }
         else if(!hitVertexes && numLinesCounted > 3)
         {
            if(!line.startsWith("  "))
               break();
            else

            for(let j = 0; j < numLineStrips; j++)
            {
               // copy the number of vertices in this line-strip
               const numVertices = +line;
               outputStream.write(numVertices + "\n");
            
               for(let i = 0; i < numVertices; i++)
               {
                  const nums = line.split("  ");
               
                  const x = (+nums[1]) + xTrans;
                  const y = (+nums[2]) + yTrans;
               
                  outputStream.write("  " + x.toFixed(4) + 
                                     "  " + y.toFixed(4) + "\n");
               }// end for
            }// end for
         }// end if for the vertexes
      }// end else for past the star line, recorded star line, and dealing with data 
   }// end else for past star line but not yet recorded star line
}// end for loop to read lines

inputStream.close();
outputStream.close();
*/

/*
import {createReadStream, createWriteStream} from "node:fs";
import * as ReadLine from "node:readline";

if(process.argv.length != 5)
   throw new Error("Usage: node TranslateGRS.js <GRS-File-Name> [<x-amount> [<y-amount>]]");

const file = process.argv[2];
const xTrans = +process.argv[3];
const yTrans = +process.argv[4];

const inputStream = createReadStream(file);
const readLine = ReadLine.createInterface(
                           { input: inputStream, 
                             crlfDelay: Infinity
                           });

const outputPath = file.substring(1 + file.indexOf("\\"), file.indexOf(".")) 
                                    + "-Trans(" + xTrans + ", " + yTrans + ").grs";
const outputStream = createWriteStream(outputPath, { encoding: "utf8" });

// this doesn't work because we need to progress to the next line
// while handling the data becase each line gets treated seperately
// can't treat each line the same


// create a variable to keep track of if we have hit the star line
let hitStars = false;

for await (const line of readLine)
{
   // record if we have hit the star line
   if(line.startsWith("*"))
      hitStars = true; 

   // if we haven't hit the star line then just keep writing the data to the file
   if(!hitStars)
      outputStream.write(line + "\n");
   else // if we have hit the star line then we need to treat each line individually
   {
      // if we have the star line record it 
      if(line.startsWith("*"))
         outputStream.write(line + "\n"); 
      else  // we are reading a line past the star line so these are data that need to be transformed
      {
         const nums = line.split("  ");
         
         const left  = +nums[0];
         const top   = +nums[1];
         const right = +nums[2];
         const bot   = +nums[3];
         
         outputStream.write((left  + xTrans).toFixed(6) + "  " +
                            (top   + yTrans).toFixed(6) + "  " + 
                            (right + xTrans).toFixed(6) + "  " + 
                            (bot   + yTrans).toFixed(6) + "  " + "\n");
         
         const numLineStrips = +line;
         outputStream.write(numLineStrips + "\n");
         
         for(let j = 0; j < numLineStrips; j++)
         {
            // copy the number of vertices in this line-strip
            const numVertices = +line;
            outputStream.write(numVertices + "\n");
         
            for(let i = 0; i < numVertices; i++)
            {
               const nums = line.split("  ");
            
               const x = (+nums[1]) + xTrans;
               const y = (+nums[2]) + yTrans;
            
               outputStream.write("  " + x.toFixed(4) + 
                                  "  " + y.toFixed(4) + "\n");
            }
         }
      }
   }
}
inputStream.close();
outputStream.close();
*/

/*
import {createReadStream, createWriteStream} from "node:fs";

if(process.argv.length != 5)
   throw new Error("Usage: node TranslateGRS.js <GRS-File-Name> [<x-amount> [<y-amount>]]");

const file = process.argv[2];
const xTrans = +process.argv[3];
const yTrans = +process.argv[4];

const inputStream = createReadStream(file);
inputStream.setEncoding("utf-8");

const outputPath = file.substring(1 + file.indexOf("\\"), file.indexOf(".")) 
                                    + "-Trans(" + xTrans + ", " + yTrans + ").grs";
const outputStream = createWriteStream(outputPath);
outputStream.setDefaultEncoding("utf-8");

let incompleteLine = " ";

console.log("about to enter function");
inputStream.on("data", 
            (chunk) => 
            {

console.log("Entered fucntion");

               let lines = (incompleteLine + chunk).split("\n");
               incompleteLine = lines.pop();

console.log(lines);

               for(let line of lines)
               {
                  while(!line.startsWith("*"))
                     outputStream.write(line);

                  const nums = line.split("  ");
                  const left  = +nums[0];
                  const top   = +nums[1];
                  const right = +nums[2];
                  const bot   = +nums[3];

                  outputStream.write((left  + xTrans).toFixed(6) + "  " +
                                     (top   + yTrans).toFixed(6) + "  " + 
                                     (right + xTrans).toFixed(6) + "  " + 
                                     (bot   + yTrans).toFixed(6) + "  " + "\n");

                  const numLineStrips = +line;
                  outputStream.write(numLineStrips + "\n");

                  for(let j = 0; j < numLineStrips; j++)
                  {
                     // copy the number of vertices in this line-strip
                     const numVertices = +line;
                     outputStream.write(numVertices + "\n");
                     for(let i = 0; i < numVertices; i++)
                     {
                        const nums = line.split("  ");
                        const x = (+nums[1]) + xTrans;
                        const y = (+nums[2]) + yTrans;
                        outputStream.write("  " + x.toFixed(4) + 
                                           "  " + y.toFixed(4) + "\n");
                     }
                  }
               }
            });
inputStream.close();
outputStream.close();
*/

/*
import {createReadStream, createWriteStream} from "node:fs";
import * as ReadLine from "node:readline";

if(process.argv.length != 5)
   throw new Error("Usage: node TranslateGRS.js <GRS-File-Name> [<x-amount> [<y-amount>]]");

const file = process.argv[2];
const xTrans = +process.argv[3];
const yTrans = +process.argv[4];

const inputStream = createReadStream(file);
const readLine = ReadLine.createInterface(
                           { input: inputStream, 
                             crlfDelay: Infinity
                           });

const outputPath = file.substring(1 + file.indexOf("\\"), file.indexOf(".")) 
                                    + "-Trans(" + xTrans + ", " + yTrans + ").grs";
const outputStream = createWriteStream(outputPath, { encoding: "utf8" });

// this doesn't work because we need to progress to the next line
// but we can't get next line until we exit the while loop
// but we can't exit the while loop until we get the next line

for await (const line of readLine)
{
// this doesn't work because we need to progress to the next line
// but we can't get next line until we exit the while loop
// but we can't exit the while loop until we get the next line

   while(!line.startsWith("*"))
      outputStream.write(line);

   const nums = line.split("  ");

   const left  = +nums[0];
   const top   = +nums[1];
   const right = +nums[2];
   const bot   = +nums[3];

   outputStream.write((left  + xTrans).toFixed(6) + "  " +
                      (top   + yTrans).toFixed(6) + "  " + 
                      (right + xTrans).toFixed(6) + "  " + 
                      (bot   + yTrans).toFixed(6) + "  " + "\n");

   const numLineStrips = +line;
   outputStream.write(numLineStrips + "\n");

   for(let j = 0; j < numLineStrips; j++)
   {
      // copy the number of vertices in this line-strip
      const numVertices = +line;
      outputStream.write(numVertices + "\n");

      for(let i = 0; i < numVertices; i++)
      {
         const nums = line.split("  ");

         const x = (+nums[1]) + xTrans;
         const y = (+nums[2]) + yTrans;

         outputStream.write("  " + x.toFixed(4) + 
                            "  " + y.toFixed(4) + "\n");
      }
   }
}
inputStream.close();
outputStream.close();
*/

/*
import {createWriteStream, readFileSync} from "node:fs";

if(process.argv.length != 5)
   throw new Error("Usage: node TranslateGRS <GRS-File-Name> [<x-amount> [<y-amount>]]");

const file = process.argv[2];
const xTrans = +process.argv[3];
const yTrans = +process.argv[4];

const fileData = readFileSync(file);
const fileLines = fileData.toString().split("\n"); 

const outputPath = file.substring(1 + file.indexOf("\\"), file.indexOf(".")) + "-Trans(" + xTrans + ", " + yTrans + ").grs";
const outputStream = createWriteStream(outputPath, { encoding: "utf8" });

// x++ execute then increment x
// ++x increment x then execute
let lineIndex = 0;
let line = undefined; 
do
{
   line = fileLines[lineIndex++];
   outputStream.write(line + "\n");
}
while(!line.startsWith("*"));

line = fileLines[lineIndex++];

const nums = line.split("  ");
const left = +nums[0];
const top = +nums[1];
const right = +nums[2];
const bot = +nums[3];

outputStream.write((left  + xTrans).toFixed(6) + "  " +
                   (top   + yTrans).toFixed(6) + "  " + 
                   (right + xTrans).toFixed(6) + "  " + 
                   (bot   + yTrans).toFixed(6) + "  " + "\n");

line = fileLines[lineIndex++];
const numLineStrips = +line;
outputStream.write(numLineStrips + "\n");

for(let j = 0; j < numLineStrips; j++)
{
   // copy the number of vertices in this line-strip
   line = fileLines[lineIndex++];
   const numVertices = +line;
   outputStream.write(numVertices + "\n");

   for(let i = 0; i < numVertices; i++)
   {
      line = fileLines[lineIndex++];
      const nums = line.split("  ");

      const x = (+nums[1]) + xTrans;
      const y = (+nums[2]) + yTrans;

      outputStream.write("  " + x.toFixed(4) + 
                         "  " + y.toFixed(4) + "\n");
   }
}
outputStream.close();

*/


//const inputPath  = file;
//const outputPath = file.substring(1 + file.indexOf("\\"), file.indexOf(".")) + "-Trans(" + xTrans + ", " + yTrans + ").grs"

//const inputStream  = createReadStream(inputPath, {flags:'r', encoding:'utf-8', start:0});
//const outputStream = createWriteStream(outputPath);

//console.log(inputStream)
//let data = undefined;
//inputStream.on("data", function (chunk) { data += chunk.toString(); console.log(data); });

//const dataLines = data.split("\n");

// read the file data into the filedata variable
// then use the filedata variable to create an array where each element of the array is a line of the file


/*
//export default function TranslateGRS()
//{
   if(process.argv.length != 5)
      throw new Error("Usage: node TranslateGRS <GRS-File-Name> [<x-amount> [<y-amount>]]");

      const file = process.argv[2];
      const xTrans = +process.argv[3];
      const yTrans = +process.argv[4];
      
      // create the input and output paths for the input and output streams
      const input_path = file; 
      const output_path = file.substring(1 + file.indexOf("\\"), file.indexOf(".")) + "-.grs";

      // create the input and output streams to be used to read from/write to
      const inputStream  = createReadStream(input_path);
      const outputStream = createWriteStream(output_path, { encoding: "utf8" });

      // create a line reader to read line by line
      let lineReader = createInterface( { input: inputStream, terminal: false });
      
      lineReader.on("line", 
            function (line) 
            {
               //outputStream.write(line + "\n");
               //console.log(line);

               while(!line.startsWith("*"))
               {  
                  //console.log(line);
                  const nums = line.split("  ");
                  const left = +nums[0];
                  const top = +nums[1];
                  const right = +nums[2];
                  const bot = +nums[3];

                  console.log("line = " + line);
                  console.log("nums = " + left + " " + top + " " + right + " " + bot + " ");
                  break;
               }

               
            });
         

   
//}
*/

/*
export default class TranslateGRS
{
   public static void main(String[] args)
   {
         // Re-read the input file and translate it into the output file.
         try
         {
            PrintStream ps = new PrintStream( fos );
            Scanner scanner = new Scanner(fis);

            // copy the figure extents
            double left   = scanner.nextDouble();
            double top    = scanner.nextDouble();
            double right  = scanner.nextDouble();
            double bottom = scanner.nextDouble();

            ps.printf("% .6f  % .6f  % .6f  % .6f\n", left   + xFactor,
                                                      top    + yFactor,
                                                      right  + xFactor,
                                                      bottom + yFactor);

            // copy the number of line-strips
            int numLineStrips = scanner.nextInt();
            ps.println( numLineStrips );

            // copy each line-strip
            for(int j = 0; j < numLineStrips; j++)
            {
               // copy the number of vertices in this line-strip
               int numVertices = scanner.nextInt();
               ps.println( numVertices );
               for (int i = 0; i < numVertices; i++)
               {
                  double x = scanner.nextDouble();
                  double y = scanner.nextDouble();
                  x += xFactor;
                  y += yFactor;
                  ps.printf("  % .4f  % .4f\n", x, y);
               }
            }
            fis.close();
            fos.close();
         }
         catch (IOException e)
         {
            System.err.printf("ERROR! Could not write GRS file: %s\n", filename);
            e.printStackTrace(System.err);
            System.exit(-1);
         }
      }
   }
}
*/