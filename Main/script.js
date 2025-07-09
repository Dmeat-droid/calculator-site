// Mendapatkan elemen-elemen DOM
const calculator = document.querySelector('.calculator');
const calculatorScreen = document.querySelector('.calculator-screen');
const calculatorHistory = document.querySelector('.calculator-history');
const keys = calculator.querySelector('.calculator-keys');

// --- Variabel State Kalkulator ---
let currentInput = '0'; // Angka yang sedang ditampilkan di layar utama
let previousInput = ''; // Angka pertama dalam operasi
let operator = null; // Operator yang dipilih (+, -, *, /)
let waitingForSecondOperand = false; // Flag: true jika kalkulator menunggu angka kedua
let hasCalculated = false; // Flag: true setelah tombol '=' ditekan

/**
 * Memperbarui tampilan layar utama kalkulator.
 */
function updateScreen() {
    calculatorScreen.value = currentInput;
}

/**
 * Memperbarui tampilan riwayat operasi.
 * @param {string} historyText - Teks riwayat yang akan ditampilkan.
 */
function updateHistory(historyText) {
    calculatorHistory.textContent = historyText;
}

/**
 * Menambahkan digit ke input saat ini.
 * @param {string} digit - Digit yang ditekan.
 */
function inputDigit(digit) {
    if (waitingForSecondOperand) {
        // Jika sedang menunggu angka kedua, ganti input saat ini dengan digit baru
        currentInput = digit;
        waitingForSecondOperand = false;
        hasCalculated = false; // Reset flag setelah input digit baru
    } else if (hasCalculated) {
        // Jika sebelumnya sudah ada hasil perhitungan, mulai input baru
        currentInput = digit;
        hasCalculated = false;
        previousInput = ''; // Reset previousInput
        operator = null; // Reset operator
        updateHistory(''); // Hapus riwayat
    } else {
        // Jika input saat ini adalah '0', ganti dengan digit baru.
        // Jika tidak, tambahkan digit ke input saat ini.
        currentInput = currentInput === '0' ? digit : currentInput + digit;
    }
}

/**
 * Menambahkan titik desimal ke input saat ini.
 */
function inputDecimal() {
    if (waitingForSecondOperand) {
        // Jika sedang menunggu angka kedua dan langsung menekan titik, mulai dengan "0."
        currentInput = '0.';
        waitingForSecondOperand = false;
        hasCalculated = false;
        return;
    }
    if (hasCalculated) { // Perbaikan typo: hasCalcululated menjadi hasCalculated
        // Jika sebelumnya sudah ada hasil perhitungan, mulai input baru dengan "0."
        currentInput = '0.';
        hasCalculated = false;
        previousInput = '';
        operator = null;
        updateHistory('');
        return;
    }
    // Hanya tambahkan titik jika belum ada titik di input saat ini
    if (!currentInput.includes('.')) {
        currentInput += '.';
    }
}

/**
 * Menangani logika ketika tombol operator ditekan.
 * @param {string} nextOperator - Operator yang ditekan (+, -, *, /).
 */
function handleOperator(nextOperator) {
    const inputValue = parseFloat(currentInput);

    // Jika sudah ada operator dan sedang menunggu angka kedua,
    // berarti pengguna mengganti operator (misal: "5 + *" menjadi "5 *").
    if (operator && waitingForSecondOperand) {
        operator = nextOperator;
        updateHistory(`${previousInput} ${operator}`); // Perbarui riwayat
        return;
    }

    // Jika previousInput masih kosong (operasi pertama)
    if (previousInput === '') {
        previousInput = inputValue;
    } else if (operator) {
        // Jika ada operator yang menunggu dan previousInput sudah ada, lakukan perhitungan
        const result = performCalculation(previousInput, inputValue, operator);
        currentInput = String(parseFloat(result.toFixed(7))); // Batasi desimal dan konversi ke string
        previousInput = result; // Hasil menjadi angka pertama untuk operasi berantai
    }

    waitingForSecondOperand = true; // Set flag untuk menunggu angka kedua
    operator = nextOperator; // Simpan operator yang baru
    hasCalculated = false; // Reset flag perhitungan
    updateHistory(`${previousInput} ${operator}`); // Tampilkan riwayat operasi
}

/**
 * Melakukan perhitungan berdasarkan operator.
 * @param {number} firstOperand - Angka pertama.
 * @param {number} secondOperand - Angka kedua.
 * @param {string} operator - Operator (+, -, *, /).
 * @returns {number|string} Hasil perhitungan, atau 'Error' jika pembagian dengan nol.
 */
function performCalculation(firstOperand, secondOperand, operator) {
    if (operator === '+') return firstOperand + secondOperand;
    if (operator === '-') return firstOperand - secondOperand;
    if (operator === '*') return firstOperand * secondOperand;
    if (operator === '/') {
        if (secondOperand === 0) {
            return 'Error'; // Menangani pembagian dengan nol
        }
        return firstOperand / secondOperand;
    }
    return secondOperand; // Default, misal jika tidak ada operator yang valid
}

/**
 * Mereset kalkulator ke kondisi awal.
 */
function resetCalculator() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    waitingForSecondOperand = false;
    hasCalculated = false;
    updateHistory(''); // Hapus riwayat
}

// --- Event Listener untuk Klik Tombol ---
keys.addEventListener('click', (event) => {
    const { target } = event; // Mendapatkan elemen tombol yang diklik

    // Pastikan yang diklik adalah tombol
    if (!target.matches('button')) {
        return;
    }

    // Logika berdasarkan jenis tombol
    if (target.classList.contains('operator')) {
        if (target.value === '=') {
            // Logika untuk tombol '='
            if (operator && !waitingForSecondOperand) { // Pastikan ada operasi dan angka kedua sudah dimasukkan
                const inputValue = parseFloat(currentInput);
                const result = performCalculation(previousInput, inputValue, operator);

                if (result === 'Error') {
                    currentInput = 'Error'; // Tampilkan pesan error
                    updateHistory(''); // Hapus riwayat
                } else {
                    currentInput = String(parseFloat(result.toFixed(7))); // Batasi desimal
                    updateHistory(`${previousInput} ${operator} ${inputValue} =`); // Tampilkan operasi lengkap
                }

                previousInput = ''; // Reset untuk operasi baru
                operator = null; // Reset operator
                waitingForSecondOperand = false;
                hasCalculated = true; // Set flag bahwa perhitungan sudah selesai
            }
        } else {
            // Logika untuk operator lain (+, -, *, /)
            handleOperator(target.value);
        }
    } else if (target.classList.contains('decimal')) {
        inputDecimal();
    } else if (target.classList.contains('all-clear')) {
        resetCalculator();
    } else if (target.classList.contains('parenthesis')) { // Menangani tombol kurung
        if (waitingForSecondOperand) {
            currentInput = target.value;
            waitingForSecondOperand = false;
            hasCalculated = false;
        } else if (hasCalculated) {
            currentInput = target.value;
            hasCalculated = false;
            previousInput = '';
            operator = null;
            updateHistory('');
        } else {
            currentInput = currentInput === '0' ? target.value : currentInput + target.value;
        }
    }
    else {
        // Logika untuk tombol angka
        inputDigit(target.value);
    }

    updateScreen(); // Perbarui tampilan layar setelah setiap aksi
});

// Inisialisasi tampilan awal saat halaman dimuat
updateScreen();
