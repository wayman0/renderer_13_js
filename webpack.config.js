// uncomment when figure out how to use path in es6 module
//import * as path from "path";

const configOpts =  
{

    // where the bundler should start
    entry: "./renderer/rendererExport.js",

    output: 
    {
        // the filename for the outputed bundle
        filename: "rendererBundle.js",

        // where to put the bundle I chose current directory so the root folder
        // doesn't want to work with es6 modules
        //path: path.resolve(__dirname, "./"),
    },  

    // makes a minified optimized bundle
    mode : "production",
    
    // tells the bundler the bundle is going to be used on the web
    target : "web",
    
};

export default configOpts;