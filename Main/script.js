const display = document.getElementById('display');
const buttons = document.querySelectorAll('.button');

let currentInput = '0';
let operator = null;
let previousInput = '';
let resetDisplay = false;

// Function to update the display
function updateDisplay() {
    display.textContent = currentInput;

    // Dynamic font size adjustment
    if (display.scrollWidth > display.clientWidth) {
        if (display.classList.contains('small-text')) {
            display.classList.remove('small-text');
            display.classList.add('smaller-text');
        }
        else if (display.classList.contains('smaller-text')) {
            // Do nothing, already at smallest size
        }
        else {
            display.classList.add('small-text');
        }
    }
    else {
        display.classList.remove('small-text', 'smaller-text');
    }
}

// Function to handle number and decimal button clicks
function handleNumber(value) {
    if (currentInput === '0' || resetDisplay) {
        currentInput = value;
        resetDisplay = false;
    } else {
        currentInput += value;
    }
    updateDisplay();
}

// Function to handle operator button clicks
function handleOperator(nextOperator) {
    if (operator && !resetDisplay) {
        // If there's an existing operator and we're not resetting, calculate first
        calculate();
    }
    previousInput = currentInput;
    operator = nextOperator;
    resetDisplay = true; // Prepare to clear display for next number
}

// Function to perform calculations
function calculate() {
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(current)) return; // Don't calculate if inputs are not numbers

    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                display.textContent = 'Error: Div by 0';
                currentInput = '0';
                previousInput = '';
                operator = null;
                return; // Exit function to prevent further calculation
            }
            result = prev / current;
            break;
        default:
            return; // No operator, do nothing
    }

    currentInput = result.toString();
    operator = null;
    previousInput = '';
    resetDisplay = true; // After calculation, next number should clear display
    updateDisplay();
}

// Function to clear the calculator
function clearCalculator() {
    currentInput = '0';
    operator = null;
    previousInput = '';
    resetDisplay = false;
    updateDisplay();
}

// Add event listeners to all buttons
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.dataset.value;

        if (value >= '0' && value <= '9' || value === '.') {
            handleNumber(value);
        } else if (value === 'C') {
            clearCalculator();
        } else if (value === '=') {
            calculate();
        } else { // It's an operator
            handleOperator(value);
        }
    });
});

// Initialize display on load
updateDisplay();

// Add keyboard support
document.addEventListener('keydown', (event) => {
    const key = event.key;
    
    if (key >= '0' && key <= '9' || key === '.') {
        handleNumber(key);
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        handleOperator(key);
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Backspace' || key === 'Delete') {
        // Implement backspace functionality here if needed
        // For example:
        // currentInput = currentInput.slice(0, -1);
        // if (currentInput === '') currentInput = '0';
        // updateDisplay();
    } else if (key === 'c' || key === 'C') {
        clearCalculator();
    }
});
