// ========================================
// VARIABLES
// ========================================

let currentValue = "";
let previousValue = "";
let operator = null;
let shouldResetScreen = false;


// ========================================
// ELEMENTOS DEL DOM
// ========================================

const currentDisplay =
    document.getElementById("current-operation");

const previousDisplay =
    document.getElementById("previous-operation");

const buttons =
    document.querySelectorAll(".button");


// ========================================
// ACTUALIZAR PANTALLA
// ========================================

function updateDisplay() {

    currentDisplay.textContent =
        currentValue || "0";

    previousDisplay.textContent =
        previousValue && operator
            ? `${previousValue} ${getOperatorSymbol(operator)}`
            : "";
}


// ========================================
// SÍMBOLOS DE OPERADORES
// ========================================

function getOperatorSymbol(operator) {

    const symbols = {
        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷"
    };

    return symbols[operator] || operator;
}


// ========================================
// AGREGAR NÚMERO
// ========================================

function appendNumber(number) {

    if (shouldResetScreen) {

        currentValue = "";

        shouldResetScreen = false;
    }

    currentValue += number;

    updateDisplay();
}


// ========================================
// AGREGAR DECIMAL
// ========================================

function appendDecimal() {

    if (shouldResetScreen) {

        currentValue = "0";

        shouldResetScreen = false;
    }

    if (currentValue.includes(".")) {
        return;
    }

    currentValue =
        currentValue === ""
            ? "0."
            : currentValue + ".";

    updateDisplay();
}


// ========================================
// SELECCIONAR OPERADOR
// ========================================

function chooseOperator(selectedOperator) {

    if (currentValue === "") {
        return;
    }

    if (operator !== null && !shouldResetScreen) {

        calculate();
    }

    previousValue = currentValue;

    operator = selectedOperator;

    shouldResetScreen = true;

    updateDisplay();
}


// ========================================
// CALCULAR
// ========================================

function calculate() {

    if (
        previousValue === "" ||
        currentValue === "" ||
        operator === null
    ) {
        return;
    }

    const firstNumber =
        parseFloat(previousValue);

    const secondNumber =
        parseFloat(currentValue);

    let result;


    switch (operator) {

        case "+":
            result = firstNumber + secondNumber;
            break;

        case "-":
            result = firstNumber - secondNumber;
            break;

        case "*":
            result = firstNumber * secondNumber;
            break;

        case "/":

            if (secondNumber === 0) {

                showError();

                return;
            }

            result = firstNumber / secondNumber;

            break;

        default:
            return;
    }


    // Evitar demasiados decimales
    result =
        Math.round((result + Number.EPSILON) * 100000000)
        / 100000000;


    currentValue =
        result.toString();

    previousValue = "";

    operator = null;

    shouldResetScreen = true;

    updateDisplay();
}


// ========================================
// LIMPIAR
// ========================================

function clearCalculator() {

    currentValue = "";

    previousValue = "";

    operator = null;

    shouldResetScreen = false;

    updateDisplay();
}


// ========================================
// BORRAR
// ========================================

function deleteLastDigit() {

    if (shouldResetScreen) {
        return;
    }

    currentValue =
        currentValue.slice(0, -1);

    updateDisplay();
}


// ========================================
// ERROR
// ========================================

function showError() {

    currentDisplay.textContent =
        "Error";

    previousDisplay.textContent =
        "No se puede dividir para 0";

    currentValue = "";

    previousValue = "";

    operator = null;

    shouldResetScreen = true;
}


// ========================================
// EVENTOS DE LOS BOTONES
// ========================================

buttons.forEach(button => {

    button.addEventListener("click", () => {

        const value =
            button.dataset.value;

        const action =
            button.dataset.action;


        // Número
        if (
            value !== undefined &&
            !action
        ) {

            if (value === ".") {

                appendDecimal();

            } else {

                appendNumber(value);
            }

            return;
        }


        // Operador
        if (action === "operator") {

            chooseOperator(value);

            return;
        }


        // Limpiar
        if (action === "clear") {

            clearCalculator();

            return;
        }


        // Borrar
        if (action === "delete") {

            deleteLastDigit();

            return;
        }


        // Calcular
        if (action === "calculate") {

            calculate();
        }

    });

});


// ========================================
// SOPORTE PARA TECLADO
// ========================================

document.addEventListener("keydown", event => {

    const key = event.key;


    // Números
    if (/^[0-9]$/.test(key)) {

        appendNumber(key);

        return;
    }


    // Decimal
    if (key === ".") {

        appendDecimal();

        return;
    }


    // Operadores
    if (
        key === "+" ||
        key === "-" ||
        key === "*" ||
        key === "/"
    ) {

        chooseOperator(key);

        return;
    }


    // Enter
    if (key === "Enter" || key === "=") {

        calculate();

        return;
    }


    // Backspace
    if (key === "Backspace") {

        deleteLastDigit();

        return;
    }


    // Escape
    if (key === "Escape") {

        clearCalculator();
    }

});


// ========================================
// INICIALIZAR
// ========================================

updateDisplay();

