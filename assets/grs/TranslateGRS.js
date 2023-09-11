//@ts-check

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