export function parse(tokens) {
    let current = 0;
    function peek() {
        return tokens[current];
    }
    function consume() {
        return tokens[current++];
    }
    function match(value) {
        if (peek()?.value === value) {
            current++;
            return true;
        }
        return false;
    }
    function parseExpression() {
        let node = parseTerm();
        while (
            peek()?.value === "+" ||
            peek()?.value === "-"){
            const operator = consume().value;
            const right = parseTerm();
            node = {
                type: "binary",
                operator,
                left: node,
                right
            };
        }
        return node;
    }
    function parseTerm() {
        let node = parsePower();
        while (
            peek()?.value === "*" ||
            peek()?.value === "/"){
            const operator = consume().value;
            const right = parsePower();
            node = {
                type: "binary",
                operator,
                left: node,
                right
            };
        }
        return node;
    }
    function parsePower() {
        let node = parseUnary();
        if (match("^")) {
            const right = parsePower();
            node = {
                type: "binary",
                operator: "^",
                left: node,
                right
            };
        }
        return node;
    }
    function parseUnary() {
        if (match("+")) {
            return {
                type: "unary",
                operator: "+",
                argument: parseUnary()
            };
        }
        if (match("-")) {
            return {
                type: "unary",
                operator: "-",
                argument: parseUnary()
            };
        }
        return parsePrimary();
    }
    function parsePrimary() {
        const token = peek();
        if (!token) {
            throw new Error(
                "Unexpected end of expression."
            );
        }
        if (token.type === "number") {
            consume();
            return {
                type: "number",
                value: token.value
            };
        }
        if (token.type === "identifier") {
            return parseIdentifier();
        }
        if (match("(")) {
            const node = parseExpression();
            if (!match(")")) {
                throw new Error(
                    "Expected closing parenthesis."
                );
            }
            return node;
        }
        throw new Error(
            `Unexpected token: ${token.value}`
        );
    }
    function parseIdentifier() {
        const name = consume().value;
        if (match("(")) {
            const argumentsList = [];
            if (!match(")")) {
                argumentsList.push(
                    parseExpression()
                );
                while (match(",")) {
                    argumentsList.push(
                        parseExpression()
                    );
                }
                if (!match(")")) {
                    throw new Error(
                        "Expected closing parenthesis after function arguments."
                    );
                }
            }
            return {
                type: "function",
                name,
                arguments: argumentsList
            };
        }
        return {
            type: "constant",
            name
        };
    }
    const ast = parseExpression();
    if (current < tokens.length) {
        throw new Error(
            `Unexpected token: ${peek().value}`
        );
    }
    return ast;
}