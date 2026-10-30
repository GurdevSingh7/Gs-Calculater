
const screen = document.getElementById("screen");
const historyBox = document.getElementById("history");

let expression = "";
let justCalculated = false;

function updateScreen() {
    screen.value = expression || "0";
}

function append(value) {
    const operators = ["+", "-", "*", "/", "%"];

    if (justCalculated) {
        if (!operators.includes(value)) {
            expression = "";
        }
        justCalculated = false;
    }

    if (operators.includes(value)) {
        if (expression === "" && value !== "-") return;

        const last = expression.slice(-1);

        if (operators.includes(last)) {
            expression = expression.slice(0, -1);
        }
    }

    expression += value;
    updateScreen();
}

function clearScreen() {
    expression = "";
    historyBox.textContent = "";
    justCalculated = false;
    updateScreen();
}

function deleteLast() {
    expression = expression.slice(0, -1);
    justCalculated = false;
    updateScreen();
}

function calculate() {
    if (!expression) return;

    try {
        if (!/^[0-9+\-*/%.() ]+$/.test(expression)) {
            throw new Error("Invalid expression");
        }

        const result = Function(
            '"use strict"; return (' + expression + ')'
        )();

        if (!Number.isFinite(result)) {
            throw new Error("Invalid calculation");
        }

        historyBox.textContent = expression + " =";

        expression = String(
            Number.parseFloat(result.toPrecision(12))
        );

        justCalculated = true;
        updateScreen();

    } catch (error) {
        screen.value = "Error";
        expression = "";
        justCalculated = false;
    }
}

// Keyboard support
document.addEventListener("keydown", (event) => {
    const key = event.key;

    if (/^[0-9.+\-*/%]$/.test(key)) {
        append(key);
    } else if (key === "Enter" || key === "=") {
        calculate();
    } else if (key === "Backspace") {
        deleteLast();
    } else if (key === "Escape") {
        clearScreen();
    }
});
