
import { tokenize } from "./engine/tokenizer.js";
import { parse } from "./engine/parser.js";
import { evaluate } from "./engine/evaluator.js";

const expressionInput=document.getElementById("expression");
const resultDisplay=document.getElementById("result");
const keypad=document.getElementById("keypad");
const calculateButton=document.getElementById("calculate-button");

function calculate(expression) {
    const tokens=tokenize(expression);
    const ast=parse(tokens);
    const result=evaluate(ast);
    return result;
}

function performCalculation(){
    const expression=expressionInput.value.trim();
    if(!expression){
        resultDisplay.textContent="0";
        return;
    }
    try{
        const result=calculate(expression);
        resultDisplay.textContent=result;
        expressionInput.focus();
    }
    catch(error){
        resultDisplay.textContent=error.message;
    }
    expressionInput.focus();
}

function insertValue(value){
    const input=expressionInput;
    const start=input.selectionStart;
    const end=input.selectionEnd;
    const currentValue=input.value;
    input.value=currentValue.slice(0,start)+value+currentValue.slice(end);
    const newCursorPosition=start+value.length;
    input.setSelectionRange(
        newCursorPosition,newCursorPosition
    );
    input.focus();
}

function backspace(){
    const input=expressionInput;
    const start=input.selectionStart;
    const end=input.selectionEnd;
    if(start!==end){
        input.value=input.value.slice(0,start)+input.value.slice(end);
        input.setSelectionRange(start,start);
        input.focus();
        return;
    }
    if(start===0){
        input.focus();
        return;
    }
    input.value=input.value.slice(0,start-1)+input.value.slice(end);
    input.setSelectionRange(start-1,start-1);
    input.focus();
}

function clearInput(){
    expressionInput.value="";
    resultDisplay.textContent="0";
    expressionInput.focus();
}

keypad.addEventListener("click",(event)=>{
    const button=event.target.closest(".key");
    if(!button){return;}
    const value=button.dataset.value;
    const action=button.dataset.action;
    if(value!==undefined){
        insertValue(value);
        return;
    }
    if(action==="calculate"){
        performCalculation();
        return;
    }
    if(action==="clear"){
        clearInput();
        return;
    }
    if(action==="backspace"){
        backspace();
        return;
    }
});

calculateButton.addEventListener("click",performCalculation);
expressionInput.addEventListener("keydown",(event)=>{
    if(event.key==="Enter"){
        event.preventDefault();
        performCalculation();
        expressionInput.focus();
    }
});