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


// Function to delete the last character of the current input
function deleteLastCharacter() {
    if (currentInput === 'Error') {
        resetCalculator(); // Reset the calculator if the current input is 'Error'
        return
    }
    if (currentInput.length > 1 && currentInput !== '0') {
        currentInput = currentInput.slice(0, -1); // Remove the last character  
    } else {
        currentInput = '0'; // If only one character left, reset to '0'
    }

    if (currentInput === '-') {
        currentInput = '0'; // If the input is just a negative sign, reset to '0'
    }
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
    
    } else if (target.classList.contains('delete')) {
        // Handle delete button
        deleteLastCharacter();
    } else {
        // Handle number input
        handleNumberInput(target.value);
    }

    // Update the calculator screen after each input
    updateScreen();
});


// Debouncing setup to prevent rapid key presses
let keyPressTimeout;
const debounceTime = 150; // Adjust this value as needed (milliseconds)

document.addEventListener('keydown', (event) => {
    const key = event.key;

    // Clear any existing timeout
    clearTimeout(keyPressTimeout);

    // Set a new timeout to execute the key handling after the debounce time
    keyPressTimeout = setTimeout(() => {
        switch (key) {
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                handleNumberInput(key);
                break;
            case '.':
                handleDecimalInput();
                break;
            case '+':
            case '-':
            case '*':
            case '/':
                handleOperatorInput(key);
                break;
            case 'Enter':
            case '=':
                // Directly call handle operator in this scenario
                handleOperatorInput('=');
                break;
            case 'Backspace':
                deleteLastCharacter();
                break;
            case 'Escape':
                resetCalculator();
                break;
            default:
                return;
        }
        updateScreen(); // Update screen only after the timeout
    }, debounceTime);
});

// Initialize the calculator screen
updateScreen();

// Theme Switching functionality
const themeToggle = document.getElementById('theme-toggle-checkbox');
const body = document.body;

// Set theme based on saved preference or system setting on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    // Check if user has a system preference for dark mode
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        body.classList.add('dark-mode');
        themeToggle.checked = false;
    } else {
        body.classList.remove('dark-mode');
        themeToggle.checked = true;
    }
});

// Listen for toggle clicks to change the theme and save the preference
themeToggle.addEventListener('change', () => {
    if (themeToggle.checked) {
        body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    }
});