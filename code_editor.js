//@ts-check

// access the button on the html file
const runButton = document.getElementById("run");

//console.log(runButton);

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
