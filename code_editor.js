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

// add a key pressed event listener to allow completion of () {} []
codeBox?.addEventListener("keypress", codeFeatures);

// add a key down to the document for auto tabbing,
// tabs don't belong to text area so adding to text area doesn't work
// has to be key down instead of key up because key up wont prevent default
// key pressed just doesn't recognize tab key
document?.addEventListener("keydown", codeFeatures);

setCanvas();
addImportCode();
addDisplayCode();
addAnimationCode();


// need a way to access the timer variable inside any previous running script tags
// and then call clearInterval() with the timer variable
// way to do this is rewrite the clearInterval() and setInterval timers
// and then when the text area code runs it will call my rewritten timer
// fucntion so that I can get the timer id's of any previous runnings
// and then can clear all timers every time the run code button is ran

// create an array to hold all timer ids
window.timerIds = [];
// make copies of the window functions
window.oldSetInterval = window.setInterval;
window.oldClearInterval = window.clearInterval;

// write the set and clear functions to be my defined functions
window.setInterval = newSetInterval;
window.clearInterval = newClearInterval;

function newSetInterval(func, duration)
{
    console.log("called new Set interval");

    if(typeof func != "function" || typeof duration != "number")
        throw new Error("Set Interval requires a function and a time");

    // call the old setInterval function and get the timerId
    // store the timer id and then return it
    const timerId = window.oldSetInterval(func, duration);
    window.timerIds.push(timerId);

    return timerId;
}

function newClearInterval(timerId)
{
    // call the old clearInterval function with the given timerId
    window.oldClearInterval(timerId);
}

const consoleLog = window.console.log;
window.console.log = log2TextArea;

function log2TextArea(...args)
{
    consoleLog(...args);

    const output = document.getElementById("output");
    args.forEach( arg => {output.value += JSON.stringifiy(arg) + "\n"} );
}

// read the code from the text area
// create a script tag
// set the script tag to be the text area text
function runCode()
{
    // remove any previous running script tag
    const prevScript = document.getElementById("script");
    prevScript?.remove();

    // remove all previous timers by calling clearInterval using the window's list of timerIds
    while(window.timerIds.length > 0)
        window.clearInterval(window.timerIds.pop());

    //@ts-ignore
    const code = codeBox?.value;

    // make a script tag,
    // set the script code to be the written code
    // and add the script to the document and remove any previous script tag additions
    const script = document.createElement("script");
    script.text = code;
    script.type = "module";
    script.id = "script";
    document.head.appendChild(script);
}

const parStack = [];
const curlyStack = [];
const bracketStack = [];
const doubleQuoteStack = [];
const singleQuoteStack = [];
const tab = '\t';

function codeFeatures(e)
{
    const start = codeBox.selectionStart;
    const end = codeBox.selectionEnd;
    const code = codeBox.value;
    const beforeText = code.substring(0, start);
    const afterText = code.substring(end, code.length);

    const c = e.key;

    // no text was highlighted
    if(start == end)
    {
        if(c == '[')
        {
            e.preventDefault();
            bracketStack.push('[');
            codeBox.value = beforeText + '[]' + afterText;
            codeBox.selectionStart = start+1;
            codeBox.selectionEnd = end+1;
        }
        else if(c == '{')
        {
            e.preventDefault();
            curlyStack.push('{');

            codeBox.value = beforeText + '{';

            const tempCurlyStack = [];
            for(const c of beforeText)
            {
                if(c == '{')
                    tempCurlyStack.push('{');
                else if(c == '}')
                    tempCurlyStack.pop();
            }

            for(let x = 0; x < tempCurlyStack.length; x += 1)
                codeBox.value += tab;

            codeBox.value += '}' + afterText;

            codeBox.selectionStart = start+1;
            codeBox.selectionEnd = end+1;
        }
        else if(c == '(')
        {
            e.preventDefault();
            parStack.push('(');
            codeBox.value = beforeText + '()' + afterText;
            codeBox.selectionStart = start+1;
            codeBox.selectionEnd = end+1;
        }
        else if(c == "\"")
        {
            e.preventDefault();
            doubleQuoteStack.push("\"");
            codeBox.value = beforeText + "\"\"" + afterText;
            codeBox.selectionStart = start+1;
            codeBox.selectionEnd = end+1;
        }
        else if(c == "'")
        {
            e.preventDefault();
            singleQuoteStack.push("'");
            codeBox.value = beforeText + "''" + afterText;
            codeBox.selectionStart = start+1;
            codeBox.selectionEnd = end+1;
        }
        else if(c == ']' && bracketStack.length != 0)
        {
            if(afterText.substring(0, 1) == ']')
            {
                e.preventDefault();
                bracketStack.pop();
                codeBox.selectionStart = star
                codeBox.selectionEnd = end+1;
            }
        }
        else if(c == '}' && curlyStack.length != 0)
        {
            if(afterText.substring(0, 1) == '}')
            {
                e.preventDefault();
                curlyStack.pop();
                codeBox.selectionStart = start+1;
                codeBox.selectionEnd = end+1;
            }
        }
        else if(c == ')' && parStack.length != 0)
        {
            if(afterText.substring(0, 1) == ')')
            {
                e.preventDefault();
                parStack.pop();
                codeBox.selectionStart = start+1;
                codeBox.selectionEnd = end+1;
            }
        }
        else if(c == '"' && doubleQuoteStack.length != 0)
        {
            if(afterText.substring(0, 1) == '"')
            {
                e.preventDefault();
                doubleQuoteStack.pop();
                codeBox.selectionStart = start+1;
                codeBox.selectionEnd = end +1;
            }
        }
        else if(c == "'" && singleQuoteStack.length != 0)
        {
            if(afterText.substring(0, 1) == "'")
            {
                e.preventDefault();
                singleQuoteStack.pop();
                codeBox.selectionStart = start+1;
                codeBox.selectionEnd = end+1;
            }
        }
        else if(c == 'Tab')
        {
            e.preventDefault();
            codeBox.value = beforeText + tab + afterText
            codeBox.selectionStart = start + 1;
            codeBox.selectionEnd = end + 1;
        }
        else if(c == 'Enter')
        {
            e.preventDefault();
            codeBox.value = beforeText + '\n';

            // make a temporary stack to determine how indented
            // we are based upon how many uncomplete braces there are
            const tempCurlyStack = [];
            for(const c of beforeText)
            {
                if(c == '{')
                    tempCurlyStack.push('{');
                else if(c == '}')
                    tempCurlyStack.pop();
            }

            for(let x = 0; x < tempCurlyStack.length; x += 1)
                codeBox.value += tab;

            if(beforeText.charAt(beforeText.length-1) == '{')
                codeBox.value += '\n' + afterText;
            else
                codeBox.value += afterText;

            codeBox.selectionStart = start + 1 + tempCurlyStack.length;
            codeBox.selectionEnd = end + 1 + tempCurlyStack.length;
        }
    }
    else
    {
        const highlighted = code.substring(start, end);

        if(c == '[')
        {
            e.preventDefault();
            codeBox.value = beforeText + '[' + highlighted + ']' + afterText;
        }
        else if(c == '{')
        {
            e.preventDefault();
            codeBox.value = beforeText + '{' + highlighted + '}' + afterText;
        }
        else if(c == "(")
        {
            e.preventDefault();
            codeBox.value = beforeText + '(' + highlighted + ')' + afterText;
        }
        else if(c == '"')
        {
            e.preventDefault();
            codeBox.value = beforeText + '"' + highlighted + '"' + afterText;
        }
        else if(c == "'")
        {
            e.preventDefault();
            codeBox.value = beforeText + "'" + highlighted + "'" + afterText;
        }
        else if(c == "Tab")
        {
            e.preventDefault();

            codeBox.value = beforeText;

            const toIndent = highlighted.split("\n");
            for(const line of toIndent)
                codeBox.value += tab + line;

            codeBox.value += afterText;

            if(codeBox.selectionDirection == "backward")// moving towards the end
            {
                codeBox.selectionStart = end+1;
                codeBox.selectionEnd = end+1;
            }
            else if(codeBox.selectionDirection == "forward")// moving towards the start
            {
                codeBox.selectionStart = start + 1;
                codeBox.selectionEnd = start + 1;
            }

        }
        else if(c == "Enter")
        {
            e.preventDefault();
            codeBox.value = beforeText + "\n" + highlighted + "\n" + afterText;

            if(codeBox.selectionDirection == "backward")// moving towards the end
            {
                codeBox.selectionStart = end+1;
                codeBox.selectionEnd = end+1;
            }
            else if(codeBox.selectionDirection == "forward")// moving towards the start
            {
                codeBox.selectionStart = start + 1;
                codeBox.selectionEnd = start + 1;
            }
        }
    }
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
    codeBox.value += "import {Scene} from \"./renderer/scene/sceneExport.js\";\n";
    codeBox.value += "import {renderFB} from \"./renderer/pipeline/pipelineExport.js\";\n";
    codeBox.value += "import {FrameBuffer} from \"./renderer/framebuffer/FramebufferExport.js\";\n";
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
    codeBox.value += "//uncomment clearInterval(timer) to stop animation\n";
    codeBox.value += "let timer = null;\n";
    codeBox.value += "//displayNextFrame();\n";
    codeBox.value += "function displayNextFrame()\n";
    codeBox.value += "{\n";
    codeBox.value += "\ttimer = setInterval(function() \n";
    codeBox.value += "\t{\n";
    codeBox.value += "\t\t'//move models function'\n";
    codeBox.value += "\t\tdisplay();\n";
    codeBox.value += "\t}, 1000/50); // 50 frames per second\n";
    codeBox.value += "}\n";
    codeBox.value += "//clearInterval(timer);\n"
}
