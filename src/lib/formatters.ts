export function convertToCurrency(
    param: string | number,
    locale: Intl.LocalesArgument = "en",
    currency: Intl.NumberFormatOptions["currency"] = "PHP",
) {
    let number: number;
    if (typeof param === "number") {
        number = param;
    } else if (typeof param === "string" && !isNaN(Number(param))) {
        number = Number.parseFloat(param);
    } else {
        return 0;
    }
    return Intl.NumberFormat(locale, {
        currency: currency,
        style: "currency",
    }).format(number);
}


const ONES = [
    "",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
];

const TEENS = [
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
];

const TENS = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
];

const SCALES = ["", "thousand", "million", "billion", "trillion"];

function convertHundreds(num: number): string {
    const parts: string[] = [];

    if (num >= 100) {
        parts.push(`${ONES[Math.floor(num / 100)]} hundred`);
        num %= 100;
    }

    if (num >= 20) {
        parts.push(TENS[Math.floor(num / 10)]);
        num %= 10;
    } else if (num >= 10) {
        parts.push(TEENS[num - 10]);
        num = 0;
    }

    if (num > 0) {
        parts.push(ONES[num]);
    }

    return parts.join(" ");
}

function integerToWords(num: number): string {
    if (num === 0) return "zero";

    const parts: string[] = [];
    let scale = 0;

    while (num > 0) {
        const chunk = num % 1000;

        if (chunk > 0) {
            const text = convertHundreds(chunk);
            parts.unshift(`${text}${SCALES[scale] ? ` ${SCALES[scale]}` : ""}`);
        }

        num = Math.floor(num / 1000);
        scale++;
    }

    return parts.join(" ");
}

export function numberToWords(value: number | string): string {
    const [integerPart, decimalPart] = String(value).split(".");

    const integerWords = integerToWords(Number(integerPart));

    if (!decimalPart) {
        return integerWords;
    }

    const decimalWords = decimalPart
        .split("")
        .map((digit) => ONES[Number(digit)] || "zero")
        .join(" ");

    return `${integerWords} point ${decimalWords}`;
}
