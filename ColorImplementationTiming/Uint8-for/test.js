// import the framebuffer and color
import {FrameBuffer, Color} from "./FramebufferExport.js";

const filePath = "../../assets/textures/brick2.ppm";

let startTime = new Date().getTime(); 
const fbFile = await FrameBuffer.buildFile(filePath);
let endTime = new Date().getTime();
console.log("buildFile: " + (endTime - startTime));

startTime = new Date().getTime();
const fb = new FrameBuffer(1024, 1024, Color.black);
endTime = new Date().getTime();
console.log("Instantiate: " + (endTime - startTime));

startTime = new Date().getTime();
for(let x = 0; x < fb.width; x += 1)
    for(let y = 0; y < fb.height; y += 1)
        fb.getPixelFB(x, y);
endTime = new Date().getTime();
console.log("Get Pixel: " + (endTime - startTime));

startTime = new Date().getTime();
for(let x = 0; x < fb.width; x += 1)   
{
    for(let y = 0; y < fb.height; y += 1)
    {   
        const col = new Color(255 * Math.random(),
                              255 * Math.random(), 
                              255 * Math.random(), 
                              255); 
        fb.setPixelFB(x, y, col);
    }
}
endTime = new Date().getTime();
console.log("Set Pixel: " + (endTime - startTime));

startTime = new Date().getTime();
fb.dumpFB2File("randomFB.ppm");
endTime = new Date().getTime();
console.log("Write: " + (endTime - startTime));
console.log("---------------------------------------------");
