/*
    FrameBuffer. The MIT License.
    Copyright (c) 2022 rlkraft@pnw.edu
    See LICENSE for details.
*/

//@ts-check
import {Viewport, Color} from "./FramebufferExport.js";
import {format} from "../../../renderer/scene/util/UtilExport.js";

export default class FrameBuffer
{
    /**@type {number} #width the width of a framebuffer*/ #width;
    /**@type {number} #height the height of this framebuffer*/ #height;
    /**@type {Color} #bgColorFB the default color of the framebuffer*/ #bgColorFB;
    /**@type {Viewport} #vp the viewport for this framebuffer */ #vp;

    //    /**@type {Color[]} #pixelBuffer the actual pixel data for this framebuffer*/ #pixelBuffer;
    
    /**@type {Uint8ClampedArray} #pixelBuffer the actual pixel data for this framebuffer */ #pixelBuffer;

    ///** #pixelBuffer the actual pixel data for this framebuffer stored as bytes*/ #pixelBuffer

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

        this.clearFB(this.#bgColorFB);
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

            //fb.pixelBuffer[fbIndex + 0] = r;
            //fb.pixelBuffer[fbIndex + 1] = g;
            //fb.pixelBuffer[fbIndex + 2] = b;
            //fb.pixelBuffer[fbIndex + 3] = a;
            
            fb.pixelBuffer.set([r, g, b, a], fbIndex);
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
     */
    setViewport(width, height, upperLeftX = 0, upperLeftY = 0)
    {
        if (typeof upperLeftX != "number" ||
            typeof upperLeftY != "number" ||
            typeof width      != "number" ||
            typeof height     != "number")
                throw new Error("All Parameters must be Numerical");

        this.#vp.setViewport(width, height, upperLeftX, upperLeftY);
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

        /*
        for (let x = 0; x < this.getWidthFB(); x += 1)
        {
            for (let y = 0; y < this.getHeightFB(); y += 1)
            {
                this.setPixelFB(x, y, color);
            }
        }
        */

        // this code should be 4 times faster than above double for loop
        // because instead of looping over every number in the pixelBuffer
        // we loop over every pixel in the pixelBuffer
        // so instead of looping over every single number
        // we acces every fourth number, the start of each pixel
        //for(let startPixel = 0; startPixel < this.#pixelBuffer.length; startPixel += 4)
        //{
        //    this.#pixelBuffer[startPixel + 0] = color.getRed();
        //    this.#pixelBuffer[startPixel + 1] = color.getGreen();
        //    this.#pixelBuffer[startPixel + 2] = color.getBlue();
        //    this.#pixelBuffer[startPixel + 3] = color.getAlpha();
        //}

        // see page 278 and 279 of the js book
        for(let startPixel = 0; startPixel < this.#pixelBuffer.length; startPixel += 4)
            this.#pixelBuffer.set(color.rgb, startPixel);
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
      
        //const startPixelData = y*this.#width + x;
        const startPixelData = this.width * 4 * y + 4 * x;

        //const r = this.#pixelBuffer[startPixelData + 0];
        //const g = this.#pixelBuffer[startPixelData + 1];
        //const b = this.#pixelBuffer[startPixelData + 2];
        //const a = this.#pixelBuffer[startPixelData + 3];

        //return new Color(r, g, b, a);
        //return this.#pixelBuffer[index];

        // see page 279 of the js book
        return Color.buildRGBA(this.#pixelBuffer.slice(startPixelData, startPixelData + 4));
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

        //const index = y * this.getWidthFB() + x; // wrong indexing
        //const index = y * this.getWidthFB() * 4 + x; // wrong indexing
        //const index = y * this.getWidthFB() * 4 + (x + 4); // wrong indexing
        //const index = y * this.getWidthFB() * 4 + (x + 3); // kinda right, skips alot pixels though
        //const index = y * this.getWidthFB() * 4;// kinda right skips a lot of pixels

        // to access row 3 pixel 0:
        // 3 * width * 4: each row is the width * 4, and we need three rows

        // to access row 3 pixel 1:
        // 3 * width * 4 + 1 * 4: each row is width * 4, three rows, and second pixel starts at 4, instead of 1

        const index = this.getWidthFB() * 4 * y + x * 4;

        if (index >= this.#pixelBuffer.length)
            throw new Error("FrameBuffer: Bad pixel coordinate " +
                            "(" + x + ", " + y + ") " +
                            "[w= " + this.getWidthFB() + ", h= " + this.getHeightFB() + "]");

        // see page 278 - 279 of the js book
        this.#pixelBuffer.set(color.rgb, index);
    /*
        see if the given color is supposed to be blended, if so then call blending function.

        Which blending function should be called?  blendColor uses the formula c1.alpha / (c1.alpha + c2.alpha)
        while blendColorWeight just uses c1Weight * c1 + (1-c1Weight) * c2

        Should I write a new function setPixelBlend(x, y, color, weight) that would implement this if statement?

        if (color.getAlpha() != 1 || color.getAlpha != 255)
            this.#pixelBuffer[index] = Color.blendColor(color, this.#pixelBuffer.getPixelFB(x, y));
            this.#pixelBuffer[index] = Color.blendColorWeight(color, this.#pixelBuffer.getPixelFB(x, y), color.getAlpha);
        else
            this.#pixelBuffer[index] = color;
    */
        //const c = Color.convert2Int(color);
      
        //const r = color.getRed();
        //const g = color.getGreen();
        //const b = color.getBlue();
        //const a = color.getAlpha();
//
        //this.#pixelBuffer[index + 0] = r;
        //this.#pixelBuffer[index + 1] = g;
        //this.#pixelBuffer[index + 2] = b;
        //this.#pixelBuffer[index + 3] = a;

        // this seems to properly input the colors into the pixelbuffer
        // but when the pixel buffer is printed out it is wrong
        // becase we were improperly indexing into the pixelBuffer
        //console.log("index: " + index + " x: " + x + " y: " + y + " " + color.toString());
        //console.log(  this.#pixelBuffer[index + 0] + ", " 
        //            + this.#pixelBuffer[index + 1] + ", "
        //            + this.#pixelBuffer[index + 2] + ", "
        //            + this.#pixelBuffer[index + 3]);
       
        
        //this.#pixelBuffer[index] = Color.convert2Int(color);
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

        /*
        let result = "FrameBuffer [w = " + this.getWidthFB() + ", h = " + this.getHeightFB() + "]\n";

        for(let y = 0; y < this.getHeightFB(); ++y)
        {
            for (let x = 0; x < this.getWidthFB(); ++x)
            {
                const color = this.getPixelFB(x, y);
                result += color.getRed() + " " + color.getGreen() + " " + color.getBlue() + " " + color.getAlpha() + " | ";
            }
            result += "\n";
        }
        */
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
                const col = this.getPixelFB(x, y);
                
                // see page 278 - 279 of the js book
                colorData.set(col.rgb.slice(0, 3), index);

                //colorData[index+ 0] = col.getRed();
                //colorData[index+ 1] = col.getGreen();
                //colorData[index+ 2] = col.getBlue();
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

// if you run this code with the new vs old color implmentation
// the old color implementation is a lot faster then the new implementation
//let startTime = new Date().getTime();
//let fb1 = await FrameBuffer.buildFile("../../assets/textures/brick2.ppm");
//let stopTime = new Date().getTime();
//console.log("read file: " + (stopTime - startTime));
//
//startTime = new Date().getTime();
//fb1.dumpFB2File("brick.ppm");
//stopTime = new Date().getTime();
//console.log("write file: " + (stopTime - startTime));
//
//startTime = new Date().getTime();
//const fb2 = new FrameBuffer(600, 600, Color.black);
//stopTime = new Date().getTime();
//console.log("FB make : " + (stopTime - startTime));

// failed attempts at reading the ppm file byte by byte instead of at once
/*
const underlyingSource = nodefs.createReadStream(ppmFile);
const byteStream = new ReadableStream(
                                { 
                                    start(controller) {this.pull; console.log("It called start controller " + controller);},
                                    pull(controller) {console.log("It called pull controller");}, 
                                    type:"bytes", 
                                    autoAllocateChunkSize:3
                                });
*/
/*
nodefs.open(ppmFile, 'r', function (status, fd) 
                        {
                            const buff = Buffer.alloc(3);

                            nodefs.read(fd, buff, 0, 3, 0, function(err, num)
                                                        {
                                                            if(err)
                                                                console.log(err);

                                                            console.log(buff.toString());
                                                        })
                        });
*/
/*
nodefs.open(ppmFile, 'r', function(err, fd) 
            {
                if (err)
                  throw err;

                var buffer = Buffer.alloc(3);

                while (true)
                {   
                  var num = nodefs.readSync(fd, buffer, 0, 3, null);
                  if (num === 0)
                    break;
                  console.log('byte read', buffer[0] + ", " + buffer[1] + ", " + buffer[2]);
                }
            });
*/
/*
nodefs.open(ppmFile, 'r', 
    function(error, fileDesc)
    {
        // make a 1 byte buffer
        let byte = Buffer.alloc(1);

        // record the number of lines read so we know when we reach the pixel data
        let linesRead = 0;

        // create the variable to handle the p6 line
        let p6Str = "";

        // create the variables to handle the dimension line
        let hitDimSpace = false;
        let widthStr = "";
        let heightStr = "";
        // create the varaibles to handle the max rgb value
        let maxValStr = "";

        // create a variable to store where in the pixel buffer we are
        let fbIndex = 0;

        // create a variable to store if the bytes we are reading are a part of a comment
        let inComment = false;
        let readComment = false;


        let eof = 1;
        while(eof)
        {
            // since 0 can be interpreted as a boolean, can use 0 bytes read to mark eof or an err.
            eof = nodefs.readSync(fileDesc, byte);
        
            // convert the given byte into a string
            const charRead = String.fromCharCode(byte[0]);
        
            // if the byte is a '#' then this line is a comment
            // should only have one #
            if(charRead == "#" && !readComment)
                inComment = true;

            // if we are in a comment line and reach the new line char we are no longer in the comment line
            if(inComment)
            {   
                readComment = true;

        console.log("in comment " + charRead + " " + byte[0]);
                
                if(charRead == "\n" || byte[0] == 13)
                    inComment = false;

        console.log(inComment);
            }
            else // not inComment
            {
                // if we haven't read any lines then we have to check for the magic p6 
                if(linesRead == 0)
                {
                    // if we have hit the new line char then we have read the p6 line
                    // or if we have hit a carriage return
                    if(charRead == "\n" || byte[0] == 13)
                    {
                        linesRead += 1;
                        if(p6Str != "P6")
                            throw new Error("File does not contain the magic P6");
                    }   
                    else
                        p6Str += charRead// keep concatenating each byte to accumulate the p6 str
                }
                else if(linesRead == 1)// the next nonComment line should be the dimensions
                {
        console.log(charRead);
                    // see if we have read a whitespace character
                    if(charRead == " " || charRead == "\t" || (!hitDimSpace && charRead == "\n"))
                        hitDimSpace = true;

                    if(!hitDimSpace)
                        widthStr += charRead;
                    else
                        if(charRead != " " && charRead != "\t" && charRead != '\n')
                            heightStr += charRead;

                    // if we have read past the first dimension then
                    // the next newLine represents an actual new line
                    // create the framebuffer from the dimensions read
                    if(hitDimSpace && charRead == "\n")
                    {    
                        linesRead += 1;
                        // create the frameBuffer from the dimensions read in the previous line
                        fb = new FrameBuffer(+widthStr, +heightStr);
                        arr = new Uint8Array(+widthStr * +heightStr * 4);
            //console.log(widthStr);
            //console.log(heightStr);
                    }
            //console.log(linesRead);
                }
                else if(linesRead == 2)//the next line should be the max rgb value
                {
            console.log(charRead);
                    if(charRead != "\n")
                        maxValStr += charRead;
                    else
                        linesRead += 1;
            console.log(maxValStr);
                }
                else if(linesRead > 2)// the rest of the values should be the byte pixel data
                {
                    
                    // create a buffer to hold three bytes for the r, g, b, values
                    let pixelBytes = Buffer.alloc(3);

                    // read the pixel bytes from the file
                    eof = nodefs.readSync(fileDesc, pixelBytes);

                    // extract each r, g, b, byte
                    let r = pixelBytes[0];
                    let g = pixelBytes[1];
                    let b = pixelBytes[2];

                    // convert from unsigned to signed
                    if(r < 0) r += 256;
                    if(g < 0) g += 256;
                    if(b < 0) b += 256;

                    // write the rgb and 255 alpha value into the fb
                    fb.pixelBuffer[fbIndex + 0] = r;
                    fb.pixelBuffer[fbIndex + 1] = g;
                    fb.pixelBuffer[fbIndex + 2] = b;
                    fb.pixelBuffer[fbIndex + 3] = 255;

                    // record that we are 4 more bytes into the pixel buffer
                    fbIndex += 4;
                    
                    
                    // set the unknown pixel value to be the byte
                    let val = byte[0] < 0 ? byte[0] + 256 : byte[0];

                    // write the unknown rgb value into the fb
                    fb.pixelBuffer.set(new Uint8Array([val]), fbIndex);
            
        //console.log(fb.pixelBuffer.length);

                    arr[fbIndex] = val;
                    fbIndex += 1;

        //console.log(val);
        //console.log(fb.pixelBuffer[fbIndex]);
        //console.log(arr[fbIndex]);
        //console.log(fbIndex);

                    // if we have written 3 rgb values the next is the alpha value 
                    if(fbIndex %4 == 0)
                        arr[++fbIndex] = 255;//fb.pixelBuffer[++fbIndex] = 255;
        //console.log();
                }
            }  
        }

        //return fb;
    });
*/
/*
console.log(fb.pixelBuffer);

console.log(fb.pixelBuffer.length);
console.log(fb.getPixelBuffer().length);
for(let x = 0; x < fb.pixelBuffer.length; x += 3)
    console.log(fb.pixelBuffer[x] + " " + fb.pixelBuffer[x+1] + " " + fb.pixelBuffer[x+2]);
fb.dumpFB2File("output2.ppm");
*/
/*
const nodefs = await import("node:fs");
let fb = new FrameBuffer(0, 0);
nodefs.open(ppmFile, 'r', 
function(error, fileDesc)
{
    // make a 1 byte buffer
    let byte = Buffer.alloc(1);
        
    // record the number of lines read so we know when we reach the pixel data
    let linesRead = 0;
        
    // create the variable to handle the p6 line
    let p6Str = "";
        
    // create the variables to handle the dimension line
    let hitDimSpace = false;
    let widthStr = "";
    let heightStr = "";
    // create the varaibles to handle the max rgb value
    let maxValStr = "";
        
    // create a variable to store where in the pixel buffer we are
    let fbIndex = 0;
        
    // create a variable to store if the bytes we are reading are a part of a comment
    let inComment = false;
    let readComment = false;
        
        
    let eof = 1;
    while(eof)
    {
        // since 0 can be interpreted as a boolean, can use 0 bytes read to mark eof or an err.
        eof = nodefs.readSync(fileDesc, byte);
    
        // convert the given byte into a string
        const charRead = String.fromCharCode(byte[0]);
    
        // if the byte is a '#' then this line is a comment
        // should only have one #
        if(charRead == "#" && !readComment)
            inComment = true;
    
        // if we are in a comment line and reach the new line char we are no longer in the comment line
        if(inComment)
        {   
            readComment = true;
        
    //console.log("in comment " + charRead + " " + byte[0]);
        
            if(charRead == "\n" || byte[0] == 13)
                inComment = false;
        
    //console.log(inComment);
        }
        else // not inComment
        {
            // if we haven't read any lines then we have to check for the magic p6 
            if(linesRead == 0)
            {
                // if we have hit the new line char then we have read the p6 line
                // or if we have hit a carriage return
                if(charRead == "\n" || byte[0] == 13)
                {
                    linesRead += 1;
                    if(p6Str != "P6")
                        throw new Error("File does not contain the magic P6");
                }   
                else
                    p6Str += charRead// keep concatenating each byte to accumulate the p6 str
            }
            else if(linesRead == 1)// the next nonComment line should be the dimensions
            {
    //console.log(charRead);
                // see if we have read a whitespace character
                if(charRead == " " || charRead == "\t" || (!hitDimSpace && charRead == "\n"))
                    hitDimSpace = true;
            
                if(!hitDimSpace)
                    widthStr += charRead;
                else
                    if(charRead != " " && charRead != "\t" && charRead != '\n')
                        heightStr += charRead;
            
                // if we have read past the first dimension then
                // the next newLine represents an actual new line
                // create the framebuffer from the dimensions read
                if(hitDimSpace && charRead == "\n")
                {    
                    linesRead += 1;
                    // create the frameBuffer from the dimensions read in the previous line
                    fb = new FrameBuffer(+widthStr, +heightStr);
        console.log(widthStr);
        console.log(heightStr);
        //console.log(fb.toString());
                }
        //console.log(linesRead);
            }
            else if(linesRead == 2)//the next line should be the max rgb value
            {
        //console.log(charRead);
                if(charRead != "\n")
                    maxValStr += charRead;
                else
                    linesRead += 1;
        //console.log(maxValStr);
            }
            else if(linesRead > 2)// the rest of the values should be the byte pixel data
            {
                // create a buffer to hold three bytes for the r, g, b, values
                let pixelBytes = Buffer.alloc(3);
                // read the pixel bytes from the file
                eof = nodefs.readSync(fileDesc, pixelBytes);
                // extract each r, g, b, byte
                let r = pixelBytes[0];
                let g = pixelBytes[1];
                let b = pixelBytes[2];
                // convert from unsigned to signed
                if(r < 0) r += 256;
                if(g < 0) g += 256;
                if(b < 0) b += 256;
                // write the rgb and 255 alpha value into the fb
                fb.pixelBuffer[fbIndex + 0] = r;
                fb.pixelBuffer[fbIndex + 1] = g;
                fb.pixelBuffer[fbIndex + 2] = b;
                fb.pixelBuffer[fbIndex + 3] = 255;
                // record that we are 4 more bytes into the pixel buffer
                fbIndex += 4;
                
                // set the unknown pixel value to be the byte
                let val = byte[0] < 0 ? byte[0] + 256 : byte[0];
                // write the unknown rgb value into the fb
                fb.pixelBuffer.set(new Uint8Array([val]), fbIndex);
//console.log(fb.pixelBuffer.length);
                fbIndex += 1;
//console.log(val);
//console.log(fb.pixelBuffer[fbIndex]);
//console.log(arr[fbIndex]);
//console.log(fbIndex);
                // if we have written 3 rgb values the next is the alpha value 
                if(fbIndex %4 == 0)
                    fb.pixelBuffer[++fbIndex] = 255;
//console.log();
            
            }
        }  
    }
    return fb;
}
);

return await fb;
*/
/*
import("node:fs").then(
    fs => fs.open(ppmFile, 'r', 
            function(error, fileDesc)
            {
                console.log("entered funciont");
                // make a 1 byte buffer
                let byte = Buffer.alloc(1);
            
                // record the number of lines read so we know when we reach the pixel data
                let linesRead = 0;
            
                // create the variable to handle the p6 line
                let p6Str = "";
            
                // create the variables to handle the dimension line
                let hitDimSpace = false;
                let widthStr = "";
                let heightStr = "";
                // create the varaibles to handle the max rgb value
                let maxValStr = "";
            
                // create a variable to store where in the pixel buffer we are
                let fbIndex = 0;
            
                // create a variable to store if the bytes we are reading are a part of a comment
                let inComment = false;
                let readComment = false;
            
            
                let eof = 1;
                while(eof)
                {
                    // since 0 can be interpreted as a boolean, can use 0 bytes read to mark eof or an err.
                    eof = fs.readSync(fileDesc, byte);
                
                    // convert the given byte into a string
                    const charRead = String.fromCharCode(byte[0]);
                
                    // if the byte is a '#' then this line is a comment
                    // should only have one #
                    if(charRead == "#" && !readComment)
                        inComment = true;
                
                    // if we are in a comment line and reach the new line char we are no longer in the comment line
                    if(inComment)
                    {   
                        readComment = true;
                    
                //console.log("in comment " + charRead + " " + byte[0]);
                    
                        if(charRead == "\n" || byte[0] == 13)
                            inComment = false;
                    
                //console.log(inComment);
                    }
                    else // not inComment
                    {
                        // if we haven't read any lines then we have to check for the magic p6 
                        if(linesRead == 0)
                        {
                            // if we have hit the new line char then we have read the p6 line
                            // or if we have hit a carriage return
                            if(charRead == "\n" || byte[0] == 13)
                            {
                                linesRead += 1;
                                if(p6Str != "P6")
                                    throw new Error("File does not contain the magic P6");
                            }   
                            else
                                p6Str += charRead// keep concatenating each byte to accumulate the p6 str
                        }
                        else if(linesRead == 1)// the next nonComment line should be the dimensions
                        {
                //console.log(charRead);
                            // see if we have read a whitespace character
                            if(charRead == " " || charRead == "\t" || (!hitDimSpace && charRead == "\n"))
                                hitDimSpace = true;
                        
                            if(!hitDimSpace)
                                widthStr += charRead;
                            else
                                if(charRead != " " && charRead != "\t" && charRead != '\n')
                                    heightStr += charRead;
                        
                            // if we have read past the first dimension then
                            // the next newLine represents an actual new line
                            // create the framebuffer from the dimensions read
                            if(hitDimSpace && charRead == "\n")
                            {    
                                linesRead += 1;
                                // create the frameBuffer from the dimensions read in the previous line
                                fb = new FrameBuffer(+widthStr, +heightStr);
                    console.log(widthStr);
                    console.log(heightStr);
                    //console.log(fb.toString());
                            }
                    //console.log(linesRead);
                        }
                        else if(linesRead == 2)//the next line should be the max rgb value
                        {
                    //console.log(charRead);
                            if(charRead != "\n")
                                maxValStr += charRead;
                            else
                                linesRead += 1;
                    //console.log(maxValStr);
                        }
                        else if(linesRead > 2)// the rest of the values should be the byte pixel data
                    {
                        // create a buffer to hold three bytes for the r, g, b, values
                        let pixelBytes = Buffer.alloc(3);
                    
                        // read the pixel bytes from the file
                        eof = fs.readSync(fileDesc, pixelBytes);
                    
                        // extract each r, g, b, byte
                        let r = pixelBytes[0];
                        let g = pixelBytes[1];
                        let b = pixelBytes[2];
                    
                        // convert from unsigned to signed
                        if(r < 0) r += 256;
                        if(g < 0) g += 256;
                        if(b < 0) b += 256;
                    
                        // write the rgb and 255 alpha value into the fb
                        fb.pixelBuffer[fbIndex + 0] = r;
                        fb.pixelBuffer[fbIndex + 1] = g;
                        fb.pixelBuffer[fbIndex + 2] = b;
                        fb.pixelBuffer[fbIndex + 3] = 255;
                    
                        // record that we are 4 more bytes into the pixel buffer
                        fbIndex += 4;
                        
                    
                        
                        // set the unknown pixel value to be the byte
                        let val = byte[0] < 0 ? byte[0] + 256 : byte[0];
                    
                        // write the unknown rgb value into the fb
                        fb.pixelBuffer.set(new Uint8Array([val]), fbIndex);
                    
            //console.log(fb.pixelBuffer.length);
                    
                        fbIndex += 1;
                    
            //console.log(val);
            //console.log(fb.pixelBuffer[fbIndex]);
            //console.log(arr[fbIndex]);
            //console.log(fbIndex);
                    
                        // if we have written 3 rgb values the next is the alpha value 
                        if(fbIndex %4 == 0)
                            fb.pixelBuffer[++fbIndex] = 255;
            //console.log();
                        
                        }
                    }  
                }
            
                //return fb;
            }));
    */
/*
        const nodefs = await import("node:fs");
        const nodeReadLine = await import("node:readline");

        const inputStream = nodefs.createReadStream(fileName);
        const readLine = nodeReadLine.createInterface(
                                        {
                                            input: inputStream,
                                            crlfDelay: Infinity
                                        });
        
        let fb = new FrameBuffer(0, 0);
        const a = 255;

        // record the number of lines read so we know when we reach the pixel data
        let linesRead = 0;
        // record where in the framebuffer we are
        let fbIndex = 0;
        // record whether a value is 1 or 2 bytes based upon the maxVal color
        let numBytesPerPixel = 0;
        // record any caryover bytes from each line 
        let caryOver = new Array();

    let sumLine = 0;
        for await(const line of readLine)
        {
            if(!line.startsWith("#"))// if the line isn't a comment
            {
                if(linesRead == 0)// first noncomment line, saying it is a p6 file
                {
                    if(!line.startsWith("P6"))
                        throw new Error("File doesn't contain the P6 needed");
                    else 
                        linesRead += 1;
                }
                else if(linesRead == 1) // second non comment line containing the dimensions
                {
                    const dim = line.split(" ");
                    const width  = +dim[0];
                    const height = +dim[1];

                    fb = new FrameBuffer(width, height);
                    linesRead += 1;
                }
                else if(linesRead == 2)// third noncomment line saying maxVal for a color's r, g, or b value
                {
                    if(+line < 256 && +line > 0) // maximum 1 byte value
                        numBytesPerPixel = 1;
                    else if(+line < 65536 && +line >= 256) // maximum 2 byte value
                        numBytesPerPixel = 2;
                    else // error should only be 1 or 2 bytes
                    {    
                        console.log(line);
                        throw new Error("maxVal should be either 1 or 2 bytes");
                    }

                    linesRead += 1;
                }
                else if(linesRead >= 3)// fourth noncomment line and on for the actual rgb bytes
                {
                    // because the line ends in an a value that doesn't have a char code
                //console.log(line.charCodeAt(line.length));
                    // this causes the last byte to not have a value
                    // so we have to discard the last char in the line
                    // before we create the bytes
                    const byteLine = line.substring(0, line.length-1);
                    
                    // since javascript strings are 16 bits shift right 8 bits
                    const bytes = Uint8Array.from(byteLine, (c) => c.charCodeAt(0)>>8)

                    // record any caryover incase the line isn't divisible by three
                    let caryOver = new Array();
                    //record where in the fb we are at
                    let fbIndex = 0; 
                    
                    // handle any caryover since a line may not be a complete set of r, g, b's
                    let caryOverIndex = 0;
                    while(caryOverIndex < caryOver.length)
                    {
                        let val = caryOver[caryOverIndex];
                        if(val < 0) val += 256;
                    
                        // see if we are at the alpha value in the framebuffer
                        if(fbIndex %4 == 0)
                        {
                            fb.#pixelBuffer[fbIndex] = a;
                            fbIndex += 1;
                        }
                    
                        fb.#pixelBuffer[fbIndex] = val;

                        caryOverIndex += 1;
                        fbIndex += 1;
                    }
                    

                    let byteIndex = 0;
                    // loop over the bytes in this line, increment by three since we need r, g, b
                    for(; byteIndex < bytes.length; byteIndex += 3)
                    {
                        let r = bytes[byteIndex + 0];
                        let g = bytes[byteIndex + 1];
                        let b = bytes[byteIndex + 2];

                        if(r < 0) r += 256; 
                        if(g < 0) g += 256; 
                        if(b < 0) b += 256; 

                        fb.#pixelBuffer[fbIndex + 0] = r;
                        fb.#pixelBuffer[fbIndex + 1] = g;
                        fb.#pixelBuffer[fbIndex + 2] = b;
                        fb.#pixelBuffer[fbIndex + 3] = a;

                        fbIndex += 4;
                    }
                    
                    // record the caryover
                    if(byteIndex != bytes.length)
                        caryOver = new Array(bytes.slice(byteIndex));
                    else // no caryover so reset the array.
                        caryOver.length = 0;
                    
                    linesRead +=1;
                }
            }

        }

        // why is the number of lines read 141, shouldn't the ppm raster be free of any whitespace?
        console.log("Number of lines read in the ppm raster: " + linesRead)// 141
        // why isn't the number of bytes read = width * height * 3 = 512 * 512 * 3 = 786432, how am I mising so many bytes
        console.log("Number of bytes read in the ppm raster :" + sumLine);// 748258
        return fb;
*/