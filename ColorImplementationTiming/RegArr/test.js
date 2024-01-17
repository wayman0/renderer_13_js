// import the framebuffer and color
import {FrameBuffer, Color} from "./FramebufferExport.js";

const filePath = "../../assets/textures/brick2.ppm";

const fbFile = await FrameBuffer.buildFile(filePath);

const fb = new FrameBuffer(1024, 1024, Color.black);

for(let x = 0; x < fb.width; x += 1)
    for(let y = 0; y < fb.height; y += 1)
        fb.getPixelFB(x, y);

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

fb.dumpFB2File("randomFB.ppm");