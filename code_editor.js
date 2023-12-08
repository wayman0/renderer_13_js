//@ts-check

const editor = ace.edit("input");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");

// access the elements on the html file
const runButton = document.getElementById("run");
const saveButton = document.getElementById("save");
const importButton = document.getElementById("import");
const resizer = document.getElementById("resizer");
const outBox = document.getElementById("output");

runButton.addEventListener("click", runCode);
saveButton.addEventListener("click", saveCode);
importButton.addEventListener("click", importCode);

setCanvas();
runCode();

/*
overwrite the console.log() function to allow printing
to an output text box on the webpage instead of 
having to open the console window for output
*/
const consoleLog = window.console.log;
window.console.log = log2TextArea;

// add an error event listener so that any errors get sent to the outBox
window.addEventListener("error", logError);

function log2TextArea(...args)
{
    args.forEach(consoleLog);
    
    args.forEach(displayOutput);
    // remove the last ", " and add a "\n"
    outBox.value = outBox.value.substring(0, outBox.value.length-2) + "\n";
}

function displayOutput(arg)
{
    if(Array.isArray(arg))// treat arrays as a seperate object otherwise each element is its own line
    {
        outBox.value += "["

        for(let index = 0; index < arg.length; index += 1)
        {
            if(typeof arg[index] == "string")
                outBox.value += "\"" + arg[index] + "\"";
            else if(typeof arg[index] == "object")
                displayOutput(arg[index]);
            else
                outBox.value += arg[index];

            if(index < arg.length -1)
                outBox.value += ", ";
        }   

        outBox.value += "]";
    }
    else if(typeof arg == "object")
    {
        outBox.value += "{ ";

        // grab the field names 
        const fields = Object.keys(arg);

        // loop over the parallel arrays
        for(let x = 0; x < fields.length; x += 1)
        {
            const f = fields[x];
            const v = arg[f];            

            if(typeof v == "object")
            {    
                outBox.value += f + ": "; 
                displayOutput(v);
            }
            else if(typeof v == "string")
                outBox.value += f + ": " + "\"" + v + "\"";
            else
                outBox.value += f + ": " + v;

            if(x < fields.length-1)
                outBox.value += ", ";
        }

        outBox.value += " }";
    }
    else if(typeof arg == "string")
        outBox.value += "\"" + arg + "\"";
    else 
        outBox.value += arg;

    outBox.value += ", ";
}

function logError(e)
{
    displayOutput(e.message + " at line " + e.lineno + ":" + e.colno + "\n");
}

/*
read the code from the text area
create a script tag
set the script tag to be the text area text
*/
async function runCode()
{
    let code = editor.session.getValue();
    
    if(window.localStorage.getItem("code") == null && code == "")
    {
        window.localStorage.setItem("code", await readFile("inputCode.js"));
    }
    else if(window.localStorage.getItem("code") == null && code != "")
    {
        window.localStorage.setItem("code", code);
    }
    else if(window.localStorage.getItem("code") != null && code != "")
    {
        window.localStorage.setItem("code", code);
        window.location.reload();
    }

    code = window.localStorage.getItem("code");
    editor.session.setValue(code);

    // make a script tag, 
    // set the script code to be the written code
    // and add the script to the document and remove any previous script tag additions
    const script = document.createElement("script");
    script.text = code;
    script.type = "module";
    script.id = "script";
    document.head.appendChild(script);
}

/*
prompt the user for a filename
create a href element 
set the text of the text area to be the href data
set the href to be download with the filename
add the href, click the href, delete the href
*/
function saveCode()
{
    // prompt the user for the filename
    let fileName = "" + prompt("Enter the filename", "");

    // while there is no real filename continuously prompt for one
    while(!(fileName.length > 0))
        fileName = prompt("Enter the file name", "");

    if(fileName == "null")
        return;

    // get the code in the text box
    //const code = codeBox?.value;
    const code = editor.session.getValue();

    // create a html element, set the element to be an invisible download href element
    const saveElement = document.createElement('a');
    saveElement.setAttribute("href", 'data:text/plain; charset=utf-8,' + encodeURIComponent(code));
    saveElement.setAttribute("download", fileName);
    saveElement.style.display = "none";
    
    // add the element
    document.body.appendChild(saveElement);
    
    //activate the online save code
    saveElement.click();
    
    // remove the element
    document.body.removeChild(saveElement);
}

/*
prompt the user for the file
read the file data using fetch
write the textarea text to be the read data
*/
function importCode()
{
    // create an input element and make the type be file
    const fileInput = document.createElement("input");
    fileInput.type = "file";

    // when there is a file chosen in the file input element read the file
    fileInput.onchange = readFile;

    // click on the fileInput element to start the file selection process
    fileInput.click();
}

// use fetch to read the content of the file
async function readFile(e)
{
    let file = "";

    if(typeof e == "string")
        file = e;
    else
        file = e.target.files[0].name;
    
    const response = await fetch(file, {method: "GET"});
    const text = await response.text();

    editor.session.setValue(text);

    return text;
}

// get and set the canvas to be black to start with
function setCanvas()
{
    const w = resizer?.offsetWidth;
    const h = resizer?.offsetHeight;

    //@ts-ignore
    const ctx = document.getElementById("pixels").getContext("2d");
    // @ts-ignore
    if (ctx == null)
    {
       console.log("cn.getContext(2d) is null");
    }

    ctx.canvas.width = w;
    ctx.canvas.height = h;

    //@ts-ignore
    const black = new Uint8ClampedArray(w * h * 4);
    for(let x = 3; x < black.length; x += 4)
        black[x] = 255;

    //@ts-ignore
    ctx.putImageData(new ImageData(black, w, h), 0, 0);
}

// add a simple rotating sphere example to the text area upon loading
function addExample()
{
    let exampleStr = "//@ts-check\n";
    exampleStr += "//Import what is necessary for your code\n"
    exampleStr += "import {Scene, Position, Matrix, Model, Vertex, LineSegment} from \"./renderer/scene/SceneExport.js\";\n";
    exampleStr += "import {renderFB, setDoAntiAliasing, doAntiAliasing, setDoGamma, doGamma} from \"./renderer/pipeline/PipelineExport.js\";\n";
    exampleStr += "import {FrameBuffer, Viewport, Color} from \"./renderer/framebuffer/FramebufferExport.js\";\n";
    exampleStr += "import {Sphere} from \"./renderer/models_L/ModelsExport.js\";\n";
    exampleStr += "import * as ModelShading from \"./renderer/scene/util/UtilExport.js\";\n";
    exampleStr += "\n";
    
    exampleStr += "//Create a default sphere from the Models import\n"
    exampleStr += "const sphereMod = new Sphere();\n";
    exampleStr += "//Set the sphere to be a random color using the Model Shading import\n"
    exampleStr += "ModelShading.setRandomColor(sphereMod);\n";
    exampleStr += "\n";
    
    exampleStr += "//Create a position to hold the model\n"
    exampleStr += "const spherePos = Position.buildFromModel(sphereMod);\n";
    exampleStr += "//Set the position to be translated back 3 units\n"
    exampleStr += "spherePos.setMatrix(Matrix.translate(0, 0, -3));\n";
    exampleStr += "\n";
    
    exampleStr += "//Create an empy scene\n"
    exampleStr += "const scene = new Scene();\n";
    exampleStr += "//Add the sphere position to the scene\n"
    exampleStr += "scene.addPosition(spherePos);\n";
    exampleStr += "\n";

    exampleStr += "//Create timer to hold the timerID returned by the setInterval() function\n"
    exampleStr += "let timer = null;\n";
    exampleStr += "displayNextFrame();\n";
    exampleStr += "\n";

    exampleStr += "//The function that sets the timer to the timerID returned by setInterval\n"
    exampleStr += "//and will contiuously call rotate() and then display() at a rate of 50fps\n"
    exampleStr += "function displayNextFrame()\n";
    exampleStr += "{\n";
    exampleStr += "    timer = setInterval( () => \n";
    exampleStr += "            {\n";
    exampleStr += "                rotate();\n";
    exampleStr += "                display();\n";
    exampleStr += "            }, 1000/50);//50 fps\n";
    exampleStr += "}\n";
    exampleStr += "\n";
    exampleStr += "//Create a variable to store the rotations for the sphere\n"
    exampleStr += "let rot = 0;\n";
    exampleStr += "//The function that actually rotates the sphere along its y axis\n"
    exampleStr += "function rotate()\n";
    exampleStr += "{\n";
    exampleStr += "    // rotate the sphere along its y axis by 1 more degree\n";
    exampleStr += "    spherePos.getMatrix().mult(Matrix.rotateY(1));\n";
    exampleStr += "\n";
    exampleStr += "    /*\n";
    exampleStr += "    could also do:\n";
    exampleStr += "\n";
    exampleStr += "    // reset the sphere matrix to be translated back 3 units and then rotated along its y axis by rot\n";
    exampleStr += "    spherePos.setMatrix(\n";
    exampleStr += "                Matrix.translate(0, 0, -3)\n";
    exampleStr += "                .mult(Matrix.rotateY(rot)));\n";
    exampleStr += "\n";
    exampleStr += "    // increment the amount to rotate the sphere by for the next frame\n";
    exampleStr += "    rot = rot%360 + 1;\n";
    exampleStr += "    */\n";
    exampleStr += "}\n";
    exampleStr += "\n";

    exampleStr += "//Create a resize observer that calls display \n";
    exampleStr += "//and set it to observe the resizer html element\n";
    exampleStr += "//This allows the canvas to be redrawn when it is resized\n"
    exampleStr += "const resizerEl = document.getElementById(\"resizer\");\n";
    exampleStr += "const resizer = new ResizeObserver(display);\n";
    exampleStr += "resizer.observe(resizerEl);\n";
    exampleStr += "//The function that is responsible for rendering the scene into the fb \n";
    exampleStr += "//and that then redraws the canvas to be the fb\n"
    exampleStr += "function display()\n";
    exampleStr += "{\n";
    exampleStr += "    //get the width and height of the resizer\n"
    exampleStr += "    const w = resizerEl.offsetWidth;\n";
    exampleStr += "    const h = resizerEl.offsetHeight;\n";
    exampleStr += "\n";
    exampleStr += "    const ctx = document.getElementById(\"pixels\").getContext(\"2d\");\n";
    exampleStr += "\n";
    exampleStr += "    if(ctx == null)\n";
    exampleStr += "    {    \n";
    exampleStr += "        console.log(\"Warning: ctx.getContext(2d) is null\");\n";
    exampleStr += "        return;\n";
    exampleStr += "    }\n";
    exampleStr += "\n";
    exampleStr += "    //Set the canvas to be the size of the resizer\n"
    exampleStr += "    ctx.canvas.width = w;\n";
    exampleStr += "    ctx.canvas.height = h;\n";
    exampleStr += "\n";
    exampleStr += "    //Create a framebuffer to be the size of the resizer/canvas and render the scene into it\n"
    exampleStr += "    const fb = new FrameBuffer(w, h, Color.black);\n";
    exampleStr += "    renderFB(scene, fb);\n";
    exampleStr += "\n";
    exampleStr += "    // could also do\n";
    exampleStr += "    //render(scene, fb.vp);\n";
    exampleStr += "\n";
    exampleStr += "    //write the framebuffer to the canvas\n"
    exampleStr += "    ctx.putImageData(new ImageData(fb.pixelBuffer, fb.width, fb.height), fb.vp.vp_ul_x, fb.vp.vp_ul_y);\n";
    exampleStr += "}\n";
    exampleStr += "\n";

    exampleStr += "//Add a key listener to the document to allow the animation to be started/stopped\n"
    exampleStr += "let play = true;\n";
    exampleStr += "document.addEventListener(\"keypress\", keyPressed);\n";
    exampleStr += "function keyPressed(keyEvent)\n";
    exampleStr += "{\n";
    exampleStr += "    const c = keyEvent.key;\n";
    exampleStr += "\n";
    exampleStr += "    if(c == 's' && play == false)// if the animation isn't playing and the 's' key is pressed start the animation\n";
    exampleStr += "    {\n";
    exampleStr += "        displayNextFrame();\n";
    exampleStr += "        play = !play;\n";
    exampleStr += "    }\n";
    exampleStr += "    else if(c == 'S' && play == true) // if the animation is playing and the 'S' key is pressed stop the animation\n";
    exampleStr += "    {\n";
    exampleStr += "        clearInterval(timer);\n";
    exampleStr += "        play = !play;\n";
    exampleStr += "    }\n";
    exampleStr += "}\n";

    //codeBox.value = exampleStr;
    editor.setValue(exampleStr, -1);
}