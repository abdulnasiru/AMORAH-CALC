const CONSTANTS={
    pi:Math.PI,
    e:Math.E
};
const FUNCTIONS={
    sin:(x)=>Math.sin(x),
    cos:(x)=>Math.cos(x),
    tan:(x)=>Math.tan(x),
    sqrt:(x)=>Math.sqrt(x),
    log:(x)=>Math.log10(x),
    In:(x)=>Math.log(x),
    abs:(x)=>Math.abs(x),
    floor:(x)=>Math.floor(x),
    ceil:(x)=>Math.ceil(x),
    exp:(x)=>Math.exp(x)
};

export function evaluate(node) {
    if (node.type === "number") {
        return node.value;
    }
    if(node.type==="constant"){
        if(!(node.name in CONSTANTS)){
            throw new Error(`Unknown constant: ${node.name}`);
        }
        return CONSTANTS[node.name];
    }
    if (node.type === "unary") {
        const value = evaluate(node.argument);
        if (node.operator === "+") {
            return value;
        }
        if (node.operator === "-") {
            return -value;
        }
        throw new Error(
            `Unknown unary operator: ${node.operator}`
        );
    }
    if (node.type === "binary") {
        const left = evaluate(node.left);
        const right = evaluate(node.right);
        switch (node.operator) {
            case "+":
                return left + right;
            case "-":
                return left - right;
            case "*":
                return left * right;
            case "/":
                if (right === 0) {
                    throw new Error("Cannot divide by zero.");
                }
                return left / right;
            case "^":
                return Math.pow(left, right);
            default:
                throw new Error(
                    `Unknown operator: ${node.operator}`
                );
        }
    }
    if(node.type==="function"){
        const functionName=node.name;
        if(!(functionName in FUNCTIONS)){
            throw new Error(`Unknown function: ${functionName}`);
        }
        const mathematicalFunction=FUNCTIONS[functionName];
        const argumentsList=node.arguments.map(argument=>
            evaluate(argument)
        );
        return mathematicalFunction(...argumentsList);
    }
    throw new Error(
        `Unknown node type: ${node.type}`
    );
}