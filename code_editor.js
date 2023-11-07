//@ts-check

// access the button on the html file
const runButton = document.getElementById("run");
const saveButton = document.getElementById("save");
const importButton = document.getElementById("import");
const codeBox = document.getElementById("input");

// add the runCode function to the run button's event listener
runButton?.addEventListener("click", runCode);

// add the saveCode fucntion to the save buttons event listener
saveButton?.addEventListener("click", saveCode);

// add the importCode function to the import buttons event listener
importButton?.addEventListener("click", importCode);

setCanvas();
addImportCode();
addDisplayCode();
addAnimationCode();

// read the code from the text area
// create a script tag
// set the script tag to be the text area text
function runCode()
{
    //@ts-ignore
    const code = codeBox?.value;
    
    // make a script tag, 
    // set the script code to be the written code
    // and add the script to the document and remove any previous script tag additions
    const script = document.createElement("script");
    script.text = code;
    script.type = "module";
    document.head.appendChild(script).parentNode?.removeChild(script);
}

// prompt the user for a filename
// create a href element 
// set the text of the text area to be the href data
// set the href to be download with the filename
// add the href, click the href, delete the href
function saveCode()
{
    // prompt the user for the filename
    let fileName = "" + prompt("Enter the filename", "");
    console.log(fileName);

    // while there is no real filename continuously prompt for one
    while(!(fileName.length > 0))
        fileName = prompt("Enter the file name", "");

    if(fileName == "null")
        return;

    // get the code in the text box
    const code = codeBox?.value;

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

// prompt the user for the file
// read the file data using fetch
// write the textarea text to be the read data
function importCode()
{
    // create an input element and make the type be file
    const fileInput = document.createElement("input");
    fileInput.type = "file";

    // when there is a file chosen in the file input element read the file
    fileInput.onchange = e =>  
        {
            // get the file 
            // @ts-ignore
            const file = e.target.files[0];

            // create a new FileReader and read the file
            const reader = new FileReader();
            reader.readAsText(file, 'UTF-8');

            // when the file is completely read
            reader.onload = readerEvent => 
            {
                // get the text from the file
                // @ts-ignore
                const text = readerEvent.target.result; 

                // set the text area to be the read text
                // @ts-ignore
                codeBox.value = text;
            }
        }

    // click on the fileInput element to start the file selection process
    fileInput.click();
}

// get and set the canvas to be black to start with
function setCanvas()
{
    const resizer = document.getElementById("resizer");
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

// add the import code to the text box
function addImportCode()
{
    codeBox.value += "//ts-check\n\n";
    codeBox.value += "//import what is necessary from the appropriate imports\n"
    codeBox.value += "import {} from \"./renderer/scene/sceneExport.js\";\n";
    codeBox.value += "import {} from \"./renderer/pipeline/pipelineExport.js\";\n";
    codeBox.value += "import {} from \"./renderer/framebuffer/FramebufferExport.js\";\n";
}

// add the writing to a canvas code to the text box
function addDisplayCode()
{
    codeBox.value += "\n\n";
    codeBox.value += "//Code to display the scene created\n";
    codeBox.value += "const resizer = new ResizeObserver(display);\n";
    codeBox.value += "resizer.observe(document.getElementById(\"resizer\"));\n";
    codeBox.value += "function display()\n";
    codeBox.value += "{\n";
    codeBox.value += "\tconst resizer = document.getElementById(\"resizer\");\n";
    codeBox.value += "\tconst w = resizer?.offsetWidth;\n";
    codeBox.value += "\tconst h = resizer?.offsetHeight;\n";
    codeBox.value += "\n";
    codeBox.value += "\tconst ctx = document.getElementById(\"pixels\").getContext(\"2d\");\n";
    codeBox.value += "\tif(ctx == null)\n";
    codeBox.value += "\t{\n\t\tconsole.log(\"cn.getContext(2d) is null\");\n\t\treturn;\n\t}\n\n";
    codeBox.value += "\tctx.canvas.width = w;\n";
    codeBox.value += "\tctx.canvas.height = h;\n\n";
    codeBox.value += "\tconst fb = new FrameBuffer(w, h);\n\n";
    codeBox.value += "\trenderFB(scene, fb);\n\n";
    codeBox.value += "\tctx.putImageData(new ImageData(fb.pixelBuffer, fb.width, fb.height), fb.vp.vp_ul_x, fb.vp.vp_ul_y);\n";
    codeBox.value += "}\n";
}

// add the animation code to the text box
function addAnimationCode()
{
    codeBox.value += "\n\n";
    codeBox.value += "//Code to animate the program\n";
    codeBox.value += "//uncomment displayNextFrame to start animation\n";
    codeBox.value += "// uncomment timer = clearInterval() to stop animation\n";
    codeBox.value += "let timer = null;\n";
    codeBox.value += "//displayNextFrame();\n";
    codeBox.value += "function displayNextFrame()\n";
    codeBox.value += "{\n";
    codeBox.value += "\ttimer = setInterval(function() \n";
    codeBox.value += "\t{\n";
    codeBox.value += "\t\t'move models function'\n";
    codeBox.value += "\t\tdisplay();\n";
    codeBox.value += "\t}, 1000/50); // 50 frames per second\n";
    codeBox.value += "}\n";
    codeBox.value += "//timer = clearInterval();\n"
}