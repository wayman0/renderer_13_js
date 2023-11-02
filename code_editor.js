//@ts-check

// get and set the canvas to be black to start with
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

// access the button on the html file
const runButton = document.getElementById("run");

// add the runCode function to the button's event listener
runButton?.addEventListener("click", runCode);

function runCode()
{
    const codeBox = document.getElementById("input");
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
