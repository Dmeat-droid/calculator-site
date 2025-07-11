console.log("Calculator script loaded");

// Declare variables for the calculator elements
const calculatorScreen = document.getElementById('calculator-screen');
const calculatorKeys = document.querySelector('.calculator-keys');

// Initialize the calculator state
let currentInput = '';
let previousInput = '';
let operator = null;
let waitingForSecondOperand = false;

// Function to update the calculator screen
function updateScreen() {
    calculatorScreen.value = currentInput || '0';
}

function performCalculation(firstOperand, secondOperand, operator) {
    if (operator === '+') return firstOperand + secondOperand;
    if (operator === '-') return firstOperand - secondOperand;
    if (operator === '*') return firstOperand * secondOperand;
    if (operator === '/') {
        if (secondOperand === 0) {// Check for division by zero
            alert("Cannot divide by zero");
            return Error;// Return an error value if the division is by zero
        }
        return firstOperand / secondOperand;
    }
    return secondOperand; // If no operator, return the second operand
}

// Function to reset the calculator state
function resetCalculator() {
    currentInput = '';
    previousInput = '';
    operator = null;
    waitingForSecondOperand = false;
    updateScreen();
}

// Function to handle number input
function handleNumberInput(number) {
    if (waitingForSecondOperand) {
        currentInput = number;
        waitingForSecondOperand = false;
    } else {
        currentInput = currentInput === '0' ? number : currentInput + number;
    }
}

// Function to handle decimal input
function handleDecimalInput() {
    if (waitingForSecondOperand) {
        currentInput = '0.';
        waitingForSecondOperand = false;
        return
    } 

    //when there is no decimal point in the current input
    if (!currentInput.includes('.')) {
        currentInput += '.';
    }
}

// Function to handle operator input
function handleOperatorInput(nextOperator) {
    const inputValue = parseFloat(currentInput);

    // If the input is another operator, update the operator
    if (operator && waitingForSecondOperand) {
        operator = nextOperator;
        return;
    }

    // If the previous input still empty, set this as first operand
    if (previousInput === '') {
        previousInput = inputValue;
    }else if (operator) {
        const result = performCalculation(previousInput, inputValue, operator);
        
        // Check if the result is an error
        if (result === Error) {
            currentInput = 'Error';
            resetCalculator();
            return;
        }

        // If there's no error, update the previous input with the result
        currentInput = String(parseFloat(result.toFixed(7)));
        previousInput = result;
    }

    waitingForSecondOperand = true;
    operator = nextOperator;
}

calculatorKeys.addEventListener('click', (event) => {
    const { target } = event; // Use object destructuring to get the target element

    if (!target.matches('button')) return; // Make sure the clicked element is a button

    if (target.classList.contains('operator')) {
        // Handle operator input
        if (target.value === '=') {
            // If the equals button is clicked, perform the calculation
            // Only perform when we're not waiting for a second operand
            if (operator && !waitingForSecondOperand) {
                const inputValue = parseFloat(currentInput);
                const result = performCalculation(previousInput, inputValue, operator);

                if (result === Error) {
                    currentInput = 'Error'; // Show error on screen
                }else{
                    currentInput = String(parseFloat(result.toFixed(7))); // Update screen with result
                }

                // Reset the calculator state after calculation
                previousInput = '';
                operator = null;
                waitingForSecondOperand = false;

            }
        } else {
            // Handle other operators
            handleOperatorInput(target.value);
        }
    } else if (target.classList.contains('decimal')) {
        // Handle decimal input
        handleDecimalInput();
    } else if (target.classList.contains('all-clear')) {
        // Handle all clear button
        resetCalculator();
    } else {
        // Handle number input
        handleNumberInput(target.value);
    }

    // Update the calculator screen after each input
    updateScreen();
});


// Initialize the calculator screen
updateScreen();