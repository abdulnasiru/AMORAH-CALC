export function tokenize(expression) {
    const tokens = [];
    let i = 0;
    while (i < expression.length) {
        const char = expression[i];
        if (/\s/.test(char)) {
            i++;
            continue;
        }
        if (isDigit(char) || char === ".") {
            let number = "";
            while (
                i < expression.length &&
                (isDigit(expression[i]) || expression[i] === ".")
            ) {
                number += expression[i];
                i++;
            }
            tokens.push({
                type: "number",
                value: Number(number)
            });
            continue;
        }

        if (isLetter(char)) {
            let identifier = "";
            while (
                i < expression.length &&
                (isLetter(expression[i]) || isDigit(expression[i]))
            ) {
                identifier += expression[i];
                i++;
            }
            tokens.push({
                type: "identifier",
                value: identifier
            });
            continue;
        }
        if ("+-*/^".includes(char)) {
            tokens.push({
                type: "operator",
                value: char
            });
            i++;
            continue;
        }
        if (char === "(" || char === ")") {
            tokens.push({
                type: "parenthesis",
                value: char
            });
            i++;
            continue;
        }
        if (char === ",") {
            tokens.push({
                type: "comma",
                value: ","
            });
            i++;
            continue;
        }
        throw new Error(
            `Unknown character: ${char}`
        );
    }
    return tokens;
}
function isDigit(char) {
    return char >= "0" && char <= "9";
}
function isLetter(char) {
    return (
        (char >= "a" && char <= "z") ||
        (char >= "A" && char <= "Z")
    );

}