/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   A partial implementation of Java's String.format() method.
*/

//@ts-check

/**
 *
 * @param {string} str
 * @param  {...any} values
 * @returns {string} the formated string
 */
export function format(str, ... values)
{
    if (typeof str != "string")
        throw new Error("Str must be a string");

    let newStr = "";
    let valueIndex = 0;

    for (let x = 0; x < str.length; x += 1)
    {
        if (str.charAt(x) != '%')
        {
            newStr += str.charAt(x);
		}
        else // %03d or %.2f or %s
        {
            let formatStr = "";
            while (str.charAt(++x) != 'd' && str.charAt(x) != 'f' && str.charAt(x) != 's')
            {
                formatStr += str.charAt(x);
			}
            formatStr += str.charAt(x);

            newStr += replace(formatStr, values[valueIndex++]);
        }
    }

    return newStr;
}


function replace(format, value)
{
    let form = "";

    for (let x = 0; x < format.length; x += 1)
    {
        const afterMod = format.charAt(x);

        if (afterMod == 'd')
        {
            if (typeof value != "number")
                throw new Error("Value must be numerical but got type " + typeof value);

            return Math.trunc(value).toString();
        }
        else if (afterMod == 'f')
        {
            if (typeof value != "number")
                throw new Error("Value must be numerical but got type " + typeof value);

            return value.toString();
        }
        else if (afterMod == 's')
        {
            if (typeof value != "string")
                throw new Error("Value must be string but got type " + typeof value);

            return value;
        }
        else // not a simple replacement
        {
            let widthFormat = "0";

            while (format.charAt(x) != '.' && format.charAt(x) != 'd' && format.charAt(x) != 'f')
            {
                widthFormat += format.charAt(x++);
			}

            if (format.charAt(x) == '.')
            {
                form += handleWidth(widthFormat, value, true);
                let end = x;

                x += 1;
                while (format.charAt(x) != 'd' && format.charAt(x) != 'f')
                {    end += 1; x += 1; }

                form += handlePrecision(format.substring(x, end), value);
                x += 1;
            }
            else
            {
                form += handleWidth(widthFormat, value, false);
			}
        }
    }

    return form;
}


function handleWidth(format, value, truncate) // goes from 0 to numbers, no decimal so when reach end thats it
{
    let endStr = "";

    if (truncate)
        value = Math.trunc(value); // truncate to include just integers not decimals

    let width = Number(format);
    let valueStr = value.toString();

    if (valueStr.length < width)
    {
        for (let x = 0; x < width - valueStr.length; x += 1)
        {
            endStr += '0';
		}

        endStr += valueStr;
    }
    else if (valueStr.length-1 >= width)
    {
       endStr = valueStr.substring(0, width);
    }
    else
    {
        endStr += valueStr;
	}

    return endStr;
}


function handlePrecision(format, value) // contains decimal plus optional numbers
{
    let endStr = "";

    if (format.length == 0)
        return ".";

    let precision = Number(format);
    let valueStr = value.toString();

    let decimalStr = "";
    if (valueStr.includes("."))
    {
        decimalStr = valueStr.substring(valueStr.indexOf(".")+1);

        if (decimalStr.length > precision)
        {
            decimalStr = decimalStr.substring(0, precision);
		}
        else if (decimalStr.length < precision)
        {
            while (decimalStr.length < precision)
            {
                decimalStr += '0';
			}
        }
    }
    else
    {
        while (precision-- > 0)
        {
            decimalStr += '0';
		}
    }

    return "." + decimalStr;
}