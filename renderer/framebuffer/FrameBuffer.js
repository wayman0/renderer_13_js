/*
    FrameBuffer. The MIT License.
    Copyright (c) 2022 rlkraft@pnw.edu
    See LICENSE for details.
*/

//@ts-check
import {Viewport, Color} from "./FramebufferExport.js";
import {format} from "../scene/util/UtilExport.js";

export default class FrameBuffer
{
    /**@type {number} #width the width of a framebuffer*/ #width;
    /**@type {number} #height the height of this framebuffer*/ #height;
    /**@type {Color} #bgColorFB the default color of the framebuffer*/ #bgColorFB;
    /**@type {Viewport} #vp the viewport for this framebuffer */ #vp;    
    /**@type {Uint8ClampedArray} #pixelBuffer the actual pixel data for this framebuffer */ #pixelBuffer;

    /**
    A {@code FrameBuffer} represents a two-dimensional array of pixel data.
    The pixel data is stored as a one dimensional array in row-major order.
    The first row of data should be displayed as the top row of pixels
    in the image.
<p>
    A {@link Viewport} is a two-dimensional sub array of a {@code FrameBuffer}.
<p>
    A {@code FrameBuffer} has a default {@link Viewport}. The current {@link Viewport}
    is represented by its upper-left-hand corner and its lower-right-hand
    corner.
<p>
    {@code FrameBuffer} and {@link Viewport} coordinates act like Java
    {@link java.awt.Graphics2D} coordinates; the positive x direction is
    to the right and the positive y direction is downward.
*/

    /**
     * Construct a {@code FrameBuffer} with the width, height, and Color specified.
     * Width and height have the default value of 0, and color has the default color black
     * Will round Width and Height using the Math.round function.
     *
     * @param {number} width the width of the {@code FrameBuffer}
     * @param {number} height the height of the {@code FrameBuffer}
     * @param {Color} color the background {@link Color} of the {@code FrameBuffer}
     */
    constructor(width, height, color = Color.Black)
    {
        if (typeof width != "number" ||
            typeof height != "number")
               throw new Error("Width and Height must be numerical");

        if (color instanceof Color == false)
            color = Color.Black;

        this.#width = Math.round(width);
        this.#height = Math.round(height);
        this.#bgColorFB = color;
        
        this.#pixelBuffer = new Uint8ClampedArray(this.#width * this.#height * 4);
        this.#vp = Viewport.buildParent(this);

        //this.clearFB(this.#bgColorFB);
    }


    /**
     * Creates an exact duplicate {@code FrameBuffer} out of the source {@code FrameBuffer}.
     *
     * @param {FrameBuffer} source
     * @returns {FrameBuffer} this {@code FrameBuffer} object created
     */
    static buildFB(source)
    {
        if (source instanceof FrameBuffer == false)
            throw new Error("Source is not instance of FrameBuffer");

        const fb = new FrameBuffer(source.getWidthFB(),
                                   source.getHeightFB(),
                                   source.getBackgroundColorFB());

        for( let x = 0; x < source.getWidthFB(); x += 1)
        {
            for (let y = 0; y < source.getHeightFB(); y += 1)
            {
                fb.setPixelFB(x, y, source.getPixelFB(x, y));
            }
        }

        return fb;
    }


    /**
     * Creates an exact duplicate {@code FrameBuffer} out of the source {@code Viewport}
     *
     * @param {Viewport} source
     * @returns {FrameBuffer} this {@code FrameBuffer} object created
     */
    static buildVP(source)
    {
        if (source instanceof Viewport == false)
            throw new Error("Source is not instance of Viewport");

        const fb = new FrameBuffer(source.getWidthVP(),
                                   source.getHeightVP(),
                                   source.getBackgroundColorVP());

        for (let x = 0; x < source.getWidthVP(); x += 1)
        {
            for (let y = 0; y < source.getHeightVP(); y += 1)
            {
                fb.setPixelFB(x, y, source.getPixelVP(x, y));
            }
        }

        return fb;
    }

    /**
       Construct a {@code FrameBuffer} from a PPM image file.
    <p>
       The size of the {@code FrameBuffer} will be the size of the image.
    <p>
       The default {@link Viewport} is the whole {@code FrameBuffer}.
    <p>
       This can be used to initialize a {@code FrameBuffer}
       with a background image.

       NOTE: THIS CODE IS ASYNCHRONOUS, MUST USE AWAIT!!!

       @param {string} fileName  must name a PPM image file with magic number P6.
       @returns {Promise<FrameBuffer>}
    */
    static async buildFile(fileName)
    {        
        if(typeof fileName != "string")
            throw new Error("Filename must be a string");
        
        try
        {
            document;
            return await FrameBuffer.#buildFileOnline(fileName);
        }
        catch(e)
        {
            return await FrameBuffer.#buildFileOffline(fileName);
        }
    }

    static async #buildFileOnline(fileName)
    {
        const resp = await fetch(fileName, {method : "GET"});
        const data = await resp.arrayBuffer();

        return FrameBuffer.interpretData(new Uint8Array(data));
    }

    /**
     * @param {string} fileName 
     * @returns {Promise<FrameBuffer>}
     */
    static async #buildFileOffline(fileName)
    {
        const fs = await import("node:fs");
        const buffer = fs.readFileSync(fileName);

        return FrameBuffer.interpretData(Uint8Array.from(buffer));
    }

    /**
     * @param {Uint8Array} data 
     * @returns {FrameBuffer} a framebuffer made from the data buffer
     */
    static interpretData(data)
    {
        // record where in the buffer we are
        let buffIndex = 0; 

        // read the P6 bytes
        const byteP = data[buffIndex++];
        const byte6 = data[buffIndex++];

        if(String.fromCharCode(byteP, byte6) != "P6")
            throw new Error("Missing the magic P6");

        // skip any non numbers
        while(data[buffIndex] < 48 || data[buffIndex] > 57)
            buffIndex += 1;

        // create a varaible to store the width
        let widthStr = "";
        // get the width dimensions
        while(data[buffIndex] >= 48 && data[buffIndex] <= 57)
            widthStr += String.fromCharCode(data[buffIndex++]);

        // skip the space between the dimensions
        buffIndex++;

        // create a variable to store the height
        let heightStr = "";
        // get the height dimensions
        while(data[buffIndex] >= 48 && data[buffIndex] <= 57)
            heightStr += String.fromCharCode(data[buffIndex++]);
        
        // create the framebuffer
        const fb = new FrameBuffer(+widthStr, +heightStr);

        // skip any nonnumbers
        while(data[buffIndex] < 48 || data[buffIndex] > 57)
            buffIndex += 1;
        
        // create a variable for the number of bytes per r, g, b
        let maxValStr = "";
        // get the number of bytes per r, g, b
        while(data[buffIndex] >= 48 && data[buffIndex] <= 57)
            maxValStr +=String.fromCharCode(data[buffIndex++]);

        // skip any whitespace, whose ascii value is <= 32
        while(data[buffIndex] <= 32)
            buffIndex += 1;

        // create a variable to store where in the pixel buffer we are
        let fbIndex = 0;
        // read the pixel byte data
        for(; buffIndex < data.length; buffIndex += 3)
        {
            let r = data[buffIndex + 0];
            let g = data[buffIndex + 1];
            let b = data[buffIndex + 2];
            const a = 255;

            if(r < 0) r += 256;
            if(g < 0) g += 256;
            if(b < 0) b += 256;

            fb.pixelBuffer[fbIndex + 0] = r;
            fb.pixelBuffer[fbIndex + 1] = g;
            fb.pixelBuffer[fbIndex + 2] = b;
            fb.pixelBuffer[fbIndex + 3] = a;
            
            fbIndex += 4;
        }
        
        return fb;
    }

    /**
     * Get the width of this {@code FrameBuffer}
     *
     * @returns {number} the width of this {@code FrameBuffer}
     */
    getWidthFB()
    {
        return this.#width;
    }

    get width()
    {
        return this.#width;
    }


    /**
     * Get the height of this {@code FrameBuffer}
     *
     * @returns {number} the height of this {@code FrameBuffer}
     */
    getHeightFB()
    {
        return this.#height;
    }

    get height()
    {
        return this.#height;
    }


    /**
     * Get the background {Color} of this {@code FrameBuffer}
     *
     * @returns {Color} the background {Color} of this {@code FrameBuffer}
     */
    getBackgroundColorFB()
    {
        return this.#bgColorFB;
    }

    get bgColorFB()
    {
        return this.#bgColorFB;
    }


    /**
     * Set this {@code FrameBuffer} new background color.
     * <p>
     * NOTE: this does not clear the contents of the {@code FrameBuffer}.
     * to the given {Color}.  To actually change all the {@code FrameBuffer}
     * pixels to the given {Color} call {clearFB()} method.
     *
     * @param {Color} color: the new background color
     */
    setBackgroundColorFB(color)
    {
        if (color instanceof Color == false)
            throw new Error("Color must be instance of Color");

        this.#bgColorFB = color;
    }


    set bgColorFB(color)
    {
        if (color instanceof Color == false)
            throw new Error("Color must be instance of Color");

        this.#bgColorFB = color;
    }


    /**
     * Get the default {Viewport} of this {@code FrameBuffer}
     *
     * @returns {Viewport} the {Viewport} of this {@code FrameBuffer}
     */
    getViewport()
    {
        return this.#vp;
    }

    get vp()
    {
        return this.#vp;
    }

    get pixelBuffer()
    {
        return this.#pixelBuffer;
    }

    getPixelBuffer()
    {
        return this.#pixelBuffer;
    }

    /**
     * Set this {@code FrameBuffer} default {Viewport} to be this whole this {@code FrameBuffer}
    */
    setViewportDefault()
    {
        this.setViewport(this.getWidthFB(), this.getHeightFB());
    }


    /**
     * Set the default {Viewport} with the given upper left hand corner, width, and height within this {@code FrameBuffer}
     * If no upper left hand corner is given uses (0, 0) as the default upper left corner for the {Viewport}
     *
     * @param {number} width width of this {@code FrameBuffer} default {Viewport}
     * @param {number} height this {@code FrameBuffer} default {Viewport}
     * @param {number} upperLeftX upper left hand x coordinate of this {@code FrameBuffer} default {Viewport}
     * @param {number} upperLeftY upper left hand y coordinate of this {@code FrameBuffer} default {Viewport}
     * @param {Color} bgColVP the background color of this viewport 
    */
    setViewport(width, height, upperLeftX = 0, upperLeftY = 0, bgColVP = this.#bgColorFB)
    {
        if (typeof upperLeftX != "number" ||
            typeof upperLeftY != "number" ||
            typeof width      != "number" ||
            typeof height     != "number")
                throw new Error("All Parameters must be Numerical");

        this.#vp.setViewport(width, height, upperLeftX, upperLeftY, bgColVP);
    }


    /**
     * Clear this {@code FrameBuffer} using the background color of this {@code FrameBuffer}
     */
    clearFBDefault()
    {
        this.clearFB(this.getBackgroundColorFB());
    }


    /**
     * Clear this {@code FrameBuffer} using the given {Color}
     *
     * @param {Color} color the color to set this {@code FrameBuffer} pixels to
     */
    clearFB(color = this.#bgColorFB)
    {
        if (color instanceof Color == false)
            throw new Error("Color must be a Color");

        const rgba = color.rgb;
        for(let startPixel = 0; startPixel < this.#pixelBuffer.length; startPixel += 4)
        {
            this.#pixelBuffer[startPixel + 0] = rgba[0];
            this.#pixelBuffer[startPixel + 1] = rgba[1];
            this.#pixelBuffer[startPixel + 2] = rgba[2];
            this.#pixelBuffer[startPixel + 3] = rgba[3];
        }
    }


    /**
     * Get the {Color} of the pixel within this {@code FrameBuffer} at the given {@code (x, y)} coordinate
     * NOTE: will round x and y using Math.round().
     *
     * @param {number} x horizontal coordinate within this {@code FrameBuffer}
     * @param {number} y vertical coordinate within this {@code FrameBuffer}
     * @returns {Color} the {Color} of the pixel at the given (x, y) coordinate
     */
    getPixelFB(x, y)
    {
        if (typeof x != "number" || typeof y != "number")
            throw new Error("x and y must be numerical");

        x = Math.round(x);
        y = Math.round(y);

        const index = y * this.getWidthFB() + x;

        if (index >= this.#pixelBuffer.length)
            throw new Error("FrameBuffer: Bad pixel coordinate " +
                            "(" + x + ", " + y + ") " +
                            "[w= " + this.getWidthFB() + ", h= " + this.getHeightFB() + "]");
      
        const startPixelData = this.width * 4 * y + 4 * x;

        const r = this.#pixelBuffer[startPixelData + 0];
        const g = this.#pixelBuffer[startPixelData + 1];
        const b = this.#pixelBuffer[startPixelData + 2];
        const a = this.#pixelBuffer[startPixelData + 3];

        return new Color(r, g, b, a);
    }


    /**
     * Set the {Color} of the pixel within this {@code FrameBuffer} at the given {@code (x, y)} coordinate
     * Note: if no color is uses by deafult uses Color.black;
     *
     * @param {number} x horizontal coordinate within this {@code FrameBuffer}
     * @param {number} y vertical coordinate within this {@code FrameBuffer}
     * @param {Color} color that this {@code FrameBuffer} pixel  at the given {@code (x, y)} coordinate should be set to
     */
    setPixelFB(x, y, color = Color.Black)
    {
        if (typeof x != "number" || typeof y != "number")
            throw new Error("X and Y must be Numerical");

        if (color instanceof Color == false)
            throw new Error("Color must be of type Color");

        x = Math.round(x);
        y = Math.round(y);

        const index = this.getWidthFB() * 4 * y + x * 4;

        if (index >= this.#pixelBuffer.length)
            throw new Error("FrameBuffer: Bad pixel coordinate " +
                            "(" + x + ", " + y + ") " +
                            "[w= " + this.getWidthFB() + ", h= " + this.getHeightFB() + "]");

        const rgba = color.rgb;
        this.#pixelBuffer[index + 0] = rgba[0];
        this.#pixelBuffer[index + 1] = rgba[1];
        this.#pixelBuffer[index + 2] = rgba[2];
        this.#pixelBuffer[index + 3] = rgba[3];
    }


    /**
     * Create a new {@code FrameBuffer} containing the pixel data from just the red plane of this {@code FrameBuffer}
     *
     * @returns {FrameBuffer} holding just the red pixel data from this {@code FrameBuffer}
     */
    convertRed2FB()
    {
        const newFB = FrameBuffer.buildFB(this);

        for (let x = 0; x < this.getWidthFB(); x += 1)
        {
            for (let y = 0; y < this.getHeightFB(); y += 1)
            {
                const origColor = this.getPixelFB(x, y);
                const  newColor  = new Color(origColor.getRed(), 0, 0);

                newFB.setPixelFB(x, y, newColor);
            }
        }

        return newFB;
    }


    /**
     * Create a new {@code FrameBuffer} containing the pixel data from just the green plane of this {@code FrameBuffer}
     *
     * @returns {FrameBuffer} holding just the green pixel data from this {@code FrameBuffer}
     */
    convertGreen2FB()
    {
        const newFB = FrameBuffer.buildFB(this);

        for (let x = 0; x < this.getWidthFB(); x += 1)
        {
            for (let y = 0; y < this.getHeightFB(); y += 1)
            {
                const origColor = this.getPixelFB(x, y);
                const newColor  = new Color(0, origColor.getGreen(), 0);

                newFB.setPixelFB(x, y, newColor);
            }
        }

        return newFB;
    }


    /**
     * Create a new {@code FrameBuffer} containing the pixel data from just the blue plane of this {@code FrameBuffer}
     *
     * @returns {FrameBuffer} holding just the blue pixel data from this {@code FrameBuffer}
     */
    convertBlue2FB()
    {
        const newFB = FrameBuffer.buildFB(this);

        for (let x = 0; x < this.getWidthFB(); x += 1)
        {
            for (let y = 0; y < this.getHeightFB(); y += 1)
            {
                const origColor = this.getPixelFB(x, y);
                const newColor  = new Color(0, 0, origColor.getBlue());

                newFB.setPixelFB(x, y, newColor);
            }
        }

        return newFB;
    }


    /**
      For debugging very small {@code FrameBuffer} objects.

      @return {string} a string representation of this {@code FrameBuffer}
   */
    toString()
    {
        let result = "FrameBuffer [w=" + this.width + ", h=" + this.height + "]\n";

        for (let j = 0; j < this.width; ++j)
        {
            result += " r   g   b |";
        }

        result += "\n";
        for (let i = 0; i < this.height; ++i)
        {
            for (let j = 0; j < this.width; j += 1)
            {
                const r = this.#pixelBuffer[((i*this.width) + j) ];
                const g = this.#pixelBuffer[((i*this.width) + j) ];
                const b = this.#pixelBuffer[((i*this.width) + j) ];
                const a = this.#pixelBuffer[((i*this.width) + j) ];
                
                const color = new Color(r, g, b, a);

                result += format("%3d ", color.getRed());
                result += format("%3d ", color.getGreen());
                result += format("%3d|", color.getBlue());
            }
            result += "\n";
        }

        return result;
    }


    /**
    Write this {@code FrameBuffer} to the specified PPM file.
    <p>
    <a href="https://en.wikipedia.org/wiki/Netpbm_format" target="_top">
            https://en.wikipedia.org/wiki/Netpbm_format</a>

    @param {string} filename  name of PPM image file to hold {@code FrameBuffer} data
    */
    dumpFB2File(filename)
    {
        if (typeof filename != "string")
            throw new Error("Filename must be a string");

        this.dumpPixels2File(0, 0, this.getWidthFB(), this.getHeightFB(), filename);
    }


    /**
    Write a rectangular sub array of pixels from this {@code FrameBuffer}
    to the specified PPM file.
    <p>
    <a href="https://en.wikipedia.org/wiki/Netpbm_format#PPM_example" target="_top">
            https://en.wikipedia.org/wiki/Netpbm_format#PPM_example</a>
    <p>
    <a href="http://stackoverflow.com/questions/2693631/read-ppm-file-and-store-it-in-an-array-coded-with-c" target="_top">
      http://stackoverflow.com/questions/2693631/read-ppm-file-and-store-it-in-an-array-coded-with-c</a>

    @param {number} upperLeftX      upper left hand x-coordinate of pixel data rectangle
    @param {number} upperLeftY      upper left hand y-coordinate of pixel data rectangle
    @param {number} lowerRightX      lower right hand x-coordinate of pixel data rectangle
    @param {number} lowerRightY      lower right hand y-coordinate of pixel data rectangle
    @param {string} filename  name of PPM image file to hold pixel data
    */
    dumpPixels2File(upperLeftX, upperLeftY, lowerRightX, lowerRightY, filename)
    {
        if ( typeof upperLeftX != "number" || typeof upperLeftY != "number" ||
            typeof lowerRightX != "number" || typeof lowerRightY != "number")
                throw new Error("upperLeftX, upperLeftY, lowerRightX, lowerRightY must be numerical");

        if (typeof filename != "string")
            throw new Error("Filename must be a String");

        let pWidth  = lowerRightX - upperLeftX;
        let pHeight = lowerRightY - upperLeftY;

        const format = "P6\n" + pWidth + " " + pHeight + "\n" + 255 + "\n"
        const colorData = new Uint8Array(pWidth * pHeight * 3);

        let index = 0;
        for(let y = upperLeftY; y < lowerRightY; y += 1)
        {
            for(let x = upperLeftX; x < lowerRightX; x += 1)
            {
                const rgba = this.getPixelFB(x, y).rgb;

                colorData[index+ 0] = rgba[0];
                colorData[index+ 1] = rgba[1];
                colorData[index+ 2] = rgba[2];
                index += 3;
            }
        }

        // Use dynamic import and then
        // use synchronous API to avoid file corruption.
        import('node:fs').then(fs => {
          fs.writeFileSync(filename, format, //@ts-ignore
                       err => {if (err) throw err;});
        });
        import('node:fs').then(fs => {
          fs.appendFileSync(filename, Buffer.from(colorData), //@ts-ignore
                       err => {if (err) throw err;});
        });
    }

    static main()
    {   
        // test the ofline ppm file building
        //const fb = await FrameBuffer.buildFile("../../assets/textures/brick2.ppm");
        //fb.dumpFB2File("output.ppm");

        /*
        let startTime = new Date().getTime();
        const fb = new FrameBuffer(600, 600, Color.black);
        let stopTime = new Date().getTime();

        console.log("FB make : " + (stopTime - startTime));

        for(let x = 0; x < 50; x += 1)
        {
            for(let y = 0; y < 50; y += 1)
                fb.setPixelFB(x, y, new Color(y * 5, y * 5, y*5));
        }

        fb.dumpFB2File("gray.ppm");
        */
       
        /*
        console.log("Making Framebuffer 1 = new FrameBuffer(10, 10)");
        const fb1 = new FrameBuffer(10, 10);

        console.log("");
        console.log("Making fb2 = FB.buildFB(fb1)");
        const fb2 = FrameBuffer.buildFB(fb1);

        console.log("");
        console.log("Making fb3 = FB.buildVP(new VP(3, 3, fb1, 0, 0, Color.blue))");
        const vp1 = new Viewport(3, 3, fb1, 0, 0, Color.magenta);
        const fb3 = FrameBuffer.buildVP(vp1);

        console.log("");
        console.log("fb1.getWidth(): ");
        console.log(fb1.getWidthFB());

        console.log("");
        console.log("fb1.getHeight()");
        console.log(fb1.getHeightFB());

        console.log("");
        console.log("fb2.width: ");
        console.log(fb2.width);

        console.log("");
        console.log("fb2.height");
        console.log(fb2.height);

        console.log("");
        console.log("fb3.getBAckgroundColor()");
        console.log(fb3.getBackgroundColorFB().toString());
        
        console.log("");
        console.log("fb3.bgColor");
        console.log(fb3.bgColorFB.toString());

        console.log("");
        console.log("fb2.setVP(2, 2, 1, 1)");
        fb2.setViewport(2, 2, 1, 1);
        console.log(fb2.toString());

        console.log("");
        console.log("fb2.getViewport()");
        console.log(fb2.getViewport().toString());

        console.log("");
        console.log("fb1.setViewportDefault()");
        fb1.setViewportDefault();
        console.log(fb1.toString());

        console.log("");
        console.log("fb1.getViewport()");
        console.log(fb1.getViewport().toString());

        console.log("");
        console.log("fb2.vp to see if fb2 feels fb1's viewport change since fb2 made from fb1");
        console.log(fb2.vp.toString());

        console.log("");
        console.log("fb2.setBackgroundColor(color.red)");
        fb2.setBackgroundColorFB(Color.red);
        console.log(fb2.toString());

        console.log("");
        console.log("fb2.clearFBDefault()");
        fb2.clearFBDefault();
        console.log(fb2.toString());

        console.log("");
        console.log("fb1.setPixel(9, 9, Color.yellow");
        fb1.setPixelFB(9, 9, Color.yellow);
        console.log(fb1.toString());

        console.log("");
        console.log("fb1.getPixel(9, 9)");
        console.log(fb1.getPixelFB(9, 9).toString());

        console.log("");
        console.log("fb1.dumpFB2File(FB1.ppm)");
        fb1.dumpFB2File("FB1.ppm");

        console.log("")
        console.log("fb2.dumpFB2File(fb2.ppm");
        fb2.dumpFB2File("FB2.ppm");

        console.log("");
        console.log('fb3.dumpfb2file(fb3.ppm)');
        fb3.dumpFB2File("FB3.ppm");

        console.log("");
        console.log("fb1.convertRed2FB().dumpfb2file(fb1-red.ppm");
        fb1.convertRed2FB().dumpFB2File("FB1-RED.ppm");

        console.log("");
        console.log("fb2.convertGreen2FB().dumpfb2file(fb2-green.ppm");
        fb2.convertGreen2FB().dumpFB2File("FB2-GREEN.ppm");

        console.log("");
        console.log("fb3.convertblue2FB().dumpfb2file(fb3-blue.ppm");
        fb3.convertBlue2FB().dumpFB2File("FB3-BLUE.ppm");
        */
    }
}