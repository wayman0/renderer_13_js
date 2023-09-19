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

    //    /**@type {Color[]} #pixelBuffer the actual pixel data for this framebuffer*/ #pixelBuffer;
    
    /**@type {Uint8Array} #pixelBuffer the actual pixel data for this framebuffer */ #pixelBuffer;

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
        //this.#pixelBuffer = new Array(this.#width * this.#height);

        // should this be a UInt8Array, or a new ArrayBuffer
        // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer
        // see: https://stackoverflow.com/questions/11025414/how-to-declare-an-array-of-byte-in-javascript
        
        this.#pixelBuffer = new Uint8Array(this.#width * this.#height * 4);
        
        //@ts-ignore
        // can ignore this error because fb2 and fb have the exact same methods
        // but due to my type checking cannot include this line
        //this.#vp = Viewport.buildParent(this);

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
    clearFB(color)
    {
        if (color instanceof Color == false)
            throw new Error("Color must be a Color");

        for (let x = 0; x < this.getWidthFB(); x += 1)
        {
            for (let y = 0; y < this.getHeightFB(); y += 1)
            {
                this.setPixelFB(x, y, color);
            }
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
      
        //const startPixelData = y*this.#width + x;
        const startPixelData = this.width * 4 * y + 4 * x;

        const r = this.#pixelBuffer[startPixelData + 0];
        const g = this.#pixelBuffer[startPixelData + 1];
        const b = this.#pixelBuffer[startPixelData + 2];
        const a = this.#pixelBuffer[startPixelData + 3];

        return new Color(r, g, b, a);
        //return this.#pixelBuffer[index];
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
        const c = Color.convert2Int(color);
      
        const r = c.getRed();
        const g = c.getGreen();
        const b = c.getBlue();
        const a = c.getAlpha();

        this.#pixelBuffer[index + 0] = r;
        this.#pixelBuffer[index + 1] = g;
        this.#pixelBuffer[index + 2] = b;
        this.#pixelBuffer[index + 3] = a;

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

                colorData[index+ 0] = col.getRed();
                colorData[index+ 1] = col.getGreen();
                colorData[index+ 2] = col.getBlue();
                index += 3;
            }
        }

        // Use dynamic import and then
        // use synchronous API to avoid file corruption.
        import('node:fs').then(fs => {
          fs.writeFileSync(filename, format,
                       err => {if (err) throw err;});
        });
        import('node:fs').then(fs => {
          fs.appendFileSync(filename, Buffer.from(colorData),
                       err => {if (err) throw err;});
        });
    }


    static main()
    {
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

        const fb = new FrameBuffer(1000, 1000, Color.CYAN);

        // notice that the set pixel output is correct
        fb.clearFBDefault();

        // but the pixelbuffer outputed is wrong, why?
        // because everytime we call setPixel(x, y), we don't
        // account for the offset of 4 so setPixel(1, 1)
        // and setPixel(2, 1) will interfere with eachother?
        
        //console.log(fb.pixelBuffer);

        /*
        for(let x = 0; x < fb.pixelBuffer.length; x += 4)
        {
            console.log(  fb.pixelBuffer[x + 0] + ", " 
                        + fb.pixelBuffer[x + 1] + ", "
                        + fb.pixelBuffer[x + 2] + ", "
                        + fb.pixelBuffer[x + 3]);
        }
        */
        //console.log(fb.toString());

        console.log(fb.getPixelFB(1, 1).toString());
        console.log(fb.getPixelFB(3, 2).toString());

        fb.dumpFB2File("CYANfb.ppm");
        //fb.convertBlue2FB().dumpFB2File("CYANFBconvertBlue.ppm");

    }
}
