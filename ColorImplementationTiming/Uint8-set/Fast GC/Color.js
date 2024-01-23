/*
    FrameBuffer. The MIT License.
    Copyright (c) 2022 rlkraft@pnw.edu
    See LICENSE for details.
*/

/**
 * An {@code Color} is a way of storing the red, green, blue, and alpha data
 * about a color object.  It is supposed to mimic Java's Color class.
 */

//@ts-check
import {format} from "../../../renderer/scene/util/UtilExport.js";

export default class Color
{
    /**@type {Uint8ClampedArray} #rgb the rgba array for this color*/#rgb = new Uint8ClampedArray(4);

    static GAMMA = 1/2.2;

    static black = new Color();
    static BLACK = new Color();
    static Black = new Color();

    static white = new Color(255, 255, 255);
    static WHITE = new Color(255, 255, 255);
    static White = new Color(255, 255, 255);

    static red = new Color(255, 0, 0);
    static RED = new Color(255, 0, 0);
    static Red = new Color(255, 0, 0);

    static green = new Color(0, 255, 0);
    static GREEN = new Color(0, 255, 0);
    static Green = new Color(0, 255, 0);

    static blue = new Color(0, 0, 255);
    static BLUE = new Color(0, 0, 255);
    static Blue = new Color(0, 0, 255);

    static orange = new Color(255, 127, 0);
    static ORANGE = new Color(255, 127, 0);
    static Orange = new Color(255, 127, 0);

    static yellow = new Color(255, 255, 0);
    static YELLOW = new Color(255, 255, 0);
    static Yellow = new Color(255, 255, 0);

    static pink = new Color(255, 192, 203,);
    static PINK = new Color(255, 192, 203,);
    static Pink = new Color(255, 192, 203,);

    static cyan = new Color(0, 255, 255);
    static CYAN = new Color(0, 255, 255);
    static Cyan = new Color(0, 255, 255);

    static magenta = new Color(255, 0, 255);
    static MAGENTA = new Color(255, 0, 255);
    static Magenta = new Color(255, 0, 255);

    static gray = new Color(192, 192, 192);
    static GRAY = new Color(192, 192, 192);
    static Gray = new Color(192, 192, 192);

    /**
     * Creates a new {@code Color} with the specified red, green, blue, and alpha values given.
     * Will check to make sure that the given values are within range
     * By default alpha is set to 255 
     * uses Math.round() on r, g, b
     *
     * @param {number} r the red value of the {@code Color}
     * @param {number} g the green value of the {@code Color}
     * @param {number} b the blue value of the {@code Color}
     * @param {number} a the alpha value of the {@code Color}
     */
    constructor(r = 0, g = 0, b = 0, a = 255)
    {
        if (typeof r != "number" ||
            typeof g != "number" ||
            typeof b != "number" ||
            typeof a != "number")
                throw new Error("All parameters must be numeric");

        if (! (r >= 0 && r <= 255) ||
            ! (g >= 0 && g <= 255) ||
            ! (b >= 0 && b <= 255) ||
            ! (a >= 0 && a <= 255))
               throw new Error("Int data must be between 0 and 255 inclusive");

        r = Math.round(r);
        g = Math.round(g);
        b = Math.round(b);
        a = Math.round(a);

        this.#rgb[0] = r;
        this.#rgb[1] = g;
        this.#rgb[2] = b;
        this.#rgb[3] = a;
    }


    /**
     * Creates a new color using the rgba data of the given color
     *
     * @param {Color}  color the color whose data is to be used to create the new {@code Color}
     * @returns {Color} a new {@code Color} that is a deep copy of the color passed.
     */
    static buildColor(color)
    {
        if (color instanceof Color == false)
            throw new Error("color is not of type Color");

        return new Color(color.getRed(),
                         color.getGreen(),
                         color.getBlue(),
                         color.getAlpha());
    }

    /**
     * Create a color object from an rgba uint8clamped array.
     * @param {Uint8ClampedArray} rgba the rgba array to be used 
     * @returns {Color} the new color created with the given rgba data
     */
    static buildRGBA(rgba)
    {
        if(rgba instanceof Uint8ClampedArray == false)
            throw new Error("RGBA needs to be a uint8clamped array");

        const col = new Color();
        col.#rgb = rgba;
        
        return col;
    }

    /**
     * Creates a new color that is the same rgb values but not the alpha value of the color passed.
     * Insteads uses the passed alpha.  This function is supposed to create a 'stronger' or 'weaker' duplicate color.
     * NOTE: this function is NON MUTATING
     *
     * @param {Color} color the rgb values to be used in the color being created
     * @param {number} alpha the alpha value for the color to be created
     * @returns {Color} the 'stronger' or 'weaker' duplicate color
     */
    static buildAlpha(color, alpha)
    {
        if (color instanceof Color == false)
            throw new Error("Color is not of type Color");

        if (typeof alpha != "number")
            throw new Error("Alpha is not numerical");

        return new Color(color.getRed(),
                         color.getGreen(),
                         color.getBlue(),
                         alpha);
    }


    /**
     * Creates a new color that is the weighted average of the two colors using the ratio between their Alphas.
     * formula: c1.alpha/(c1.alpha + c2.alpha)
     * this function is NON MUTATING
     * NOTE: returns a float color with alpha of 1
     *
     * @param {Color} c1 the first color to be blended with
     * @param {Color} c2 the second color to be blended with
     * @returns the new float representation of the blended colors with an alpha of 1
     */
    static blendColor(c1, c2)
    {
        return Color.blendColorWeight(c1, c2, c1.getAlpha()/(c1.getAlpha() + c2.getAlpha()));
    }


    /**
     * Creates a new color that is the weighted average of
     * the two colors using the given c1Weight, the weight
     * of the first color.  c1Weight has the default value of 1/2
     * Uses the equation: c1Weight * c1 + (1-c1Weight) * c2;
     * this function is NON MUTATING
     * NOTE: returns a color with alpha of 255
     *
     * @param {Color} c1 the first color to be blended with
     * @param {Color} c2 the second color to be blended with
     * @param {number} c1Weight the weight of the first color, must be in the range [0, 1]
     * @returns {Color} the new float representation of the passed color
     */
    static blendColorWeight(c1, c2, c1Weight = .5)
    {
        if (c1 instanceof Color == false || c2 instanceof Color == false)
            throw new Error("C1 and C2 are not of type color");

        if (typeof c1Weight != "number")
            throw new Error("c1Weight is not numerical");

        if (! (c1Weight >= 0 && c1Weight <= 1))
            throw new Error("c1Weight has to be in the range 0 to 1 inclusive");

        const newR = c1Weight * c1.getRed()   + (1-c1Weight) * c2.getRed();
        const newG = c1Weight * c1.getGreen() + (1-c1Weight) * c2.getGreen();
        const newB = c1Weight * c1.getBlue()  + (1-c1Weight) * c2.getBlue();

        return new Color(newR, newG, newB, 255);
    }


    /**
     * Creates a new {@code Color} that is the float representation of the passed color.
     * NOTE: this function is NON MUTATING.  If you want to mutate the color call {@code mutate2Float()}
     *
     * @param {Color} color the color whose data is to be used to create the new color
     * @returns {Color} the new float representation of the color passed
     */
    /*
    static convert2Float(color)
    {
        if (color instanceof Color == false)
            throw new Error("Color is not of type Color");

        if (color.isFloat())
        {
            return Color.buildColor(color);
        }

        return (new Color(color.getRed()/255,
                          color.getGreen()/255,
                          color.getBlue()/255,
                          color.getAlpha()/255,
                          true));
    }
    */

    /**
     * Creates a new {@code Color} that is the integer representation of the passed Color.
     * NOTE: this function is NON MUTATING.  If you want to mutate the color call {@code mutate2Int()}
     *
     * @param {Color} color the color whose data is to be used to make the new {@code Color}
     * @returns {Color} the new int representation of the color passed.
     */
    /*
    static convert2Int(color)
    {
        if (color instanceof Color == false)
            throw new Error("Color is not of type Color");

        if (color.isFloat() == false)
        {
            return Color.buildColor(color);
        }

        return (new Color(color.getRed() * 255,
                          color.getGreen() * 255,
                          color.getBlue() * 255,
                          color.getAlpha() * 255,
                          false));
    }
    */

    /**
     * MUTATE the calling {@code Color} object to be the float representation of itself.
     * @param {Color} c the color to be mutated into a float
     * @returns {Color} the MUTATED calling color represented as a float for method chaining
     */
    /*
    static mutate2Float(c)
    {
        if (c instanceof Color == false)
            throw new Error("c is not a color");

        if (c.isFloat() == false)
        {
            c = new Color(c.getRed()/255,
                          c.getGreen()/255,
                          c.getBlue()/255,
                          c.getAlpha()/255,
                          true);
        }

        return c;
    }
    */

    /**
     * MUTATE the calling {@code Color} object to be the int representation of itself.
     * @param {Color} c the color to be mutated
     * @returns {Color} the mutated color for method chaining
     */
    /*
    static mutate2Int(c)
    {
        if (c instanceof Color == false)
            throw new Error("c is not a color");

        if (c.isFloat())
        {
            c = new Color(c.getRed() * 255,
                          c.getGreen() * 255,
                          c.getBlue() * 255,
                          c.getAlpha() * 255,
                          false);
        }

        return c;
    }
    */


    /**
     * Get the red value of the color
     * @returns {number} the red value of the color
     */
    getRed()
    {
        return this.#rgb[0];
    }

    /**
     * Get the green value of the color
     * @returns {number} the green value of the color
     */
    getGreen()
    {
        return this.#rgb[1];
    }

    /**
     * Get the blue value of the color
     * @returns {number} the blue value of the color
     */
    getBlue()
    {
        return this.#rgb[2];
    }

    /**
     * Get the alpha value of the color
     * @returns {number} the alpha value of the color
     */
    getAlpha()
    {
        return this.#rgb[3];
    }


    /**
     * Change the alpha value of this color
     * @param {number} a the new alpha value for this color
     */
    setAlpha(a)
    {
        if(typeof a != "number")
            throw new Error("a is not numerical");

        if(a < 0 || a > 255)
            throw new Error("a is supposed to be between 0 and 255 inclusive");

        this.#rgb[3] = Math.round(a);
    }


    /**
     * Get the r, g, b, and alpha values in an array
     * @returns {Uint8ClampedArray} the rgba array for this color
     */
    getRGBComponents()
    {
        return this.#rgb;
    }

    get rgb()
    {
        return this.#rgb;
    }

    /**
     * For debugging.
     * @returns {string} a string representation of this color
     */
    toString()
    {
        return (format("(r, g, b): (%3d, %3d, %3d)", this.#rgb[0], this.#rgb[1], this.#rgb[2]));
    }


    /**
     * For testing.
     */
    static main()
    {
        /*
        console.log("Making color1 = new Color(0, 0, 0, 100)");
        let color1 = new Color(0, 0, 0, 100);
        console.log(color1.toString());

        console.log("Making color2 = new Color(1, 1, 1, 1, true)");
        let color2 = new Color(1, 1, 1, 1, true);
        console.log(color2.toString());

        console.log("Making color3 = Color.buildAlpha(color1, 255)");
        let color3 = Color.buildAlpha(color1, 255);
        console.log(color3.toString());

        console.log("Making color4 = Color.buildColor(color2)");
        let color4 = Color.buildColor(color2);
        console.log(color4.toString());

        console.log("Making color5 = Color.blendColor(color2, color3)");
        let color5 = Color.blendColor(color2, color3);
        console.log(color5.toString());

        console.log("Making color6 = Color.blendColorWeight(color3, .9)");
        let color6 = Color.blendColorWeight(color2, color3, .9);
        console.log(color6.toString());

        console.log("Making color7 = Color.convert2Int(color2)");
        let color7 = Color.convert2Int(color2);
        console.log(color7.toString());

        console.log("Making color8 = Color.convert2Float(color3)");
        let color8 = Color.convert2Float(color3);
        console.log(color8.toString());

        console.log("Checking color2.isFloat()");
        console.log(color2.isFloat());

        console.log("Mutating color2 to be an int");
        Color.mutate2Int(color2);
        console.log(color2.toString());

        console.log("Calling color2.isFloat()");
        console.log(color2.isFloat());

        console.log("calling color3.isFloat()");
        console.log(color3.isFloat());

        console.log("Mutating color3 to be a float");
        Color.mutate2Int(color3);
        console.log(color3.toString());

        console.log("calling color3.isFloat())");
        console.log(color3.isFloat());
        */
    }


    // Apply gamma-encoding (gamma-compression) to the colors.
    // https://www.scratchapixel.com/lessons/digital-imaging/digital-images
    // http://blog.johnnovak.net/2016/09/21/what-every-coder-should-know-about-gamma/
    static applyGamma(color)
    {
        if (color instanceof Color == false)
            throw new Error("Color is not of type Color");

        const newRed   = 255 * Math.pow(color.getRed()/255,   Color.GAMMA);
        const newGreen = 255 * Math.pow(color.getGreen()/255, Color.GAMMA);
        const newBlue  = 255 * Math.pow(color.getBlue()/255,  Color.GAMMA);

        return new Color(newRed, newGreen, newBlue);
    }


    static hexToRgba(hex)
    {
        if (hex.match(/^#[A-Fa-f0-9]{6}/))
        {
            return new Array([parseInt(hex.substring(1, 3), 16),
                              parseInt(hex.substring(3, 5), 16),
                              parseInt(hex.substring(5, 7), 16),
                              255]);
        }

        return new Array([0, 0, 0, 255]);
    }


    static RgbToHex(color)
    {
        if (color instanceof Color == false)
            throw new Error("Color is not of type Color");

        return "#" + Color.intToHex(color[0]) + Color.intToHex(color[1]) + Color.intToHex(color[2]);
    }


    static intToHex(x)
    {
        if (x < 10)
        {
            return "0" + x.toString(16);
        }

        return x.toString(16);
    }
}